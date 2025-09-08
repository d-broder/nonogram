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
  onClearGrid,
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
