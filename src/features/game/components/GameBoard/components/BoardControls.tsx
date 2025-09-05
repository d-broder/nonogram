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

/**
 * Hook que retorna os handlers de touch otimizados para o board
 */
export function useBoardControls() {
  // Grid-specific touch handlers to prevent page scroll only in grid area
  const handleGridTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
  }, []);

  const handleGridTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleGridTouchEnd = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
  }, []);

  return {
    handleGridTouchStart,
    handleGridTouchMove,
    handleGridTouchEnd,
  };
}
