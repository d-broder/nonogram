import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { usePuzzleLoader } from '../../hooks/usePuzzleLoader';
import { useFirebaseRoom } from '../../hooks/useFirebaseRoom';
import { PageLayout } from '../../components/PageLayout';
import styles from './PuzzleSelectionPage.module.css';

export function PuzzleSelectionPage() {
  const { roomId } = useParams<{ roomId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { availablePuzzles, loading, error } = usePuzzleLoader();
  const { updatePuzzleSelection, room } = useFirebaseRoom(roomId || null);
  const [roomLink, setRoomLink] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedType, setSelectedType] = useState<'classic' | 'super'>('classic');

  // Check if this is a multiplayer context
  const isMultiplayer = location.pathname.includes('/multiplayer/');

  // Set room link for multiplayer
  useEffect(() => {
    if (isMultiplayer && roomId) {
      const fullRoomLink = `${window.location.origin}/multiplayer/join/${roomId}`;
      setRoomLink(fullRoomLink);
    }
  }, [isMultiplayer, roomId]);

  // Check if user is creator for multiplayer rooms
  useEffect(() => {
    if (isMultiplayer && roomId) {
      const playerInfo = sessionStorage.getItem('playerInfo');
      if (!playerInfo) {
        navigate('/');
        return;
      }

      const player = JSON.parse(playerInfo);
      if (!player.isCreator) {
        navigate(`/multiplayer/room/${roomId}/waiting`);
        return;
      }
    }
  }, [isMultiplayer, roomId, navigate]);

  const handleCopyRoomLink = async () => {
    if (!roomLink) return;
    
    try {
      await navigator.clipboard.writeText(roomLink);
      setShowTooltip(true);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = roomLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowTooltip(true);
    }
  };

  const handleHideTooltip = () => {
    setShowTooltip(false);
  };

  // Handle puzzle selection
  const handlePuzzleClick = async (puzzleId: number) => {
    if (isMultiplayer && roomId) {
      try {
        // Update Firebase with puzzle selection
        await updatePuzzleSelection(selectedType, puzzleId);
        // Navigate to game
        navigate(`/multiplayer/game/${roomId}/${selectedType}/${puzzleId}`);
      } catch (error) {
        console.error('Error updating puzzle selection:', error);
        // Fallback: navigate anyway
        navigate(`/multiplayer/game/${roomId}/${selectedType}/${puzzleId}`);
      }
    } else {
      // Single player: navigate directly
      navigate(`/game/${selectedType}/${puzzleId}`);
    }
  };

  const puzzles = availablePuzzles[selectedType];

  if (loading) {
    return (
      <PageLayout
        showBackButton
        isMultiplayer={isMultiplayer}
        roomId={roomId}
        roomLink={roomLink}
        players={room ? Object.values(room.players) : []}
        showTooltip={showTooltip}
        onCopyLink={handleCopyRoomLink}
        onHideTooltip={handleHideTooltip}
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
        roomLink={roomLink}
        players={room ? Object.values(room.players) : []}
        showTooltip={showTooltip}
        onCopyLink={handleCopyRoomLink}
        onHideTooltip={handleHideTooltip}
      >
        <div className={styles.error}>
          <p>Error loading puzzles: {error}</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      showBackButton
      isMultiplayer={isMultiplayer}
      roomId={roomId}
      roomLink={roomLink}
      players={room ? Object.values(room.players) : []}
      showTooltip={showTooltip}
      onCopyLink={handleCopyRoomLink}
      onHideTooltip={handleHideTooltip}
    >
      <header className={styles.header}>
        <h1 className={styles.title}>Select Puzzle</h1>
        <p className={styles.subtitle}>Choose your puzzle type and select a puzzle to start playing</p>
      </header>

      {/* Puzzle Type Tabs */}
      <div className={styles.typeTabs}>
        <button
          className={`${styles.typeTab} ${selectedType === 'classic' ? styles.activeTab : ''}`}
          onClick={() => setSelectedType('classic')}
        >
          Classic
        </button>
        <button
          className={`${styles.typeTab} ${selectedType === 'super' ? styles.activeTab : ''}`}
          onClick={() => setSelectedType('super')}
        >
          Super
        </button>
      </div>

      {/* Puzzle Type Description */}
      <div className={styles.typeDescription}>
        {selectedType === 'classic' ? (
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
