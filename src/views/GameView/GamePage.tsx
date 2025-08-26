import { useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { usePuzzleLoader, useGameState, useZoom } from "../../features/game";
import { useGameStateMigration } from "../../features/game/hooks/useGameStateMigration";
import { useFirebaseRoom } from "../../features/room";
import { useAppNavigation } from "../../shared/contexts/AppNavigationContext";
import { GameBoard } from "../../features/game";
import { PageLayout } from "../../features/layout";
import type { CellState } from "../../shared/types";
import { useGamePageState, useGamePageSync } from "./hooks";
import { GameModals } from "./components";
import styles from "./GamePage.module.css";

interface GamePageProps {
  puzzleType?: "classic" | "super";
  puzzleId?: number;
  isMultiplayerMode?: boolean;
}

export function GamePage({
  puzzleType,
  puzzleId,
  isMultiplayerMode,
}: GamePageProps = {}) {
  const { type, id, roomId } = useParams<{
    type: "classic" | "super";
    id: string;
    roomId?: string;
  }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { navigateToPuzzleSelection } = useAppNavigation();
  const { puzzle, loading, error, loadSpecificPuzzle } = usePuzzleLoader();

  // Use props if provided, otherwise fall back to URL params
  const effectiveType = puzzleType || type;
  const effectiveId = puzzleId?.toString() || id;
  const isUsingProps = Boolean(puzzleType && puzzleId);

  // Check if this is multiplayer mode
  const isMultiplayer =
    isMultiplayerMode || location.pathname.includes("/multiplayer/");

  // Get current player info for multiplayer
  const currentPlayerInfo = isMultiplayer
    ? (() => {
        try {
          const stored = sessionStorage.getItem("playerInfo");
          return stored ? JSON.parse(stored) : null;
        } catch (error) {
          console.error("Error parsing playerInfo:", error);
          return null;
        }
      })()
    : null;

  const { room, updateGridCell, updateClueState, resetRoomToWaiting } =
    useFirebaseRoom(roomId || null);

  const { migrateToMultiplayer } = useGameStateMigration();

  // Use extracted state management hook
  const {
    showTooltip,
    setShowTooltip,
    isMigrating,
    setIsMigrating,
    showClearConfirmation,
    setShowClearConfirmation,
    isMobile,
    stickyClues,
    setStickyClues,
    showPlayerIndicators,
    setShowPlayerIndicators,
    clickedRowClues,
    setClickedRowClues,
    clickedColClues,
    setClickedColClues,
    isCreator,
  } = useGamePageState({
    isMultiplayer,
    currentPlayerInfo,
    room,
  });

  const {
    gameState,
    initializeGame,
    handleCellMouseDown,
    handleCellMouseEnter,
    handleCellMouseUp,
    setPaintMode,
    clearGameGrid,
    toggleSolution,
    updateCellExternally,
  } = useGameState(puzzle, {
    onCellChange: isMultiplayer && roomId ? updateGridCell : undefined,
    playerId: currentPlayerInfo?.id,
  });

  const {
    config: zoomConfig,
    zoomIn,
    zoomOut,
    resetZoom,
    canZoomIn,
    canZoomOut,
    zoomPercentage,
  } = useZoom();

  const completionRef = useRef(false);

  // Sync sessionStorage with Firebase room data when player becomes host
  useEffect(() => {
    if (
      isMultiplayer &&
      currentPlayerInfo &&
      currentPlayerInfo.id &&
      room &&
      room.players &&
      room.players[currentPlayerInfo.id]
    ) {
      const updatedPlayerInfo = room.players[currentPlayerInfo.id];
      // Only update if there's a change to avoid unnecessary writes
      if (
        updatedPlayerInfo &&
        updatedPlayerInfo.isCreator !== currentPlayerInfo.isCreator
      ) {
        sessionStorage.setItem("playerInfo", JSON.stringify(updatedPlayerInfo));
      }
    }
  }, [isMultiplayer, currentPlayerInfo, room]);

  // Use sync hook for clue clicks
  const { handleRowClueClick, handleColClueClick } = useGamePageSync({
    isMultiplayer,
    roomId,
    updateClueState,
    clickedRowClues,
    setClickedRowClues,
    clickedColClues,
    setClickedColClues,
  });

  // Clear grid with confirmation
  const handleClearGridClick = () => {
    setShowClearConfirmation(true);
  };

  const handleConfirmClear = () => {
    clearGameGrid();
    setShowClearConfirmation(false);
  };

  const handleCancelClear = () => {
    setShowClearConfirmation(false);
  };

  // Load puzzle when params change
  useEffect(() => {
    if (
      !effectiveType ||
      !effectiveId ||
      (effectiveType !== "classic" && effectiveType !== "super")
    ) {
      if (!isUsingProps) {
        navigate("/");
      }
      return;
    }

    const parsedPuzzleId = parseInt(effectiveId, 10);
    if (isNaN(parsedPuzzleId)) {
      if (!isUsingProps) {
        navigate("/");
      }
      return;
    }

    loadSpecificPuzzle(parsedPuzzleId, effectiveType);
  }, [effectiveType, effectiveId, navigate, loadSpecificPuzzle, isUsingProps]);

  // Initialize game when puzzle loads
  useEffect(() => {
    if (puzzle) {
      initializeGame(puzzle);
      completionRef.current = false;
    }
  }, [puzzle, initializeGame]);

  const handleCopyRoomLink = async () => {
    if (!roomId) return;

    const roomLink = `${window.location.origin}/${roomId}`;
    try {
      await navigator.clipboard.writeText(roomLink);
      setShowTooltip(true);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = roomLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setShowTooltip(true);
    }
  };

  // Handle room creation during game (migration from single to multiplayer)
  const handleRoomCreated = async (newRoomId: string, playerId: string) => {
    if (!puzzle) return;

    setIsMigrating(true);
    try {
      // Prepare migration data
      const migrationData = {
        gameState,
        puzzle,
        puzzleType: effectiveType!, // From URL params or props
        puzzleId: parseInt(effectiveId!), // From URL params or props
        creatorId: playerId, // Creator ID for cellAuthors
        clueStates: {
          clickedRowClues,
          clickedColClues,
        },
        uiSettings: {
          paintMode: gameState.paintMode,
          stickyClues,
          showPlayerIndicators,
        },
      };

      // Migrate current game state to the new room
      const result = await migrateToMultiplayer(newRoomId, migrationData);

      if (result.success) {
        // Navigate to the new room - MultiplayerRoomHandler will handle showing the correct view
        navigate(`/${newRoomId}`);
      } else {
        console.error("Migration failed:", result.error);
        // Could show error message to user here
      }
    } catch (error) {
      console.error("Error during room creation and migration:", error);
    } finally {
      setIsMigrating(false);
    }
  };

  // Handle back to puzzles with room reset for multiplayer
  const handleBackToPuzzles = async () => {
    if (isMultiplayer && isCreator && roomId) {
      try {
        await resetRoomToWaiting();
        // Navigation will be handled by the room state change
      } catch (error) {
        console.error("Error resetting room:", error);
      }
    } else if (isUsingProps) {
      navigateToPuzzleSelection();
    } else {
      navigate("/");
    }
  };

  // Listen for Firebase updates in multiplayer mode
  useEffect(() => {
    if (!isMultiplayer || !room) return;

    // Update grid based on Firebase room state
    if (room.grid) {
      Object.entries(room.grid).forEach(([cellId, cellState]) => {
        updateCellExternally(cellId, cellState as CellState);
      });
    }

    // Update clue states based on Firebase room state
    if (room.clues) {
      const newClickedRowClues = new Set<string>();
      const newClickedColClues = new Set<string>();

      Object.entries(room.clues).forEach(([clueId, isClicked]) => {
        if (isClicked) {
          if (clueId.startsWith("row-")) {
            newClickedRowClues.add(clueId);
          } else if (clueId.startsWith("col-")) {
            newClickedColClues.add(clueId);
          }
        }
      });

      setClickedRowClues(newClickedRowClues);
      setClickedColClues(newClickedColClues);
    }
  }, [room, isMultiplayer, updateCellExternally]);

  // Handle puzzle completion
  useEffect(() => {
    if (gameState.isComplete && !completionRef.current) {
      completionRef.current = true;
      if (isMultiplayer && isCreator && roomId) {
        resetRoomToWaiting();
      }
    }
  }, [
    gameState.isComplete,
    isMultiplayer,
    isCreator,
    roomId,
    resetRoomToWaiting,
  ]);

  // Loading and error states
  if (loading) {
    return (
      <PageLayout>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading puzzle...</p>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className={styles.error}>
          <h2>Error Loading Puzzle</h2>
          <p>{error}</p>
          <button
            onClick={() =>
              isUsingProps ? navigateToPuzzleSelection() : navigate("/")
            }
            className={styles.errorButton}
          >
            Return to Home
          </button>
        </div>
      </PageLayout>
    );
  }

  if (!puzzle || !effectiveType) {
    return (
      <PageLayout>
        <div className={styles.error}>
          <h2>Puzzle Not Found</h2>
          <p>The requested puzzle could not be found.</p>
          <button
            onClick={() =>
              isUsingProps ? navigateToPuzzleSelection() : navigate("/")
            }
            className={styles.errorButton}
          >
            Return to Home
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      isGamePage
      pageContentAreaHeight={isMobile ? "80%" : "full"}
      showMobileBottomBar={isMobile}
      isMultiplayer={isMultiplayer}
      roomId={roomId}
      players={room ? Object.values(room.players) : []}
      showTooltip={showTooltip}
      onCopyLink={handleCopyRoomLink}
      onHideTooltip={() => setShowTooltip(false)}
      onRoomCreated={handleRoomCreated}
      puzzle={puzzle}
      currentType={effectiveType}
      paintMode={gameState.paintMode}
      showSolution={gameState.showSolution}
      isComplete={gameState.isComplete}
      showGameControls={isCreator}
      onShowSolution={toggleSolution}
      onClearGrid={handleClearGridClick}
      onBackToPuzzles={handleBackToPuzzles}
      onHomeClick={isUsingProps ? navigateToPuzzleSelection : undefined}
      onModeChange={setPaintMode}
      onZoomIn={zoomIn}
      onZoomOut={zoomOut}
      onResetZoom={resetZoom}
      canZoomIn={canZoomIn}
      canZoomOut={canZoomOut}
      zoomPercentage={zoomPercentage}
      stickyClues={stickyClues}
      onStickyToggle={() => setStickyClues(!stickyClues)}
      showPlayerIndicators={showPlayerIndicators}
      onPlayerIndicatorToggle={() =>
        setShowPlayerIndicators(!showPlayerIndicators)
      }
      showClearConfirmation={showClearConfirmation}
      onConfirmClear={handleConfirmClear}
      onCancelClear={handleCancelClear}
    >
      {/* Game Modals */}
      <GameModals
        showClearConfirmation={showClearConfirmation}
        onClearConfirm={() => {
          clearGameGrid();
          setShowClearConfirmation(false);
        }}
        onClearCancel={() => setShowClearConfirmation(false)}
        isComplete={gameState.isComplete}
        onSuccessClose={() => {
          // Handle success modal close if needed
        }}
      />

      {/* Migration loading overlay */}
      {isMigrating && (
        <div className={styles.successOverlay}>
          <h1 className={styles.successMessage}>
            Creating Multiplayer Room...
          </h1>
        </div>
      )}

      <GameBoard
        puzzle={puzzle}
        grid={gameState.grid}
        showSolution={gameState.showSolution}
        onCellMouseDown={handleCellMouseDown}
        onCellMouseEnter={handleCellMouseEnter}
        onCellMouseUp={handleCellMouseUp}
        isComplete={gameState.isComplete}
        zoomConfig={zoomConfig}
        onRowClueClick={isMultiplayer ? handleRowClueClick : undefined}
        onColClueClick={isMultiplayer ? handleColClueClick : undefined}
        clickedRowClues={isMultiplayer ? clickedRowClues : undefined}
        clickedColClues={isMultiplayer ? clickedColClues : undefined}
        stickyClues={stickyClues}
        cellAuthors={isMultiplayer && room ? room.cellAuthors : undefined}
        players={isMultiplayer && room ? room.players : undefined}
        showPlayerIndicators={showPlayerIndicators}
      />
    </PageLayout>
  );
}
