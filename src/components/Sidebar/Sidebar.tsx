import { useNavigate } from 'react-router-dom';
import { GameControls } from '../GameControls';
import { PaintModeButtons } from '../PaintModeButtons';
import { ZoomControls } from '../ZoomControls';
import type { PaintMode, Puzzle } from '../../types';
import styles from './Sidebar.module.css';

interface SidebarProps {
  puzzle: Puzzle;
  currentType: 'classic' | 'super';
  paintMode: PaintMode;
  showSolution: boolean;
  isComplete: boolean;
  onShowSolution: () => void;
  onClearGrid: () => void;
  onModeChange: (mode: PaintMode) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
  zoomPercentage: number;
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
  zoomPercentage
}: SidebarProps) {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <aside className={styles.sidebar}>
      {/* Título do projeto, clicável para voltar ao menu principal */}
      <div className={styles.projectTitle}>
        <button onClick={handleBackToHome} className={styles.titleButton}>
          Nonogram
        </button>
      </div>

      {/* Informações do puzzle atual: tipo, número e tamanho */}
      <div className={styles.subtitle}>
        {currentType === 'classic' ? 'Classic' : 'Super'}<br />
        Puzzle {puzzle.id} ({puzzle.size.width}x{puzzle.size.height})
      </div>

      {/* Botões de controle do jogo */}
      <div className={styles.gameControls}>
        <GameControls
          onShowSolution={onShowSolution}
          onClearGrid={onClearGrid}
          showSolution={showSolution}
          puzzleType={currentType}
          isComplete={isComplete}
        />
      </div>

      {/* Painel de modos de pintura */}
      <div className={styles.paintModePanel}>
        <h3 className={styles.sectionTitle}>Paint Mode</h3>
        <PaintModeButtons
          currentMode={paintMode}
          onModeChange={onModeChange}
          isComplete={isComplete}
        />
      </div>

      {/* Controles de zoom */}
      <div className={styles.zoomPanel}>
        <h3 className={styles.sectionTitle}>Zoom: {zoomPercentage}%</h3>
        <ZoomControls
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onResetZoom={onResetZoom}
          canZoomIn={canZoomIn}
          canZoomOut={canZoomOut}
        />
      </div>
    </aside>
  );
}
