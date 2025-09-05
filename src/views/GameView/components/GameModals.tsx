import React from "react";
import { ConfirmationModal } from "../../../features/ui";
import styles from "./GameModals.module.css";

interface GameModalsProps {
  showClearConfirmation: boolean;
  onClearConfirm: () => void;
  onClearCancel: () => void;
  isComplete: boolean;
  onSuccessClose: () => void;
}

export const GameModals: React.FC<GameModalsProps> = ({
  showClearConfirmation,
  onClearConfirm,
  onClearCancel,
  isComplete,
}) => {
  return (
    <>
      {/* Clear confirmation modal */}
      {showClearConfirmation && (
        <ConfirmationModal
          isOpen={showClearConfirmation}
          title="Limpar Tabuleiro"
          message="Tem certeza que deseja limpar todo o progresso do tabuleiro?"
          confirmText="Sim, limpar"
          cancelText="Cancelar"
          onConfirm={onClearConfirm}
          onCancel={onClearCancel}
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
