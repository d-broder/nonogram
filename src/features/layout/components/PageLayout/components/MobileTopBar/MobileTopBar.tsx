import { ProjectTitle } from "../ProjectTitle";
import styles from "./MobileTopBar.module.css";

interface MobileTopBarProps {
  // Left side button
  leftButton?: {
    icon: string;
    onClick: () => void;
    ariaLabel: string;
  };

  // Right side button
  rightButton?: {
    icon: string;
    onClick: () => void;
    ariaLabel: string;
  };

  // Backwards compatibility
  isGamePage?: boolean;
  isMultiplayer?: boolean;
  onToggleSidebar?: () => void;
}

export function MobileTopBar({
  leftButton,
  rightButton,
  // Backwards compatibility props (maintained for API compatibility)
  onToggleSidebar,
}: MobileTopBarProps) {
  // Handle backwards compatibility
  const finalRightButton =
    rightButton ||
    (onToggleSidebar
      ? {
          icon: "☰",
          onClick: onToggleSidebar,
          ariaLabel: "Open menu",
        }
      : undefined);

  // Show right button if explicitly provided OR if there's a toggle sidebar callback
  const showRightButton = finalRightButton && (rightButton || onToggleSidebar);

  return (
    <div className={styles.mobileTopBar}>
      {/* Left button (back button, etc.) */}
      {leftButton && (
        <button
          onClick={leftButton.onClick}
          className={styles.leftButton}
          aria-label={leftButton.ariaLabel}
        >
          {leftButton.icon}
        </button>
      )}

      {/* Project Title - Always centered */}
      <ProjectTitle className={styles.projectTitle} />

      {/* Right button (hamburger, close, etc.) */}
      {showRightButton && (
        <button
          onClick={finalRightButton.onClick}
          className={styles.rightButton}
          aria-label={finalRightButton.ariaLabel}
        >
          {finalRightButton.icon}
        </button>
      )}
    </div>
  );
}
