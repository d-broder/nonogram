import { useMemo, useEffect } from "react";

interface ZoomConfig {
  cellSize: number;
  clueWidth: number;
  clueHeight: number;
  clueGap: number;
  superClueWidth: number;
  superClueHeight: number;
  clueFontSize: number;
  clueRadius: number;
}

interface UseGameBoardZoomProps {
  zoomConfig: ZoomConfig;
  stickyClues?: boolean;
}

interface UseGameBoardZoomReturn {
  boardStyle: React.CSSProperties;
  clueContainerStyle: React.CSSProperties;
  colCluesStyle: React.CSSProperties;
  rowCluesStyle: React.CSSProperties;
  gridStyle: React.CSSProperties;
}

/**
 * Hook para gerenciar os estilos de zoom e responsividade do GameBoard
 * Calcula CSS custom properties baseadas na configuração de zoom
 */
export function useGameBoardZoom({
  zoomConfig,
  stickyClues = true,
}: UseGameBoardZoomProps): UseGameBoardZoomReturn {
  // Calculate board styles based on zoom configuration
  const boardStyle = useMemo<React.CSSProperties>(
    () =>
      ({
        "--cell-size": `${zoomConfig.cellSize}px`,
        "--clue-size": `${zoomConfig.clueWidth}px`,
        "--clue-size-small": `${zoomConfig.clueHeight}px`,
        "--super-clue-size": `${zoomConfig.superClueWidth}px`,
        "--font-size-clue": `${zoomConfig.clueFontSize}px`,
        "--icon-size": `${Math.max(zoomConfig.cellSize * 0.6, 16)}px`,
        "--clue-radius": `${zoomConfig.clueRadius}px`,
      } as React.CSSProperties),
    [zoomConfig]
  );

  // Clue container styles
  const clueContainerStyle = useMemo<React.CSSProperties>(
    () => ({
      position: stickyClues ? "sticky" : "static",
      top: stickyClues ? "0" : "auto",
      left: stickyClues ? "0" : "auto",
      zIndex: stickyClues ? 10 : "auto",
      backgroundColor: stickyClues ? "white" : "transparent",
    }),
    [stickyClues]
  );

  // Column clues specific styles
  const colCluesStyle = useMemo<React.CSSProperties>(
    () => ({
      position: stickyClues ? "sticky" : "static",
      top: stickyClues ? "0" : "auto",
      zIndex: stickyClues ? 11 : "auto",
      backgroundColor: stickyClues ? "white" : "transparent",
    }),
    [stickyClues]
  );

  // Row clues specific styles
  const rowCluesStyle = useMemo<React.CSSProperties>(
    () => ({
      position: stickyClues ? "sticky" : "static",
      left: stickyClues ? "0" : "auto",
      zIndex: stickyClues ? 11 : "auto",
      backgroundColor: stickyClues ? "white" : "transparent",
    }),
    [stickyClues]
  );

  // Grid styles
  const gridStyle = useMemo<React.CSSProperties>(
    () => ({
      display: "grid",
      gridTemplateColumns: `repeat(var(--grid-cols, 1), var(--cell-size))`,
      gridTemplateRows: `repeat(var(--grid-rows, 1), var(--cell-size))`,
      gap: "1px",
    }),
    []
  );

  // Add CSS custom properties to document root for global access
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(boardStyle).forEach(([property, value]) => {
      if (typeof property === "string" && property.startsWith("--")) {
        root.style.setProperty(property, String(value));
      }
    });

    // Cleanup on unmount
    return () => {
      const properties = Object.keys(boardStyle).filter((key) =>
        key.startsWith("--")
      );
      properties.forEach((property) => {
        root.style.removeProperty(property);
      });
    };
  }, [boardStyle]);

  return {
    boardStyle,
    clueContainerStyle,
    colCluesStyle,
    rowCluesStyle,
    gridStyle,
  };
}
