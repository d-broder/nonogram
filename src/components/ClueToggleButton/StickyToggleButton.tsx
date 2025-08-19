import styles from './StickyToggleButton.module.css';

interface StickyToggleButtonProps {
  stickyEnabled: boolean;
  onToggle: () => void;
}

export function StickyToggleButton({ stickyEnabled, onToggle }: StickyToggleButtonProps) {
  return (
    <button
      className={`${styles.toggleButton} ${stickyEnabled ? styles.enabled : styles.disabled}`}
      onClick={onToggle}
      aria-label={`${stickyEnabled ? 'Disable' : 'Enable'} sticky clues`}
      title={`${stickyEnabled ? 'Disable' : 'Enable'} sticky clues`}
    >
      <div className={styles.icon}>
        {stickyEnabled ? '📌' : '📍'}
      </div>
      <span className={styles.label}>
        {stickyEnabled ? 'Lock' : 'Free'}
      </span>
    </button>
  );
}
