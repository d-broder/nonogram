import { useEffect } from 'react';
import styles from './CopyTooltip.module.css';

interface CopyTooltipProps {
  text: string;
  show: boolean;
  onHide: () => void;
}

export function CopyTooltip({ text, show, onHide }: CopyTooltipProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide();
      }, 2000); // Hide after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  if (!show) return null;

  return (
    <div className={`${styles.tooltip} ${show ? styles.visible : ''}`}>
      {text}
    </div>
  );
}
