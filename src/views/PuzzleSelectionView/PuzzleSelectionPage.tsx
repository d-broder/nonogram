import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { usePuzzleLoader } from "../../features/game";
import { useFirebaseRoom } from "../../features/room";
import { useAppNavigation } from "../../shared/contexts/AppNavigationContext";
import { PageLayout } from "../../features/layout";
import styles from "./PuzzleSelectionPage.module.css";

interface PuzzleSelectionPageProps {
  isMultiplayerMode?: boolean;
}

export function PuzzleSelectionPage({
  isMultiplayerMode,
}: PuzzleSelectionPageProps = {}) {
  const { roomId } = useParams<{ roomId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { navigateToGame } = useAppNavigation();
  const { availablePuzzles, loading, error } = usePuzzleLoader();
  const { updatePuzzleSelection, room } = useFirebaseRoom(roomId || null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedType, setSelectedType] = useState<"classic" | "super">(
    "classic"
  );

  // Check if this is a multiplayer context
  const isMultiplayer =
    isMultiplayerMode || location.pathname.includes("/multiplayer/");

  // Check if user is creator for multiplayer rooms
  useEffect(() => {
    if (isMultiplayer && roomId) {
      const playerInfo = sessionStorage.getItem("playerInfo");
      if (!playerInfo) {
        navigate("/");
        return;
      }

      // No need to check for creator status here - MultiplayerRoomHandler handles this
      // This code is only reached when we're in the correct context
    }
  }, [isMultiplayer, roomId, navigate]);

  const handleCopyRoomLink = async () => {
    if (!roomId) return;

    const roomLink = `${window.location.origin}/${roomId}`;
    try {
      await navigator.clipboard.writeText(roomLink);
      setShowTooltip(true);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = roomLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setShowTooltip(true);
    }
  };

  const handleHideTooltip = () => {
    setShowTooltip(false);
  };

  // Handle room creation during puzzle selection
  const handleRoomCreated = (newRoomId: string, _playerId: string) => {
    // Navigate to the new room URL - MultiplayerRoomHandler will handle the rest
    navigate(`/${newRoomId}`);
  };

  // Handle puzzle selection
  const handlePuzzleClick = async (puzzleId: number) => {
    if (isMultiplayer && roomId) {
      try {
        // Update Firebase with puzzle selection - this will change room status to 'playing'
        // MultiplayerRoomHandler will automatically detect this change and show GamePage
        await updatePuzzleSelection(selectedType, puzzleId);
        // No navigation needed - room status change will trigger re-render
      } catch (error) {
        console.error("Error updating puzzle selection:", error);
        // On error, try to reload the page to get fresh room status
        window.location.reload();
      }
    } else {
      // Single player: use internal navigation
      navigateToGame(selectedType, puzzleId);
    }
  };

  const puzzles = availablePuzzles[selectedType];

  if (loading) {
    return (
      <PageLayout
        isMultiplayer={isMultiplayer}
        roomId={roomId}
        players={room ? Object.values(room.players) : []}
        showTooltip={showTooltip}
        onCopyLink={handleCopyRoomLink}
        onHideTooltip={handleHideTooltip}
        onRoomCreated={handleRoomCreated}
      >
        <div className={styles.loading}>Loading puzzles...</div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout
        showBackButton
        isMultiplayer={isMultiplayer}
        roomId={roomId}
        players={room ? Object.values(room.players) : []}
        showTooltip={showTooltip}
        onCopyLink={handleCopyRoomLink}
        onHideTooltip={handleHideTooltip}
        onRoomCreated={handleRoomCreated}
      >
        <div className={styles.error}>
          <p>Error loading puzzles: {error}</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      isMultiplayer={isMultiplayer}
      roomId={roomId}
      players={room ? Object.values(room.players) : []}
      showTooltip={showTooltip}
      onCopyLink={handleCopyRoomLink}
      onHideTooltip={handleHideTooltip}
      onRoomCreated={handleRoomCreated}
    >
      <header className={styles.header}>
        <h1 className={styles.title}>Select Puzzle</h1>
        <p className={styles.subtitle}>
          Choose your puzzle type and select a puzzle to start playing
        </p>
      </header>

      {/* Puzzle Type Tabs */}
      <div className={styles.typeTabs}>
        <button
          className={`${styles.typeTab} ${
            selectedType === "classic" ? styles.activeTab : ""
          }`}
          onClick={() => setSelectedType("classic")}
        >
          Classic
        </button>
        <button
          className={`${styles.typeTab} ${
            selectedType === "super" ? styles.activeTab : ""
          }`}
          onClick={() => setSelectedType("super")}
        >
          Super
        </button>
      </div>

      {/* Puzzle Type Description */}
      <div className={styles.typeDescription}>
        {selectedType === "classic" ? (
          <p>Traditional nonogram puzzles with standard grid sizes</p>
        ) : (
          <p>Larger, more challenging nonogram puzzles</p>
        )}
      </div>

      {/* Puzzle Grid */}
      <div className={styles.puzzleGrid}>
        {puzzles.map((puzzleId) => (
          <button
            key={puzzleId}
            onClick={() => handlePuzzleClick(puzzleId)}
            className={styles.puzzleButton}
          >
            <span className={styles.puzzleNumber}>{puzzleId}</span>
          </button>
        ))}
      </div>
    </PageLayout>
  );
}
