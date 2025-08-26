import type { ReactNode } from 'react';
import styles from './ButtonGroup.module.css';

export type ButtonGroupDirection = 'row' | 'column';

interface ButtonGroupProps {
  title?: string;
  direction?: ButtonGroupDirection;
  children: ReactNode;
  className?: string;
}

export function ButtonGroup({
  title,
  direction = 'column',
  children,
  className = ''
}: ButtonGroupProps) {
  const groupClasses = [
    styles.buttonGroup,
    styles[direction],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={groupClasses}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.buttons}>
        {children}
      </div>
    </div>
  );
}
