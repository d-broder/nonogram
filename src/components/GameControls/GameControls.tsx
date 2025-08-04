import { Link } from 'react-router-dom';
import styles from './GameControls.module.css';

interface GameControlsProps {
  onShowSolution: () => void;
  onClearGrid: () => void;
  showSolution: boolean;
  puzzleType: 'classic' | 'super';
  isComplete: boolean;
}

export function GameControls({ 
  onShowSolution, 
  onClearGrid, 
  showSolution, 
  puzzleType,
  isComplete 
}: GameControlsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.controlGroup}>
        <Link 
          to={`/puzzles/${puzzleType}`} 
          className={`${styles.button} ${styles.backButton}`}
        >
          ← Back to Puzzles
        </Link>
      </div>

      <div className={styles.controlGroup}>
        <button
          onClick={onShowSolution}
          className={`${styles.button} ${styles.solutionButton} ${showSolution ? styles.active : ''}`}
          type="button"
        >
          {showSolution ? 'Hide Solution' : 'Show Solution'}
        </button>

        <button
          onClick={onClearGrid}
          className={`${styles.button} ${styles.clearButton}`}
          disabled={isComplete}
          type="button"
        >
          Clear Grid
        </button>
      </div>
    </div>
  );
}
