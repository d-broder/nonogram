import React from "react";
import type { PaintMode } from "../../../shared/types";

interface GameFooterProps {
  isMobile: boolean;
  paintMode: PaintMode;
  showSolution: boolean;
  onPaintModeChange: (mode: PaintMode) => void;
  onToggleSolution: () => void;
  onClearGrid: () => void;
  isComplete: boolean;
  canZoomIn: boolean;
  canZoomOut: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  zoomPercentage: number;
}

export const GameFooter: React.FC<GameFooterProps> = ({
  isMobile,
  paintMode,
  showSolution,
  onPaintModeChange,
  onToggleSolution,
  onClearGrid,
  isComplete,
  canZoomIn,
  canZoomOut,
  onZoomIn,
  onZoomOut,
  zoomPercentage,
}) => {
  if (!isMobile) return null;

  return (
    <div className="game-footer-mobile">
      {/* Paint mode controls */}
      <div className="paint-controls">
        <button
          className={`paint-btn ${paintMode === "black" ? "active" : ""}`}
          onClick={() => onPaintModeChange("black")}
          aria-label="Modo pintar preto"
        >
          ⬛
        </button>
        <button
          className={`paint-btn ${paintMode === "x" ? "active" : ""}`}
          onClick={() => onPaintModeChange("x")}
          aria-label="Modo marcar X"
        >
          ❌
        </button>
        <button
          className={`paint-btn ${paintMode === "o" ? "active" : ""}`}
          onClick={() => onPaintModeChange("o")}
          aria-label="Modo marcar O"
        >
          ⭕
        </button>
      </div>

      {/* Zoom controls for mobile */}
      <div className="mobile-zoom-controls">
        <button
          onClick={onZoomOut}
          disabled={!canZoomOut}
          aria-label="Diminuir zoom"
        >
          🔍−
        </button>
        <span className="zoom-display">{zoomPercentage}%</span>
        <button
          onClick={onZoomIn}
          disabled={!canZoomIn}
          aria-label="Aumentar zoom"
        >
          🔍+
        </button>
      </div>

      {/* Action controls */}
      <div className="action-controls">
        <button
          onClick={onToggleSolution}
          className={showSolution ? "active" : ""}
          disabled={isComplete}
          aria-label={showSolution ? "Ocultar solução" : "Mostrar solução"}
        >
          💡
        </button>
        <button
          onClick={onClearGrid}
          disabled={isComplete}
          aria-label="Limpar tabuleiro"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};
