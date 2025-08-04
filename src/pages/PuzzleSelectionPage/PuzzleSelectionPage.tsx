import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePuzzleLoader } from '../../hooks/usePuzzleLoader';
import styles from './PuzzleSelectionPage.module.css';

export function PuzzleSelectionPage() {
  const { type } = useParams<{ type: 'classic' | 'super' }>();
  const navigate = useNavigate();
  const { availablePuzzles, loading, error } = usePuzzleLoader();

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
          <Link to="/" className={styles.backButton}>Back to Home</Link>
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
            <Link
              key={puzzleId}
              to={`/game/${type}/${puzzleId}`}
              className={styles.puzzleButton}
            >
              <span className={styles.puzzleNumber}>{puzzleId}</span>
            </Link>
          ))}
        </div>

        <div className={styles.controls}>
          <Link to="/" className={styles.backButton}>
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
