import { useCallback, useEffect } from "react";
import type { CellPosition } from "../../../../../shared/types";

interface UseGameBoardInteractionProps {
  isComplete: boolean;
  showSolution: boolean;
  onCellMouseDown: (position: CellPosition, button: number) => void;
  onCellMouseEnter: (position: CellPosition) => void;
  onCellMouseUp: () => void;
}

interface UseGameBoardInteractionReturn {
  handleCellMouseDown: (e: React.MouseEvent, row: number, col: number) => void;
  handleCellMouseEnter: (row: number, col: number) => void;
  handleCellTouchStart: (e: React.TouchEvent, row: number, col: number) => void;
  handleCellTouchMove: (e: React.TouchEvent) => void;
  handleCellTouchEnd: (e: React.TouchEvent) => void;
  handleContextMenu: (e: React.MouseEvent) => void;
}

/**
 * Hook para gerenciar todas as interações do GameBoard (mouse e touch)
 * Centraliza a lógica de eventos de input do usuário
 */
export function useGameBoardInteraction({
  isComplete,
  showSolution,
  onCellMouseDown,
  onCellMouseEnter,
  onCellMouseUp,
}: UseGameBoardInteractionProps): UseGameBoardInteractionReturn {
  // Mouse event handlers
  const handleCellMouseDown = useCallback(
    (e: React.MouseEvent, row: number, col: number) => {
      e.preventDefault();
      if (isComplete || showSolution) return;
      onCellMouseDown({ row, col }, e.button);
    },
    [onCellMouseDown, isComplete, showSolution]
  );

  const handleCellMouseEnter = useCallback(
    (row: number, col: number) => {
      if (isComplete || showSolution) return;
      onCellMouseEnter({ row, col });
    },
    [onCellMouseEnter, isComplete, showSolution]
  );

  // Touch event handlers for mobile support
  const handleCellTouchStart = useCallback(
    (e: React.TouchEvent, row: number, col: number) => {
      e.stopPropagation();
      if (isComplete || showSolution) return;
      onCellMouseDown({ row, col }, 0); // Treat touch as left mouse button
    },
    [onCellMouseDown, isComplete, showSolution]
  );

  const handleCellTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.stopPropagation();
      if (isComplete || showSolution) return;

      const touch = e.touches[0];
      if (!touch) return;

      // Find the element under the touch point
      const elementBelow = document.elementFromPoint(
        touch.clientX,
        touch.clientY
      );
      if (!elementBelow) return;

      // Check if it's a grid cell button
      const button = elementBelow.closest("button");
      if (!button || !button.dataset.row || !button.dataset.col) return;

      const row = parseInt(button.dataset.row, 10);
      const col = parseInt(button.dataset.col, 10);

      onCellMouseEnter({ row, col });
    },
    [onCellMouseEnter, isComplete, showSolution]
  );

  const handleCellTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onCellMouseUp();
    },
    [onCellMouseUp]
  );

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); // Prevent right-click menu
  }, []);

  // Add global mouse up listener
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      onCellMouseUp();
    };

    document.addEventListener("mouseup", handleGlobalMouseUp);
    document.addEventListener("touchend", handleGlobalMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, [onCellMouseUp]);

  return {
    handleCellMouseDown,
    handleCellMouseEnter,
    handleCellTouchStart,
    handleCellTouchMove,
    handleCellTouchEnd,
    handleContextMenu,
  };
}
