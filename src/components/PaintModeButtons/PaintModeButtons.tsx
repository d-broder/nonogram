import type { PaintMode } from '../../types';
import styles from './PaintModeButtons.module.css';
import iconSquare from '../../assets/icon-square.png';
import iconX from '../../assets/icon-x.png';
import iconO from '../../assets/icon-o.png';

interface PaintModeButtonsProps {
  currentMode: PaintMode;
  onModeChange: (mode: PaintMode) => void;
  isComplete?: boolean;
}

export function PaintModeButtons({ currentMode, onModeChange, isComplete = false }: PaintModeButtonsProps) {
  return (
    <div className={styles.paintModeButtons}>
      <button
        className={`${styles.paintModeBtn} ${styles.black} ${currentMode === 'black' ? styles.selected : ''}`}
        onClick={() => onModeChange('black')}
        disabled={isComplete}
        aria-label="Black mode"
        type="button"
      >
        <img src={iconSquare} alt="Black square" className={styles.icon} />
      </button>
      <button
        className={`${styles.paintModeBtn} ${styles.x} ${currentMode === 'x' ? styles.selected : ''}`}
        onClick={() => onModeChange('x')}
        disabled={isComplete}
        aria-label="X mode"
        type="button"
      >
        <img src={iconX} alt="X mark" className={styles.icon} />
      </button>
      <button
        className={`${styles.paintModeBtn} ${styles.o} ${currentMode === 'o' ? styles.selected : ''}`}
        onClick={() => onModeChange('o')}
        disabled={isComplete}
        aria-label="O mode"
        type="button"
      >
        <img src={iconO} alt="O mark" className={styles.icon} />
      </button>
    </div>
  );
}
