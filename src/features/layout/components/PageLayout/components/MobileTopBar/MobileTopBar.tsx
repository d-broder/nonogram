import styles from "./MobileTopBar.module.css";

interface MobileTopBarProps {
  isGamePage?: boolean;
  isMultiplayer?: boolean;
  onToggleSidebar: () => void;
}

export function MobileTopBar({
  isGamePage = false,
  isMultiplayer = false,
  onToggleSidebar,
}: MobileTopBarProps) {
  const showHamburger = isGamePage || isMultiplayer || !isMultiplayer;

  return (
    <div className={styles.mobileTopBar}>
      <div className={styles.projectTitle}>NonoParty</div>
      {showHamburger && (
        <button
          onClick={onToggleSidebar}
          className={styles.hamburgerButton}
          aria-label="Open menu"
        >
          ☰
        </button>
      )}
    </div>
  );
}
