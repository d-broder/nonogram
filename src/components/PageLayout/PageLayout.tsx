import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { CopyTooltip } from '../CopyTooltip';
import { GameControls } from '../GameControls';
import { GameControlsPanel } from '../GameControlsPanel';
import { CreateRoomModal } from '../CreateRoomModal';
import { RoomInfoDefault } from '../RoomInfoDefault';
import type { PaintMode, Puzzle, Player, PlayerColor } from '../../types';
import { useFirebaseRoom } from '../../hooks/useFirebaseRoom';
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

const AVAILABLE_COLORS: PlayerColor[] = [
  'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'teal'
];

// Mobile Create Room Form Component
interface MobileCreateRoomFormProps {
  onRoomCreated: (roomId: string, playerId: string) => void;
}

function MobileCreateRoomForm({ onRoomCreated }: MobileCreateRoomFormProps) {
  const [playerName, setPlayerName] = useState('');
  const [selectedColor, setSelectedColor] = useState<PlayerColor>('red');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createRoom } = useFirebaseRoom(null);

  const handleCreateRoom = async () => {
    if (!playerName.trim()) {
      setError('Please enter a display name');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const roomId = Math.random().toString(36).substr(2, 8).toUpperCase();
      const playerId = Date.now().toString();
      
      const player = {
        id: playerId,
        name: playerName.trim(),
        color: selectedColor,
        isCreator: true
      };

      await createRoom(player, roomId);

      // Store player info
      sessionStorage.setItem('playerInfo', JSON.stringify(player));

      onRoomCreated(roomId, playerId);
    } catch (error) {
      console.error('Error creating room:', error);
      setError('Failed to create room. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className={styles.mobileCreateForm}>
      <h3 className={styles.formTitle}>Create New Room</h3>
      
      {error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="playerName" className={styles.label}>
          Display Name
        </label>
        <input
          id="playerName"
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter your name..."
          className={styles.input}
          maxLength={20}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Player Color</label>
        <div className={styles.colorGrid}>
          {AVAILABLE_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`${styles.colorButton} ${
                selectedColor === color ? styles.selected : ''
              }`}
              style={{ backgroundColor: COLOR_VALUES[color] }}
              onClick={() => setSelectedColor(color)}
              aria-label={`Select ${color} color`}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleCreateRoom}
        disabled={isCreating || !playerName.trim()}
        className={styles.createButton}
      >
        {isCreating ? 'Creating...' : 'Create Room'}
      </button>
    </div>
  );
}

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
  
  // Toggle buttons (for GamePage)
  stickyClues?: boolean;
  onStickyToggle?: () => void;
  showPlayerIndicators?: boolean;
  onPlayerIndicatorToggle?: () => void;

  // Create room modal callbacks
  onRoomCreated?: (roomId: string, playerId: string) => void;
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
  onStickyToggle,
  showPlayerIndicators,
  onPlayerIndicatorToggle,
  onRoomCreated
}: PageLayoutProps) {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileCreateRoom, setShowMobileCreateRoom] = useState(false);

  // Modal handlers
  const handleOpenCreateModal = () => {
    if (isMobile) {
      // No mobile, usar topBarExpanded em vez de modal
      setShowMobileCreateRoom(true);
      setIsCollapsed(false); // Expandir a sidebar
    } else {
      setShowCreateRoomModal(true);
    }
  };

  const handleCloseCreateModal = () => {
    setShowCreateRoomModal(false);
    setShowMobileCreateRoom(false);
  };

  const handleRoomCreated = (roomId: string, playerId: string) => {
    setShowCreateRoomModal(false);
    setShowMobileCreateRoom(false);
    if (onRoomCreated) {
      onRoomCreated(roomId, playerId);
    }
  };

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true); // Default collapsed on mobile
      }
    };

    // Set CSS custom property for real viewport height (fallback for older browsers)
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    checkMobile();
    setViewportHeight();
    
    window.addEventListener('resize', checkMobile);
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
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
          {(isGamePage || isMultiplayer || !isMultiplayer) && (
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
          style={{ 
            height: pageContentAreaHeight === '80%' ? '80dvh' : 'calc(100dvh - 10dvh)'
          }}
        >
          {isGamePage ? children : <div className={styles.pageContent}>{children}</div>}
        </div>

        {/* Mobile Bottom Bar (only for GamePage) */}
        {showMobileBottomBar && paintMode && onModeChange && onZoomIn && onZoomOut && onResetZoom && (
          <div className={styles.mobileBottomBar}>
            <GameControlsPanel
              layout="bottombar"
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
    );
  }

  // Mobile expanded view
  if (isMobile && !isCollapsed) {
    return (
      <div className={styles.pageContainer}>
        {/* Mobile Top Bar */}
        <div className={styles.mobileTopBar}>
          {showMobileCreateRoom && (
            <button
              onClick={() => setShowMobileCreateRoom(false)}
              className={styles.backButton}
              aria-label="Go back"
            >
              ⯇
            </button>
          )}
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
          {showMobileCreateRoom ? (
            /* Mobile Create Room Form - substitui todo o conteúdo */
            <MobileCreateRoomForm onRoomCreated={handleRoomCreated} />
          ) : (
            <>
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

              {/* Room info (always visible) */}
              <div className={styles.roomInfo}>
                {!isMultiplayer ? (
                  <RoomInfoDefault onCreateRoom={handleOpenCreateModal} />
                ) : roomId ? (
              <>
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
              </>
            ) : null}
          </div>
            </>
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
        <div className={styles.roomInfo}>
          {!isMultiplayer ? (
            <RoomInfoDefault onCreateRoom={handleOpenCreateModal} />
          ) : roomId ? (
            <>
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
            </>
          ) : null}
        </div>
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

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={showCreateRoomModal}
        onClose={handleCloseCreateModal}
        onRoomCreated={handleRoomCreated}
      />
    </div>
  );
}
