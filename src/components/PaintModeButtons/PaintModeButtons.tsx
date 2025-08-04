import type { PaintMode } from '../../types';
import styles from './PaintModeButtons.module.css';
import iconSquare from '../../assets/icon-square.png';
import iconX from '../../assets/icon-x.png';
import iconO from '../../assets/icon-o.png';

interface PaintModeButtonsProps {
  currentMode: PaintMode;
  onModeChange: (mode: PaintMode) => void;
}

export function PaintModeButtons({ currentMode, onModeChange }: PaintModeButtonsProps) {
  return (
    <div className={styles.paintModeButtons}>
      <button
        className={`${styles.paintModeBtn} ${styles.black} ${currentMode === 'black' ? styles.selected : ''}`}
        onClick={() => onModeChange('black')}
        aria-label="Black mode"
        type="button"
      >
        <img src={iconSquare} alt="Black square" className={styles.icon} />
      </button>
      <button
        className={`${styles.paintModeBtn} ${styles.x} ${currentMode === 'x' ? styles.selected : ''}`}
        onClick={() => onModeChange('x')}
        aria-label="X mode"
        type="button"
      >
        <img src={iconX} alt="X mark" className={styles.icon} />
      </button>
      <button
        className={`${styles.paintModeBtn} ${styles.o} ${currentMode === 'o' ? styles.selected : ''}`}
        onClick={() => onModeChange('o')}
        aria-label="O mode"
        type="button"
      >
        <img src={iconO} alt="O mark" className={styles.icon} />
      </button>
    </div>
  );
}
