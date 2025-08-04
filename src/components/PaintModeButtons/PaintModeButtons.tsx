import type { PaintMode } from '../../types';
import styles from './PaintModeButtons.module.css';

interface PaintModeButtonsProps {
  currentMode: PaintMode;
  onModeChange: (mode: PaintMode) => void;
}

export function PaintModeButtons({ currentMode, onModeChange }: PaintModeButtonsProps) {
  return (
    <div className={styles.card}>
      <div className={styles.paintModeButtons}>
        <button
          className={`${styles.paintModeBtn} ${styles.black} ${currentMode === 'black' ? styles.selected : ''}`}
          onClick={() => onModeChange('black')}
          aria-label="Black mode"
          type="button"
        >
          ■
        </button>
        <button
          className={`${styles.paintModeBtn} ${styles.x} ${currentMode === 'x' ? styles.selected : ''}`}
          onClick={() => onModeChange('x')}
          aria-label="X mode"
          type="button"
        >
          ⨯
        </button>
        <button
          className={`${styles.paintModeBtn} ${styles.o} ${currentMode === 'o' ? styles.selected : ''}`}
          onClick={() => onModeChange('o')}
          aria-label="O mode"
          type="button"
        >
          ●
        </button>
      </div>
    </div>
  );
}
