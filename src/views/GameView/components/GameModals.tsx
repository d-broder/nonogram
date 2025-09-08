import React from "react";
import { ConfirmationModal } from "../../../features/ui";
import styles from "./GameModals.module.css";

interface GameModalsProps {
  showClearConfirmation: boolean;
  onClearConfirm: () => void;
  onClearCancel: () => void;
  isComplete: boolean;
  onSuccessClose: () => void;
  showExitConfirmation?: boolean;
  onExitConfirm?: () => void;
  onExitCancel?: () => void;
}

export const GameModals: React.FC<GameModalsProps> = ({
  showClearConfirmation,
  onClearConfirm,
  onClearCancel,
  isComplete,
  showExitConfirmation,
  onExitConfirm,
  onExitCancel,
}) => {
  return (
    <>
      {/* Clear confirmation modal */}
      {showClearConfirmation && (
        <ConfirmationModal
          isOpen={showClearConfirmation}
          title="Clear Grid"
          message="Are you sure you want to clear all grid progress?"
          confirmText="Yes, clear"
          cancelText="Cancel"
          onConfirm={onClearConfirm}
          onCancel={onClearCancel}
        />
      )}

      {/* Exit confirmation modal */}
      {showExitConfirmation && onExitConfirm && onExitCancel && (
        <ConfirmationModal
          isOpen={showExitConfirmation}
          title="Leave Game"
          message="Are you sure you want to leave? Your progress will be lost."
          confirmText="Yes, leave"
          cancelText="Cancel"
          onConfirm={onExitConfirm}
          onCancel={onExitCancel}
        />
      )}

      {/* Success modal */}
      {isComplete && (
        <div className={styles.successContent}>
          <p>YOU COMPLETED THE PUZZLE</p>
        </div>
      )}
    </>
  );
};
