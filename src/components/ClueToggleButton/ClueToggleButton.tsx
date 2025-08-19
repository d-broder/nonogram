import styles from './ClueToggleButton.module.css';

interface ClueToggleButtonProps {
  stickyEnabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function ClueToggleButton({ stickyEnabled, onToggle, disabled = false }: ClueToggleButtonProps) {
  return (
    <button
      className={`${styles.toggleButton} ${stickyEnabled ? styles.enabled : styles.disabled}`}
      onClick={onToggle}
      disabled={disabled}
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
