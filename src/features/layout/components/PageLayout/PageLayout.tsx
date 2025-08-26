import type { ReactNode } from "react";
import { CreateRoomModal } from "../../../room";
import {
  MobileTopBar,
  MobileTopBarExpanded,
  MobileBottomBar,
  DesktopSidebar,
  MobileExpandedContent,
} from "./components";
import type { PaintMode, Puzzle, Player } from "../../../../shared/types";
import {
  usePageLayoutNavigation,
  usePageLayoutState,
  usePageLayoutHandlers,
} from "./hooks";
import styles from "./PageLayout.module.css";

interface PageLayoutProps {
  children: ReactNode;

  // Page configuration
  showBackButton?: boolean;
  pageContentAreaHeight?: "full" | "80%"; // For GamePage mobile (80%), others use full
  showMobileBottomBar?: boolean; // Only for GamePage mobile
  isGamePage?: boolean; // To use nonogramContainerArea instead of pageContentArea

  // Multiplayer configuration
  isMultiplayer?: boolean;
  roomId?: string;
  players?: Player[];
  showTooltip?: boolean;
  onCopyLink?: () => void;
  onHideTooltip?: () => void;

  // Game configuration (for GamePage)
  puzzle?: Puzzle;
  currentType?: "classic" | "super";
  paintMode?: PaintMode;
  showSolution?: boolean;
  isComplete?: boolean;
  onShowSolution?: () => void;
  onClearGrid?: () => void;
  onBackToPuzzles?: () => void;
  onHomeClick?: () => void;
  onModeChange?: (mode: PaintMode) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
  canZoomIn?: boolean;
  canZoomOut?: boolean;
  zoomPercentage?: number;
  showGameControls?: boolean; // Whether to show game controls (Back to Puzzles, Show Solution, Clear Grid)

  // Toggle buttons (for GamePage)
  stickyClues?: boolean;
  onStickyToggle?: () => void;
  showPlayerIndicators?: boolean;
  onPlayerIndicatorToggle?: () => void;

  // Create room modal callbacks
  onRoomCreated?: (roomId: string, playerId: string) => void;

  // Clear grid modal callbacks
  showClearConfirmation?: boolean;
  onConfirmClear?: () => void;
  onCancelClear?: () => void;
}

export function PageLayout({
  children,
  showBackButton = false,
  showMobileBottomBar = false,
  isGamePage = false,
  isMultiplayer = false,
  roomId,
  players = [],
  showTooltip = false,
  onCopyLink,
  onHideTooltip,
  puzzle,
  currentType,
  paintMode,
  showSolution,
  isComplete,
  onShowSolution,
  onClearGrid,
  onBackToPuzzles,
  onHomeClick,
  onModeChange,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  canZoomIn,
  canZoomOut,
  zoomPercentage,
  showGameControls = true,
  stickyClues,
  onStickyToggle,
  showPlayerIndicators,
  onPlayerIndicatorToggle,
  onRoomCreated,
  onConfirmClear,
  onCancelClear,
}: PageLayoutProps) {
  // Custom hooks to manage state and handlers
  const {
    isCollapsed,
    showCreateRoomModal,
    isMobile,
    showMobileCreateRoom,
    showMobileClearGrid,
    setIsCollapsed,
    setShowCreateRoomModal,
    setShowMobileCreateRoom,
    setShowMobileClearGrid,
    toggleSidebar,
  } = usePageLayoutState();

  const { handleHomeClick, handleBackClick } = usePageLayoutNavigation(roomId);

  const handleHomeClickWrapper = () => handleHomeClick(onHomeClick);

  const {
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleRoomCreated,
    handleClearGrid,
    handleMobileClearConfirm,
    handleMobileClearCancel,
  } = usePageLayoutHandlers(
    isMobile,
    setShowCreateRoomModal,
    setShowMobileCreateRoom,
    setShowMobileClearGrid,
    setIsCollapsed,
    onRoomCreated,
    onClearGrid,
    onConfirmClear,
    onCancelClear
  );

  // Generate room link if roomId is provided
  const roomLink = roomId ? `${window.location.origin}/${roomId}` : undefined;

  // Mobile collapsed view
  if (isMobile && isCollapsed) {
    return (
      <div className={styles.pageContainer}>
        {/* Mobile Top Bar */}
        <MobileTopBar
          showBackButton={showBackButton}
          onBackClick={handleBackClick}
          isGamePage={isGamePage}
          isMultiplayer={isMultiplayer}
          onToggleSidebar={toggleSidebar}
        />

        {/* Page Content Area */}
        <div
          className={
            isGamePage ? styles.nonogramContainerArea : styles.pageContentArea
          }
        >
          {isGamePage ? (
            children
          ) : (
            <div className={styles.pageContent}>{children}</div>
          )}
        </div>

        {/* Mobile Bottom Bar (only for GamePage) */}
        {showMobileBottomBar &&
          paintMode &&
          onModeChange &&
          onZoomIn &&
          onZoomOut &&
          onResetZoom && (
            <MobileBottomBar
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
          )}
      </div>
    );
  }

  // Mobile expanded view
  if (isMobile && !isCollapsed) {
    return (
      <div className={styles.pageContainer}>
        {/* Mobile Top Bar */}
        <MobileTopBarExpanded
          showMobileCreateRoom={showMobileCreateRoom}
          showMobileClearGrid={showMobileClearGrid}
          onBackClick={() => {
            setShowMobileCreateRoom(false);
            setShowMobileClearGrid(false);
          }}
          onToggleSidebar={toggleSidebar}
        />

        {/* Top Bar Expanded */}
        <div className={styles.topBarExpanded}>
          <MobileExpandedContent
            showMobileCreateRoom={showMobileCreateRoom}
            showMobileClearGrid={showMobileClearGrid}
            onRoomCreated={handleRoomCreated}
            onMobileClearConfirm={handleMobileClearConfirm}
            onMobileClearCancel={handleMobileClearCancel}
            puzzle={puzzle}
            currentType={currentType}
            showGameControls={showGameControls}
            showSolution={showSolution}
            isComplete={isComplete}
            onShowSolution={onShowSolution}
            onClearGrid={handleClearGrid}
            onBackToPuzzles={onBackToPuzzles}
            isMultiplayer={isMultiplayer}
            roomLink={roomLink}
            players={players}
            showTooltip={showTooltip}
            onCreateRoom={handleOpenCreateModal}
            onCopyLink={onCopyLink}
            onHideTooltip={onHideTooltip}
          />
        </div>

        {/* Overlay to close expanded menu */}
        {/* <div className={styles.overlay} onClick={toggleSidebar} /> */}
      </div>
    );
  }

  // Desktop view
  return (
    <div className={styles.pageContainer}>
      {/* Sidebar */}
      <DesktopSidebar
        onHomeClick={handleHomeClickWrapper}
        puzzle={puzzle}
        currentType={currentType}
        showGameControls={showGameControls}
        paintMode={paintMode}
        showSolution={showSolution}
        isComplete={isComplete}
        onShowSolution={onShowSolution}
        onClearGrid={handleClearGrid}
        onBackToPuzzles={onBackToPuzzles}
        onModeChange={onModeChange}
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
        roomLink={roomLink}
        players={players}
        showTooltip={showTooltip}
        onCreateRoom={handleOpenCreateModal}
        onCopyLink={onCopyLink}
        onHideTooltip={onHideTooltip}
      />

      {/* Page Content Area */}
      <div
        className={
          isGamePage ? styles.nonogramContainerArea : styles.pageContentArea
        }
      >
        {showBackButton &&
          (isGamePage ? (
            <>
              <button
                onClick={handleBackClick}
                className={styles.backButton}
                aria-label="Go back"
              >
                ⯇
              </button>
              {children}
            </>
          ) : (
            <div className={styles.pageContent}>
              <button
                onClick={handleBackClick}
                className={styles.backButton}
                aria-label="Go back"
              >
                ⯇
              </button>
              {children}
            </div>
          ))}
        {!showBackButton &&
          (isGamePage ? (
            children
          ) : (
            <div className={styles.pageContent}>{children}</div>
          ))}
      </div>

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={showCreateRoomModal}
        onClose={handleCloseCreateModal}
        onRoomCreated={handleRoomCreated}
      />
    </div>
  );
}
