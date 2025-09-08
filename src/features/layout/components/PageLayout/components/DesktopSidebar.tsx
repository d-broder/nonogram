import { GameControls } from "../../../../game";
import { GameControlsPanel } from "../../../../game";
import { RoomInfoSection } from "./RoomInfoSection";
import { ProjectTitle } from "./ProjectTitle";
import type { PaintMode, Puzzle, Player } from "../../../../../shared/types";
import styles from "./DesktopSidebar.module.css";

interface DesktopSidebarProps {
  // Home navigation
  onHomeClick: () => void;

  // Game configuration (optional)
  puzzle?: Puzzle;
  currentType?: "classic" | "super";
  showGameControls?: boolean;
  paintMode?: PaintMode;
  showSolution?: boolean;
  isComplete?: boolean;

  // Game actions (optional)
  onShowSolution?: () => void;
  onClearGrid?: () => void;
  onBackToPuzzles?: () => void;
  onModeChange?: (mode: PaintMode) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
  canZoomIn?: boolean;
  canZoomOut?: boolean;
  zoomPercentage?: number;
  stickyClues?: boolean;
  onStickyToggle?: () => void;
  showPlayerIndicators?: boolean;
  onPlayerIndicatorToggle?: () => void;

  // Multiplayer configuration
  isMultiplayer?: boolean;
  roomLink?: string;
  players?: Player[];
  showTooltip?: boolean;
  onCreateRoom: () => void;
  onCopyLink?: () => void;
  onHideTooltip?: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  onHomeClick,
  puzzle,
  currentType,
  showGameControls,
  paintMode,
  showSolution,
  isComplete,
  onShowSolution,
  onClearGrid,
  onBackToPuzzles,
  onModeChange,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  canZoomIn,
  canZoomOut,
  zoomPercentage,
  stickyClues,
  onStickyToggle,
  showPlayerIndicators,
  onPlayerIndicatorToggle,
  isMultiplayer,
  roomLink,
  players,
  showTooltip,
  onCreateRoom,
  onCopyLink,
  onHideTooltip,
}) => {
  return (
    <div className={styles.sidebar}>
      {/* Project Title */}
      <div className={styles.projectTitle}>
        <ProjectTitle onClick={onHomeClick} className={styles.titleButton} />
      </div>

      {/* Game content (only if puzzle exists) */}
      {puzzle && currentType && (
        <div className={styles.gameContent}>
          {/* Subtitle */}
          <div className={styles.subtitle}>
            {currentType === "classic" ? "Classic" : "Super"}
            <br />
            Puzzle {puzzle.id} ({puzzle.size.width}x{puzzle.size.height})
          </div>

          {/* Game controls */}
          {showGameControls && onShowSolution && onClearGrid && (
            <div className={styles.gameControls1}>
              <GameControls
                onShowSolution={onShowSolution}
                onClearGrid={onClearGrid}
                showSolution={showSolution ?? false}
                puzzleType={currentType}
                isComplete={isComplete ?? false}
                onBackToPuzzles={onBackToPuzzles}
              />
            </div>
          )}

          {/* Paint mode and zoom controls */}
          {paintMode &&
            onModeChange &&
            onZoomIn &&
            onZoomOut &&
            onResetZoom && (
              <div className={styles.gameControls2}>
                <GameControlsPanel
                  layout="sidebar"
                  paintMode={paintMode}
                  onPaintModeChange={onModeChange}
                  onZoomIn={onZoomIn}
                  onZoomOut={onZoomOut}
                  onResetZoom={onResetZoom}
                  canZoomIn={canZoomIn ?? true}
                  canZoomOut={canZoomOut ?? true}
                  zoomPercentage={zoomPercentage ?? 100}
                  stickyClues={stickyClues ?? true}
                  onStickyToggle={onStickyToggle || (() => {})}
                  showPlayerIndicators={showPlayerIndicators ?? true}
                  onPlayerIndicatorToggle={onPlayerIndicatorToggle}
                  isMultiplayer={isMultiplayer}
                  isComplete={isComplete ?? false}
                />
              </div>
            )}
        </div>
      )}

      {/* Room info content (always visible) */}
      <RoomInfoSection
        isMultiplayer={isMultiplayer}
        roomLink={roomLink}
        players={players}
        showTooltip={showTooltip}
        onCreateRoom={onCreateRoom}
        onCopyLink={onCopyLink}
        onHideTooltip={onHideTooltip}
      />
    </div>
  );
};
