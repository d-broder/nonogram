import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { GameControls } from '../GameControls';
import { PaintModeButtons } from '../PaintModeButtons';
import { ZoomControls } from '../ZoomControls';
import { CopyTooltip } from '../CopyTooltip';
import type { PaintMode, Puzzle, Player } from '../../types';
import styles from './Sidebar.module.css';

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

interface SidebarProps {
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
  // Multiplayer props
  isMultiplayer?: boolean;
  roomId?: string;
  roomLink?: string;
  players?: Player[];
  showTooltip?: boolean;
  onCopyLink?: () => void;
  onHideTooltip?: () => void;
}

export function Sidebar({
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
  // Multiplayer props
  isMultiplayer = false,
  roomId,
  roomLink,
  players = [],
  showTooltip = false,
  onCopyLink,
  onHideTooltip
}: SidebarProps) {
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

  const handleBackToHome = () => {
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (isMobile && isCollapsed) {
    return (
      <div className={styles.mobileTopBar}>
        <div className={styles.mobileTopIconAndTitle}>
          <div className={styles.mobileTitle}>Nonogram</div>
          <button
            onClick={toggleSidebar}
            className={styles.hamburgerButton}
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {isMobile && (
        <div className={styles.overlay} onClick={toggleSidebar} />
      )}
      
      <aside className={`${styles.sidebar} ${isMobile ? styles.mobileSidebar : ''}`}>
        {isMobile && (
          <button 
            onClick={toggleSidebar}
            className={styles.closeButton}
            aria-label="Close menu"
          >
            ×
          </button>
        )}
        
        {/* Título do projeto, sempre presente */}
        <div className={styles.projectTitle}>
          <button onClick={handleBackToHome} className={styles.titleButton}>
            Nonogram
          </button>
        </div>

      {/* Conteúdo do jogo (apenas se puzzle existir) */}
      {puzzle && currentType && (
        <div className={styles.gameContent}>
          {/* Informações do puzzle atual */}
          <div className={styles.subtitle}>
            {currentType === 'classic' ? 'Classic' : 'Super'}<br />
            Puzzle {puzzle.id} ({puzzle.size.width}x{puzzle.size.height})
          </div>

          {/* Botões de controle do jogo */}
          {onShowSolution && onClearGrid && (
            <div className={styles.gameControls}>
              <GameControls
                onShowSolution={onShowSolution}
                onClearGrid={onClearGrid}
                showSolution={showSolution ?? false}
                puzzleType={currentType}
                isComplete={isComplete ?? false}
              />
            </div>
          )}

          {/* Painel de modos de pintura */}
          {paintMode && onModeChange && (
            <div className={styles.paintModePanel}>
              <h3 className={styles.sectionTitle}>Paint Mode</h3>
              <PaintModeButtons
                currentMode={paintMode}
                onModeChange={onModeChange}
                isComplete={isComplete ?? false}
              />
            </div>
          )}

          {/* Controles de zoom */}
          {onZoomIn && onZoomOut && onResetZoom && (
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
          )}
        </div>
      )}

      {/* Conteúdo multiplayer */}
      {isMultiplayer && roomId && (
        <div className={styles.multiplayerContent}>
          {/* Room info */}
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
          </div>

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
    </aside>
    </>
  );
}
