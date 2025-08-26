import styles from "./MobileTopBar.module.css";

interface MobileTopBarProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
  isGamePage?: boolean;
  isMultiplayer?: boolean;
  onToggleSidebar: () => void;
}

export function MobileTopBar({
  showBackButton = false,
  onBackClick,
  isGamePage = false,
  isMultiplayer = false,
  onToggleSidebar,
}: MobileTopBarProps) {
  const showHamburger = isGamePage || isMultiplayer || !isMultiplayer;

  return (
    <div className={styles.mobileTopBar}>
      {showBackButton && (
        <button
          onClick={onBackClick}
          className={styles.backButton}
          aria-label="Go back"
        >
          ⯇
        </button>
      )}
      <div className={styles.projectTitle}>Nonogram</div>
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
