import styles from "./MobileTopBarExpanded.module.css";

interface MobileTopBarExpandedProps {
  showMobileCreateRoom?: boolean;
  showMobileClearGrid?: boolean;
  onBackClick: () => void;
  onToggleSidebar: () => void;
}

export function MobileTopBarExpanded({
  showMobileCreateRoom = false,
  showMobileClearGrid = false,
  onBackClick,
  onToggleSidebar,
}: MobileTopBarExpandedProps) {
  const showBackButton = showMobileCreateRoom || showMobileClearGrid;

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
      <div className={styles.projectTitle}>NonoParty</div>
      <button
        onClick={onToggleSidebar}
        className={styles.closeButton}
        aria-label="Close menu"
      >
        ×
      </button>
    </div>
  );
}
