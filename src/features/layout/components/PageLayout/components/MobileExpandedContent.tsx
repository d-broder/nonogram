import { GameControls } from "../../../../game";
import { MobileCreateRoomForm } from "./MobileCreateRoomForm";
import { MobileClearGridForm } from "./MobileClearGridForm";
import { RoomInfoSection } from "./RoomInfoSection";
import type { Puzzle, Player } from "../../../../../shared/types";
import styles from "./MobileExpandedContent.module.css";

interface MobileExpandedContentProps {
  // Form state
  showMobileCreateRoom: boolean;
  showMobileClearGrid: boolean;

  // Form handlers
  onRoomCreated: (roomId: string, playerId: string) => void;
  onMobileClearConfirm: () => void;
  onMobileClearCancel: () => void;

  // Game configuration (optional)
  puzzle?: Puzzle;
  currentType?: "classic" | "super";
  showGameControls?: boolean;
  showSolution?: boolean;
  isComplete?: boolean;

  // Game actions (optional)
  onShowSolution?: () => void;
  onClearGrid?: () => void;
  onBackToPuzzles?: () => void;

  // Multiplayer configuration
  isMultiplayer?: boolean;
  roomLink?: string;
  players?: Player[];
  showTooltip?: boolean;
  onCreateRoom: () => void;
  onCopyLink?: () => void;
  onHideTooltip?: () => void;
}

export const MobileExpandedContent: React.FC<MobileExpandedContentProps> = ({
  showMobileCreateRoom,
  showMobileClearGrid,
  onRoomCreated,
  onMobileClearConfirm,
  onMobileClearCancel,
  puzzle,
  currentType,
  showGameControls,
  showSolution,
  isComplete,
  onShowSolution,
  onClearGrid,
  onBackToPuzzles,
  isMultiplayer,
  roomLink,
  players,
  showTooltip,
  onCreateRoom,
  onCopyLink,
  onHideTooltip,
}) => {
  if (showMobileCreateRoom) {
    return <MobileCreateRoomForm onRoomCreated={onRoomCreated} />;
  }

  if (showMobileClearGrid) {
    return (
      <MobileClearGridForm
        onConfirm={onMobileClearConfirm}
        onCancel={onMobileClearCancel}
      />
    );
  }

  return (
    <div className={styles.content}>
      {/* Game subtitle (only for GamePage) */}
      {puzzle && currentType && (
        <div className={styles.subtitle}>
          {currentType === "classic" ? "Classic" : "Super"}
          <br />
          Puzzle {puzzle.id} ({puzzle.size.width}x{puzzle.size.height})
        </div>
      )}

      {/* Game controls (only for GamePage) */}
      {showGameControls && onShowSolution && onClearGrid && (
        <div className={styles.gameControls1}>
          <GameControls
            onShowSolution={onShowSolution}
            onClearGrid={onClearGrid}
            showSolution={showSolution ?? false}
            puzzleType={currentType ?? "classic"}
            isComplete={isComplete ?? false}
            onBackToPuzzles={onBackToPuzzles}
          />
        </div>
      )}

      {/* Room info (always visible) */}
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
