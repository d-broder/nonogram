import type { ReactNode } from "react";
import { COLOR_VALUES, AVAILABLE_COLORS } from "../../constants";
import type { PlayerColor } from "../../types";
import styles from "./RoomForm.module.css";

export interface RoomFormProps {
  // Form data
  playerName: string;
  selectedColor: PlayerColor;
  isLoading: boolean;
  error: string | null;
  usedColors?: PlayerColor[];

  // Form handlers
  onPlayerNameChange: (name: string) => void;
  onColorChange: (color: PlayerColor) => void;
  onSubmit: () => void;
  onCancel?: () => void;

  // Configuration
  submitLabel: string;
  title?: string;
  showCancel?: boolean;
  layout?: "modal" | "inline" | "page";

  // Additional content
  children?: ReactNode;
}

export const RoomForm: React.FC<RoomFormProps> = ({
  playerName,
  selectedColor,
  isLoading,
  error,
  usedColors = [],
  onPlayerNameChange,
  onColorChange,
  onSubmit,
  onCancel,
  submitLabel,
  title,
  showCancel = false,
  layout = "inline",
  children,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const isColorDisabled = (color: PlayerColor) => {
    return isLoading || usedColors.includes(color);
  };

  const containerClass = `${styles.form} ${styles[layout]}`;

  return (
    <form className={containerClass} onSubmit={handleSubmit}>
      {title && <h2 className={styles.title}>{title}</h2>}

      {children && <div className={styles.additionalContent}>{children}</div>}

      <div className={styles.fieldGroup}>
        <div className={styles.field}>
          <label htmlFor="playerName" className={styles.label}>
            Display Name
          </label>
          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => onPlayerNameChange(e.target.value)}
            placeholder="Enter your name..."
            className={styles.input}
            maxLength={20}
            disabled={isLoading}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Player Color</label>
          <div className={styles.colorGrid}>
            {AVAILABLE_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`${styles.colorButton} ${
                  selectedColor === color ? styles.selected : ""
                } ${isColorDisabled(color) ? styles.disabled : ""}`}
                style={{ backgroundColor: COLOR_VALUES[color] }}
                onClick={() => !isColorDisabled(color) && onColorChange(color)}
                disabled={isColorDisabled(color)}
                aria-label={`Select ${color} color`}
                title={
                  usedColors.includes(color) ? "Color already taken" : undefined
                }
              />
            ))}
          </div>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.actions}>
        {showCancel && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={!playerName.trim() || isLoading}
        >
          {isLoading ? `${submitLabel}...` : submitLabel}
        </button>
      </div>
    </form>
  );
};
