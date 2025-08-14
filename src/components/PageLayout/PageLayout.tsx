import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { CopyTooltip } from '../CopyTooltip';
import { GameControls } from '../GameControls';
import { PaintModeButtons } from '../PaintModeButtons';
import { ZoomControls } from '../ZoomControls';
import { StickyToggleButton } from '../StickyToggleButton';
import type { PaintMode, Puzzle, Player } from '../../types';
import styles from './PageLayout.module.css';

const COLOR_VALUES = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
  purple: '#a855f7',
  orange: '#f97316',
  pink: '#ec4899',
  teal: '#14b8a6'
};

interface PageLayoutProps {
  children: ReactNode;
  
  // Page configuration
  showBackButton?: boolean;
  pageContentAreaHeight?: 'full' | '80%'; // For GamePage mobile (80%), others use full
  showMobileBottomBar?: boolean; // Only for GamePage mobile
  isGamePage?: boolean; // To use nonogramContainerArea instead of pageContentArea
  
  // Multiplayer configuration
  isMultiplayer?: boolean;
  roomId?: string;
  roomLink?: string;
  players?: Player[];
  showTooltip?: boolean;
  onCopyLink?: () => void;
  onHideTooltip?: () => void;
  
  // Game configuration (for GamePage)
  puzzle?: Puzzle;
  currentType?: 'classic' | 'super';
  paintMode?: PaintMode;
  showSolution?: boolean;
  isComplete?: boolean;
  onShowSolution?: () => void;
  onClearGrid?: () => void;
  onModeChange?: (mode: PaintMode) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
  canZoomIn?: boolean;
  canZoomOut?: boolean;
  zoomPercentage?: number;
  
  // Sticky toggle button (for GamePage)
  stickyClues?: boolean;
  onStickyToggle?: () => void;
}

export function PageLayout({
  children,
  showBackButton = false,
  pageContentAreaHeight = 'full',
  showMobileBottomBar = false,
  isGamePage = false,
  isMultiplayer = false,
  roomId,
  roomLink,
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
  onModeChange,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  canZoomIn,
  canZoomOut,
  zoomPercentage,
  stickyClues,
  onStickyToggle
}: PageLayoutProps) {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true); // Default collapsed on mobile
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Mobile collapsed view
  if (isMobile && isCollapsed) {
    return (
      <div className={styles.pageContainer}>
        {/* Mobile Top Bar */}
        <div className={styles.mobileTopBar}>
          {showBackButton && (
            <button
              onClick={handleBackClick}
              className={styles.backButton}
              aria-label="Go back"
            >
              ⯇
            </button>
          )}
          <div className={styles.projectTitle}>Nonogram</div>
          {isGamePage && (
            <button
              onClick={toggleSidebar}
              className={styles.hamburgerButton}
              aria-label="Open menu"
            >
              ☰
            </button>
          )}
        </div>

        {/* Page Content Area */}
        <div 
          className={isGamePage ? styles.nonogramContainerArea : styles.pageContentArea}
          style={{ height: pageContentAreaHeight === '80%' ? '80vh' : 'calc(100vh - 10vh)' }}
        >
          {isGamePage ? children : <div className={styles.pageContent}>{children}</div>}
        </div>

        {/* Mobile Bottom Bar (only for GamePage) */}
        {showMobileBottomBar && paintMode && onModeChange && onZoomIn && onZoomOut && onResetZoom && (
          <div className={styles.mobileBottomBar}>
            <div className={styles.gameControls2}>
              <PaintModeButtons
                currentMode={paintMode}
                onModeChange={onModeChange}
                isComplete={isComplete ?? false}
              />
              <ZoomControls
                onZoomIn={onZoomIn}
                onZoomOut={onZoomOut}
                onResetZoom={onResetZoom}
                canZoomIn={canZoomIn ?? true}
                canZoomOut={canZoomOut ?? true}
              />
              {onStickyToggle && (
                <div className={styles.toggleButton}>
                  <StickyToggleButton
                    stickyEnabled={stickyClues ?? true}
                    onToggle={onStickyToggle}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Mobile expanded view
  if (isMobile && !isCollapsed) {
    return (
      <div className={styles.pageContainer}>
        {/* Mobile Top Bar */}
        <div className={styles.mobileTopBar}>
          <div className={styles.projectTitle}>Nonogram</div>
          <button
            onClick={toggleSidebar}
            className={styles.closeButton}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        {/* Top Bar Expanded */}
        <div className={styles.topBarExpanded}>
          {/* Game subtitle (only for GamePage) */}
          {puzzle && currentType && (
            <div className={styles.subtitle}>
              {currentType === 'classic' ? 'Classic' : 'Super'}<br />
              Puzzle {puzzle.id} ({puzzle.size.width}x{puzzle.size.height})
            </div>
          )}

          {/* Game controls (only for GamePage) */}
          {onShowSolution && onClearGrid && (
            <div className={styles.gameControls1}>
              <GameControls
                onShowSolution={onShowSolution}
                onClearGrid={onClearGrid}
                showSolution={showSolution ?? false}
                puzzleType={currentType ?? 'classic'}
                isComplete={isComplete ?? false}
              />
            </div>
          )}

          {/* Room info (for multiplayer) */}
          {isMultiplayer && roomId && (
            <div className={styles.roomInfo}>
              <div className={styles.roomTitle}>Room: {roomId}</div>
              {roomLink && (
                <>
                  <div className={styles.roomLink}>{roomLink}</div>
                  <div className={styles.copyButtonWrapper}>
                    <button
                      type="button"
                      onClick={onCopyLink}
                      className={styles.copyButton}
                    >
                      Copy Link
                    </button>
                    {onHideTooltip && (
                      <CopyTooltip 
                        text="Link copied!" 
                        show={showTooltip} 
                        onHide={onHideTooltip} 
                      />
                    )}
                  </div>
                </>
              )}

              {/* Players list */}
              {players.length > 0 && (
                <div className={styles.playersContainer}>
                  <h3 className={styles.playersTitle}>Players ({players.length})</h3>
                  <div className={styles.playersList}>
                    {players.map((player) => (
                      <div key={player.id} className={styles.playerCard}>
                        <div
                          className={styles.playerColor}
                          style={{ backgroundColor: COLOR_VALUES[player.color] }}
                        />
                        <div className={styles.playerInfo}>
                          <span className={styles.playerName}>{player.name}</span>
                          {player.isCreator && <span className={styles.creatorBadge}>Host</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
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
      <div className={styles.sidebar}>
        {/* Project Title */}
        <div className={styles.projectTitle}>
          <button onClick={handleHomeClick} className={styles.titleButton}>
            Nonogram
          </button>
        </div>

        {/* Game content (only if puzzle exists) */}
        {puzzle && currentType && (
          <div className={styles.gameContent}>
            {/* Subtitle */}
            <div className={styles.subtitle}>
              {currentType === 'classic' ? 'Classic' : 'Super'}<br />
              Puzzle {puzzle.id} ({puzzle.size.width}x{puzzle.size.height})
            </div>

            {/* Game controls */}
            {onShowSolution && onClearGrid && (
              <div className={styles.gameControls1}>
                <GameControls
                  onShowSolution={onShowSolution}
                  onClearGrid={onClearGrid}
                  showSolution={showSolution ?? false}
                  puzzleType={currentType}
                  isComplete={isComplete ?? false}
                />
              </div>
            )}

            {/* Paint mode and zoom controls */}
            {paintMode && onModeChange && onZoomIn && onZoomOut && onResetZoom && (
              <div className={styles.gameControls2}>
                <div className={styles.paintModePanel}>
                  <h3 className={styles.sectionTitle}>Paint Mode</h3>
                  <PaintModeButtons
                    currentMode={paintMode}
                    onModeChange={onModeChange}
                    isComplete={isComplete ?? false}
                  />
                </div>
                <div className={styles.zoomPanel}>
                  <h3 className={styles.sectionTitle}>Zoom: {zoomPercentage ?? 100}%</h3>
                  <ZoomControls
                    onZoomIn={onZoomIn}
                    onZoomOut={onZoomOut}
                    onResetZoom={onResetZoom}
                    canZoomIn={canZoomIn ?? true}
                    canZoomOut={canZoomOut ?? true}
                  />
                </div>
                {onStickyToggle && (
                  <div className={styles.toggleButton}>
                    <h3 className={styles.sectionTitle}>Clues</h3>
                    <StickyToggleButton
                      stickyEnabled={stickyClues ?? true}
                      onToggle={onStickyToggle}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Multiplayer content */}
        {isMultiplayer && roomId && (
          <div className={styles.roomInfo}>
            <div className={styles.roomTitle}>Room: {roomId}</div>
            {roomLink && (
              <>
                <div className={styles.roomLink}>{roomLink}</div>
                <div className={styles.copyButtonWrapper}>
                  <button
                    type="button"
                    onClick={onCopyLink}
                    className={styles.copyButton}
                  >
                    Copy Link
                  </button>
                  {onHideTooltip && (
                    <CopyTooltip 
                      text="Link copied!" 
                      show={showTooltip} 
                      onHide={onHideTooltip} 
                    />
                  )}
                </div>
              </>
            )}

            {/* Players list */}
            {players.length > 0 && (
              <div className={styles.playersContainer}>
                <h3 className={styles.playersTitle}>Players ({players.length})</h3>
                <div className={styles.playersList}>
                  {players.map((player) => (
                    <div key={player.id} className={styles.playerCard}>
                      <div
                        className={styles.playerColor}
                        style={{ backgroundColor: COLOR_VALUES[player.color] }}
                      />
                      <div className={styles.playerInfo}>
                        <span className={styles.playerName}>{player.name}</span>
                        {player.isCreator && <span className={styles.creatorBadge}>Host</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Page Content Area */}
      <div className={isGamePage ? styles.nonogramContainerArea : styles.pageContentArea}>
        {showBackButton && (
          isGamePage ? (
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
          )
        )}
        {!showBackButton && (
          isGamePage ? children : <div className={styles.pageContent}>{children}</div>
        )}
      </div>
    </div>
  );
}
