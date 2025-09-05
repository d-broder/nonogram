import { useState, useCallback } from "react";

interface ZoomConfig {
  cellSize: number;
  clueWidth: number;
  clueHeight: number;
  clueGap: number;
  superClueWidth: number;
  superClueHeight: number;
  clueFontSize: number;
  clueRadius: number;
  playerIndicatorSize: number;
}

const MIN_CELL_SIZE = 10;
const MAX_CELL_SIZE = 80;
const DEFAULT_CELL_SIZE = 40;

export function useZoom() {
  const [cellSize, setCellSize] = useState(DEFAULT_CELL_SIZE);

  const calculateZoomConfig = useCallback(
    (size: number): ZoomConfig => ({
      cellSize: size,
      clueWidth: size * 0.75,
      clueHeight: size * 0.625,
      clueGap: size * 0.1,
      superClueWidth: size * 1.75,
      superClueHeight: size * 1.75,
      clueFontSize: size * 0.55,
      clueRadius: size * 0.1,
      playerIndicatorSize: size * 0.25,
    }),
    []
  );

  const zoomIn = useCallback(() => {
    setCellSize((prev) => Math.min(prev + 5, MAX_CELL_SIZE));
  }, []);

  const zoomOut = useCallback(() => {
    setCellSize((prev) => Math.max(prev - 5, MIN_CELL_SIZE));
  }, []);

  const resetZoom = useCallback(() => {
    setCellSize(DEFAULT_CELL_SIZE);
  }, []);

  const canZoomIn = cellSize < MAX_CELL_SIZE;
  const canZoomOut = cellSize > MIN_CELL_SIZE;
  const config = calculateZoomConfig(cellSize);

  // Calculate zoom percentage based on default size
  const zoomPercentage = Math.round((cellSize / DEFAULT_CELL_SIZE) * 100);

  return {
    config,
    zoomIn,
    zoomOut,
    resetZoom,
    canZoomIn,
    canZoomOut,
    zoomPercentage,
  };
}
