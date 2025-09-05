import { useCallback } from "react";

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
