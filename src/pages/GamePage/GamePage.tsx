import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { usePuzzleLoader } from "../../hooks/usePuzzleLoader";
import { useGameState } from "../../hooks/useGameState";
import { useZoom } from "../../hooks/useZoom";
import { useFirebaseRoom } from "../../hooks/useFirebaseRoom";
import { useGameStateMigration } from "../../hooks/useGameStateMigration";
import { useAppNavigation } from "../../contexts/AppNavigationContext";
import { GameBoard } from "../../components/GameBoard";
import { PageLayout } from "../../components/PageLayout";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import type { CellState } from "../../types";
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
    ? JSON.parse(sessionStorage.getItem("playerInfo") || "{}")
    : null;

  const { room, updateGridCell, updateClueState, resetRoomToWaiting } =
    useFirebaseRoom(roomId || null);

  // Check if current player is the creator (controls game controls visibility)
  // For multiplayer, check the real-time room data; for single player, always true
  const isCreator =
    !isMultiplayer ||
    (currentPlayerInfo &&
      room &&
      room.players[currentPlayerInfo.id]?.isCreator);
  const { migrateToMultiplayer } = useGameStateMigration();

  // States for multiplayer sidebar
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);

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
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Sync sessionStorage with Firebase room data when player becomes host
  useEffect(() => {
    if (
      isMultiplayer &&
      currentPlayerInfo &&
      room &&
      room.players[currentPlayerInfo.id]
    ) {
      const updatedPlayerInfo = room.players[currentPlayerInfo.id];
      // Only update if there's a change to avoid unnecessary writes
      if (updatedPlayerInfo.isCreator !== currentPlayerInfo.isCreator) {
        sessionStorage.setItem("playerInfo", JSON.stringify(updatedPlayerInfo));
      }
    }
  }, [isMultiplayer, currentPlayerInfo, room]);
  const [stickyClues, setStickyClues] = useState(true);
  const [showPlayerIndicators, setShowPlayerIndicators] = useState(true);

  // State for clue clicks (moved from GameBoard to sync with Firebase)
  const [clickedRowClues, setClickedRowClues] = useState<Set<string>>(
    new Set()
  );
  const [clickedColClues, setClickedColClues] = useState<Set<string>>(
    new Set()
  );

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Clue click handlers for multiplayer sync
  const handleRowClueClick = async (
    rowIndex: number,
    clueIndex: number | string
  ) => {
    const clueId = `row-${rowIndex}-${clueIndex}`;
    const isCurrentlyClicked = clickedRowClues.has(clueId);
    const newState = !isCurrentlyClicked; // Toggle state

    // Update local state immediately for responsive UI
    const newSet = new Set(clickedRowClues);
    if (newState) {
      newSet.add(clueId);
    } else {
      newSet.delete(clueId);
    }
    setClickedRowClues(newSet);

    // If multiplayer, sync to Firebase
    if (isMultiplayer && roomId) {
      try {
        await updateClueState(clueId, newState);
      } catch (error) {
        console.error("Error syncing clue to Firebase:", error);
        // Revert local state on error
        setClickedRowClues(clickedRowClues);
      }
    }
  };

  const handleColClueClick = async (
    colIndex: number,
    clueIndex: number | string
  ) => {
    const clueId = `col-${colIndex}-${clueIndex}`;
    const isCurrentlyClicked = clickedColClues.has(clueId);
    const newState = !isCurrentlyClicked; // Toggle state

    // Update local state immediately for responsive UI
    const newSet = new Set(clickedColClues);
    if (newState) {
      newSet.add(clueId);
    } else {
      newSet.delete(clueId);
    }
    setClickedColClues(newSet);

    // If multiplayer, sync to Firebase
    if (isMultiplayer && roomId) {
      try {
        await updateClueState(clueId, newState);
      } catch (error) {
        console.error("Error syncing clue to Firebase:", error);
        // Revert local state on error
        setClickedColClues(clickedColClues);
      }
    }
  };

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
    }
    // For non-multiplayer URL-based navigation, let the Link component handle it
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

  // Handle puzzle completion with success animation (gameBoardArea instead of body)
  useEffect(() => {
    let animationActive = false;
    let gameBoardArea: HTMLElement | null = null;
    let currentColor = false;
    let timeoutId: number | undefined;

    if (gameState.isComplete && !completionRef.current) {
      completionRef.current = true;
      animationActive = true;
      gameBoardArea = document.querySelector(
        `.${styles.gameBoardArea}`
      ) as HTMLElement;
      if (gameBoardArea) {
        const colorA = "#b6f5c1";
        const colorB = gameBoardArea.style.backgroundColor || "";
        gameBoardArea.style.transition = "background-color 2s ease-in-out";

        const animate = () => {
          if (!animationActive) return;
          currentColor = !currentColor;
          gameBoardArea!.style.backgroundColor = currentColor ? colorA : colorB;
          timeoutId = window.setTimeout(animate, 2000);
        };
        animate();
      }
    }

    // Cleanup: para a animação quando o componente desmontar ou o puzzle mudar
    return () => {
      animationActive = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (gameBoardArea) {
        gameBoardArea.style.backgroundColor = "";
        gameBoardArea.style.transition = "";
      }
    };
  }, [gameState.isComplete, styles.gameBoardArea]);

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
      {/* Success message overlay */}
      {gameState.isComplete && (
        <div className={styles.successOverlay}>
          <h1 className={styles.successMessage}>
            {(type === "classic" ? "CLASSIC" : "SUPER").toUpperCase()} PUZZLE{" "}
            {puzzle.id} SOLVED
          </h1>
        </div>
      )}

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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showClearConfirmation}
        title="Clear Grid"
        message="Are you sure you want to clear the entire grid? This action cannot be undone."
        onConfirm={handleConfirmClear}
        onCancel={handleCancelClear}
        confirmText="Yes"
        cancelText="No"
      />
    </PageLayout>
  );
}
