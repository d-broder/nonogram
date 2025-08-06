import { useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { usePuzzleLoader } from '../../hooks/usePuzzleLoader';
import { useFirebaseRoom } from '../../hooks/useFirebaseRoom';
import styles from './PuzzleSelectionPage.module.css';

export function PuzzleSelectionPage() {
  const { type, roomId } = useParams<{ type: 'classic' | 'super'; roomId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { availablePuzzles, loading, error } = usePuzzleLoader();
  const { updatePuzzleSelection } = useFirebaseRoom(roomId || null);

  // Check if this is a multiplayer context
  const isMultiplayer = location.pathname.includes('/multiplayer/');

  // Redirect if invalid type
  useEffect(() => {
    if (type && type !== 'classic' && type !== 'super') {
      navigate('/');
    }
  }, [type, navigate]);

  if (!type || (type !== 'classic' && type !== 'super')) {
    return null;
  }

  const puzzles = availablePuzzles[type];
  const title = type === 'classic' ? 'Classic Nonogram' : 'Super Nonogram';

  // Handle puzzle selection for multiplayer
  const handlePuzzleClick = async (puzzleId: number) => {
    if (isMultiplayer && roomId) {
      try {
        // Update Firebase with puzzle selection
        await updatePuzzleSelection(type, puzzleId);
        // Navigate to game
        navigate(`/multiplayer/game/${roomId}/${type}/${puzzleId}`);
      } catch (error) {
        console.error('Error updating puzzle selection:', error);
        // Fallback: navigate anyway
        navigate(`/multiplayer/game/${roomId}/${type}/${puzzleId}`);
      }
    } else {
      // Single player: navigate directly
      navigate(`/game/${type}/${puzzleId}`);
    }
  };

  // Generate back link based on context
  const getBackLink = () => {
    if (isMultiplayer && roomId) {
      return `/multiplayer/room/${roomId}/select-type`;
    }
    return '/puzzles';
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading puzzles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Error loading puzzles: {error}</p>
          <Link to={getBackLink()} className={styles.backButton}>Back</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>Select a puzzle to start playing</p>
      </header>

      <main className={styles.main}>
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

        <div className={styles.controls}>
          <Link to={getBackLink()} className={styles.backButton}>
            ← Back
          </Link>
        </div>
      </main>
    </div>
  );
}
