import { Link } from "react-router-dom";
import styles from "./GameControls.module.css";

interface GameControlsProps {
  onShowSolution: () => void;
  onClearGrid: () => void;
  showSolution: boolean;
  puzzleType: "classic" | "super";
  isComplete: boolean;
  onBackToPuzzles?: () => void;
}

export function GameControls({
  onShowSolution,
  onClearGrid,
  showSolution,
  isComplete,
  onBackToPuzzles,
}: GameControlsProps) {
  return (
    <div className={styles.controlGroup}>
      {onBackToPuzzles ? (
        <button
          onClick={onBackToPuzzles}
          className={styles.button}
          type="button"
        >
          ⯇ Back to Puzzles
        </button>
      ) : (
        <Link to={`/`} className={styles.button}>
          ⯇ Back to Puzzles
        </Link>
      )}
      <button
        onClick={onShowSolution}
        className={`${styles.button} ${styles.solutionButton} ${
          showSolution ? styles.active : ""
        }`}
        disabled={isComplete}
        type="button"
      >
        {showSolution ? "Hide Solution" : "Show Solution"}
      </button>

      <button
        onClick={onClearGrid}
        className={styles.button}
        disabled={isComplete}
        type="button"
      >
        Clear Grid
      </button>
    </div>
  );
}
