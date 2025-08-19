import styles from './PlayerIndicatorToggleButton.module.css';

interface PlayerIndicatorToggleButtonProps {
  showIndicators: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function PlayerIndicatorToggleButton({ showIndicators, onToggle, disabled = false }: PlayerIndicatorToggleButtonProps) {
  return (
    <button
      className={`${styles.toggleButton} ${showIndicators ? styles.enabled : styles.disabled}`}
      onClick={onToggle}
      disabled={disabled}
      aria-label={`${showIndicators ? 'Hide' : 'Show'} player indicators`}
      title={`${showIndicators ? 'Hide' : 'Show'} player indicators`}
    >
      <div className={styles.icon}>
        {showIndicators ? '👥' : '👤'}
      </div>
      <span className={styles.label}>
        {showIndicators ? 'Show' : 'Hide'}
      </span>
    </button>
  );
}
