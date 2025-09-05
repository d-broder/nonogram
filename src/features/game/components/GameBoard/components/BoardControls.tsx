import React, { useCallback } from "react";

interface BoardControlsProps {
  // Touch handlers específicos do board
  onGridTouchStart: (e: React.TouchEvent) => void;
  onGridTouchMove: (e: React.TouchEvent) => void;
  onGridTouchEnd: (e: React.TouchEvent) => void;
  // Qualquer controle adicional futuro pode ser adicionado aqui
}

/**
 * Componente para controles específicos do GameBoard
 * Atualmente maneja principalmente eventos touch, mas pode ser expandido
 */
export function BoardControls({
  onGridTouchStart,
  onGridTouchMove,
  onGridTouchEnd,
}: BoardControlsProps) {
  // Handlers específicos para prevenir scroll em dispositivos mobile
  const handleGridTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.stopPropagation();
      onGridTouchStart(e);
    },
    [onGridTouchStart]
  );

  const handleGridTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onGridTouchMove(e);
    },
    [onGridTouchMove]
  );

  const handleGridTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.stopPropagation();
      onGridTouchEnd(e);
    },
    [onGridTouchEnd]
  );

  return {
    handleGridTouchStart,
    handleGridTouchMove,
    handleGridTouchEnd,
  };
}
