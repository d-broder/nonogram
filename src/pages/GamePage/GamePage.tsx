import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePuzzleLoader } from '../../hooks/usePuzzleLoader';
import { useGameState } from '../../hooks/useGameState';
import { useZoom } from '../../hooks/useZoom';
import { GameBoard } from '../../components/GameBoard';
import { Sidebar } from '../../components/Sidebar';
import styles from './GamePage.module.css';

export function GamePage() {
  const { type, id } = useParams<{ type: 'classic' | 'super'; id: string }>();
  const navigate = useNavigate();
  const { puzzle, loading, error, loadSpecificPuzzle } = usePuzzleLoader();
  const { 
    gameState, 
    initializeGame, 
    handleCellMouseDown,
    handleCellMouseEnter,
    handleCellMouseUp,
    setPaintMode,
    clearGameGrid, 
    toggleSolution 
  } = useGameState(puzzle);
  const { config: zoomConfig, zoomIn, zoomOut, canZoomIn, canZoomOut, zoomPercentage } = useZoom();
  
  const completionRef = useRef(false);

  // Load puzzle when params change
  useEffect(() => {
    if (!type || !id || (type !== 'classic' && type !== 'super')) {
      navigate('/');
      return;
    }

    const puzzleId = parseInt(id, 10);
    if (isNaN(puzzleId)) {
      navigate('/');
      return;
    }

    loadSpecificPuzzle(puzzleId, type);
  }, [type, id, navigate, loadSpecificPuzzle]);

  // Initialize game when puzzle loads
  useEffect(() => {
    if (puzzle) {
      initializeGame(puzzle);
      completionRef.current = false;
    }
  }, [puzzle, initializeGame]);

  // Handle puzzle completion with success animation (gameBoardArea instead of body)
  useEffect(() => {
    let animationActive = false;
    let gameBoardArea: HTMLElement | null = null;
    let currentColor = false;
    let timeoutId: number | undefined;

    if (gameState.isComplete && !completionRef.current) {
      completionRef.current = true;
      animationActive = true;
      gameBoardArea = document.querySelector(`.${styles.gameBoardArea}`) as HTMLElement;
      if (gameBoardArea) {
        const colorA = '#b6f5c1';
        const colorB = gameBoardArea.style.backgroundColor || '';
        gameBoardArea.style.transition = 'background-color 2s ease-in-out';

        const animate = () => {
          if (!animationActive) return;
          currentColor = !currentColor;
          gameBoardArea!.style.backgroundColor = currentColor ? colorA : colorB;
          timeoutId = window.setTimeout(animate, 2000);
        };
        animate();
      }
    }

    // Cleanup: para a animação quando o componente desmontar ou o puzzle mudar
    return () => {
      animationActive = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (gameBoardArea) {
        gameBoardArea.style.backgroundColor = '';
        gameBoardArea.style.transition = '';
      }
    };
  }, [gameState.isComplete, styles.gameBoardArea]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading puzzle...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error Loading Puzzle</h2>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/')}
            className={styles.errorButton}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (!puzzle || !type) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Puzzle Not Found</h2>
          <p>The requested puzzle could not be found.</p>
          <button 
            onClick={() => navigate('/')}
            className={styles.errorButton}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.gamePageContainer}>
      <Sidebar
        puzzle={puzzle}
        currentType={type}
        paintMode={gameState.paintMode}
        showSolution={gameState.showSolution}
        isComplete={gameState.isComplete}
        onShowSolution={toggleSolution}
        onClearGrid={clearGameGrid}
        onModeChange={setPaintMode}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        canZoomIn={canZoomIn}
        canZoomOut={canZoomOut}
        zoomPercentage={zoomPercentage}
      />
      
      <main className={styles.gameBoardArea}>
        <GameBoard
          puzzle={puzzle}
          grid={gameState.grid}
          showSolution={gameState.showSolution}
          onCellMouseDown={handleCellMouseDown}
          onCellMouseEnter={handleCellMouseEnter}
          onCellMouseUp={handleCellMouseUp}
          isComplete={gameState.isComplete}
          zoomConfig={zoomConfig}
        />
      </main>
    </div>
  );
}
