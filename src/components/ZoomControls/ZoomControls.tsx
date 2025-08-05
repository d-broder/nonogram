import styles from './ZoomControls.module.css';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
}

export function ZoomControls({ onZoomIn, onZoomOut, canZoomIn, canZoomOut }: ZoomControlsProps) {
  return (
    <div className={styles.zoomControls}>
      <button
        onClick={onZoomOut}
        disabled={!canZoomOut}
        className={`${styles.zoomBtn} ${styles.zoomOut}`}
        aria-label="Zoom out"
        type="button"
      >
        <span className={styles.icon}>−</span>
      </button>
      <button
        onClick={onZoomIn}
        disabled={!canZoomIn}
        className={`${styles.zoomBtn} ${styles.zoomIn}`}
        aria-label="Zoom in"
        type="button"
      >
        <span className={styles.icon}>+</span>
      </button>
    </div>
  );
}
