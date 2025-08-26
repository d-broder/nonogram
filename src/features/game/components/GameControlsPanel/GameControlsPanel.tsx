import { GameControlButton } from "../../../../shared";
import { ButtonGroup } from "../../../ui";
import type { PaintMode } from "../../../../shared/types";
import styles from "./GameControlsPanel.module.css";

export type ControlsPanelLayout = "sidebar" | "bottombar";

interface GameControlsPanelProps {
  layout?: ControlsPanelLayout;

  // Paint mode controls
  paintMode: PaintMode;
  onPaintModeChange: (mode: PaintMode) => void;

  // Zoom controls
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
  zoomPercentage: number;

  // Toggle controls
  stickyClues: boolean;
  onStickyToggle: () => void;
  showPlayerIndicators?: boolean;
  onPlayerIndicatorToggle?: () => void;
  isMultiplayer?: boolean;

  // State
  isComplete: boolean;
}

export function GameControlsPanel({
  layout = "sidebar",
  paintMode,
  onPaintModeChange,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  canZoomIn,
  canZoomOut,
  zoomPercentage,
  stickyClues,
  onStickyToggle,
  showPlayerIndicators = true,
  onPlayerIndicatorToggle,
  isMultiplayer = false,
  isComplete,
}: GameControlsPanelProps) {
  const panelClasses = [styles.controlsPanel, styles[layout]].join(" ");

  return (
    <div className={panelClasses}>
      {/* Paint Mode Group */}
      <ButtonGroup title="Paint Mode" direction="column">
        <GameControlButton
          variant="paint"
          icon="⬛"
          paintMode="black"
          isActive={paintMode === "black"}
          disabled={isComplete}
          onClick={() => onPaintModeChange("black")}
          title="Paint black cells"
        />
        <GameControlButton
          variant="paint"
          icon="❌"
          paintMode="x"
          isActive={paintMode === "x"}
          disabled={isComplete}
          onClick={() => onPaintModeChange("x")}
          title="Mark cells with X"
        />
        <GameControlButton
          variant="paint"
          icon="⭕"
          paintMode="o"
          isActive={paintMode === "o"}
          disabled={isComplete}
          onClick={() => onPaintModeChange("o")}
          title="Mark cells with O"
        />
      </ButtonGroup>

      {/* Zoom Group */}
      <ButtonGroup title={`Zoom: ${zoomPercentage}%`} direction="column">
        <GameControlButton
          size="small"
          variant="zoom"
          icon="+"
          disabled={!canZoomIn || isComplete}
          onClick={onZoomIn}
          title="Zoom in"
        />
        <GameControlButton
          size="small"
          variant="zoom"
          icon="−"
          disabled={!canZoomOut || isComplete}
          onClick={onZoomOut}
          title="Zoom out"
        />
        <GameControlButton
          size="small"
          variant="zoom"
          icon="🎯"
          disabled={isComplete}
          onClick={onResetZoom}
          title="Reset zoom"
        />
      </ButtonGroup>

      {/* Toggle Controls Group */}
      <ButtonGroup direction="column">
        <GameControlButton
          variant="toggle"
          icon={stickyClues ? "📌" : "📍"}
          label={stickyClues ? "Lock" : "Free"}
          isActive={stickyClues}
          disabled={isComplete}
          onClick={onStickyToggle}
          title={`${stickyClues ? "Disable" : "Enable"} sticky clues`}
        />
        {isMultiplayer && onPlayerIndicatorToggle && (
          <GameControlButton
            variant="toggle"
            icon={showPlayerIndicators ? "👥" : "👤"}
            label={showPlayerIndicators ? "Show" : "Hide"}
            isActive={showPlayerIndicators}
            disabled={isComplete}
            onClick={onPlayerIndicatorToggle}
            title={`${
              showPlayerIndicators ? "Hide" : "Show"
            } player indicators`}
          />
        )}
      </ButtonGroup>
    </div>
  );
}
