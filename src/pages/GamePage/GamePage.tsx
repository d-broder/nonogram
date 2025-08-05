import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePuzzleLoader } from '../../hooks/usePuzzleLoader';
import { useGameState } from '../../hooks/useGameState';
import { useZoom } from '../../hooks/useZoom';
import { GameBoard } from '../../components/GameBoard';
import { Sidebar } from '../../components/Sidebar';
import { SuccessModal } from '../../components/SuccessModal';
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
  const { config: zoomConfig, zoomIn, zoomOut, canZoomIn, canZoomOut } = useZoom();
  
  const completionRef = useRef(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
      setShowSuccessModal(false);
    }
  }, [puzzle, initializeGame]);

  // Handle puzzle completion with success animation (from reference)
  useEffect(() => {
    if (gameState.isComplete && !completionRef.current) {
      completionRef.current = true;
      
      // Success animation from reference project - enhanced
      let flashes = 0;
      const maxFlashes = 8;
      const originalBg = document.body.style.backgroundColor || '';
      const green = '#b6f5c1';
      
      // Ensure smooth transition
      document.body.style.transition = 'background-color 0.8s ease-in-out';
      
      const flashInterval = setInterval(() => {
        document.body.style.backgroundColor = (flashes % 2 === 0) ? green : originalBg;
        flashes++;
        if (flashes > maxFlashes) {
          clearInterval(flashInterval);
          document.body.style.backgroundColor = originalBg;
          // Show modal immediately after animation completes
          setShowSuccessModal(true);
        }
      }, 400);
    }
  }, [gameState.isComplete]);

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
      
      <SuccessModal
        isVisible={showSuccessModal}
        puzzleType={type}
        puzzleId={puzzle.id}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
}
