import React from "react";
import type { Puzzle } from "../../../shared/types";

interface GameHeaderProps {
  puzzle: Puzzle | null;
  isComplete: boolean;
  zoomPercentage: number;
  onBackClick: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
  showZoomControls?: boolean;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  puzzle,
  isComplete,
  zoomPercentage,
  onBackClick,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  canZoomIn,
  canZoomOut,
  showZoomControls = true,
}) => {
  if (!puzzle) return null;

  return (
    <div className="game-header">
      {/* Back button */}
      <button
        onClick={onBackClick}
        className="back-button"
        aria-label="Voltar para seleção de puzzles"
      >
        ← Voltar
      </button>

      {/* Puzzle info */}
      <div className="puzzle-info">
        <h1>Puzzle {puzzle.id}</h1>
        <span className="type">{puzzle.type}</span>
        <span className="size">
          {puzzle.size.width}×{puzzle.size.height}
        </span>
        {isComplete && <span className="status-complete">✅ Completo!</span>}
      </div>

      {/* Zoom controls */}
      {showZoomControls && (
        <div className="zoom-controls">
          <button
            onClick={onZoomOut}
            disabled={!canZoomOut}
            aria-label="Diminuir zoom"
          >
            🔍−
          </button>
          <span className="zoom-level">{zoomPercentage}%</span>
          <button
            onClick={onZoomIn}
            disabled={!canZoomIn}
            aria-label="Aumentar zoom"
          >
            🔍+
          </button>
          <button onClick={onResetZoom} aria-label="Resetar zoom">
            ⌂
          </button>
        </div>
      )}
    </div>
  );
};
