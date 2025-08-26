import { GameControlsPanel } from "../../../../../game";
import type { PaintMode } from "../../../../../../shared/types";
import styles from "./MobileBottomBar.module.css";

interface MobileBottomBarProps {
  paintMode: PaintMode;
  onPaintModeChange: (mode: PaintMode) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  canZoomIn?: boolean;
  canZoomOut?: boolean;
  zoomPercentage?: number;
  stickyClues?: boolean;
  onStickyToggle?: () => void;
  showPlayerIndicators?: boolean;
  onPlayerIndicatorToggle?: () => void;
  isMultiplayer?: boolean;
  isComplete?: boolean;
}

export function MobileBottomBar({
  paintMode,
  onPaintModeChange,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  canZoomIn = true,
  canZoomOut = true,
  zoomPercentage = 100,
  stickyClues = true,
  onStickyToggle = () => {},
  showPlayerIndicators = true,
  onPlayerIndicatorToggle,
  isMultiplayer = false,
  isComplete = false,
}: MobileBottomBarProps) {
  return (
    <div className={styles.mobileBottomBar}>
      <GameControlsPanel
        layout="bottombar"
        paintMode={paintMode}
        onPaintModeChange={onPaintModeChange}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onResetZoom={onResetZoom}
        canZoomIn={canZoomIn}
        canZoomOut={canZoomOut}
        zoomPercentage={zoomPercentage}
        stickyClues={stickyClues}
        onStickyToggle={onStickyToggle}
        showPlayerIndicators={showPlayerIndicators}
        onPlayerIndicatorToggle={onPlayerIndicatorToggle}
        isMultiplayer={isMultiplayer}
        isComplete={isComplete}
      />
    </div>
  );
}
