import React from "react";
import { ConfirmationModal } from "../../../features/ui";

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
  onSuccessClose,
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
        <div className="success-modal-overlay" onClick={onSuccessClose}>
          <div className="success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="success-content">
              <h2>🎉 Parabéns!</h2>
              <p>Você completou o puzzle com sucesso!</p>
              <button onClick={onSuccessClose} className="success-close-btn">
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
