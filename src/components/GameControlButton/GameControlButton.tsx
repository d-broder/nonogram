import styles from './GameControlButton.module.css';
import iconSquare from '../../assets/icon-square.png';
import iconX from '../../assets/icon-x.png';
import iconO from '../../assets/icon-o.png';

export type ButtonSize = 'large' | 'small';
export type ButtonVariant = 'paint' | 'zoom' | 'toggle';

interface GameControlButtonProps {
  size?: ButtonSize;
  variant?: ButtonVariant;
  icon: string;
  label?: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title?: string;
  className?: string;
  paintMode?: 'black' | 'x' | 'o'; // For paint mode buttons
}

export function GameControlButton({
  size = 'large',
  variant = 'paint',
  icon,
  label,
  isActive = false,
  disabled = false,
  onClick,
  title,
  className = '',
  paintMode
}: GameControlButtonProps) {
  const buttonClasses = [
    styles.button,
    styles[size],
    styles[variant],
    isActive ? styles.active : '',
    disabled ? styles.disabled : '',
    className
  ].filter(Boolean).join(' ');

  // For paint mode buttons, use image icons instead of text
  const renderIcon = () => {
    if (variant === 'paint' && paintMode) {
      switch (paintMode) {
        case 'black':
          return <img src={iconSquare} alt="Black square" className={styles.paintIcon} />;
        case 'x':
          return <img src={iconX} alt="X mark" className={styles.paintIcon} />;
        case 'o':
          return <img src={iconO} alt="O mark" className={styles.paintIcon} />;
        default:
          return <div className={styles.icon}>{icon}</div>;
      }
    }
    return <div className={styles.icon}>{icon}</div>;
  };

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      title={title}
      type="button"
    >
      {renderIcon()}
      {label && variant !== 'paint' && <span className={styles.label}>{label}</span>}
    </button>
  );
}
