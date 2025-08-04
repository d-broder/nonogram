import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePuzzleLoader } from '../../hooks/usePuzzleLoader';
import { useGameState } from '../../hooks/useGameState';
import { GameBoard } from '../../components/GameBoard';
import { GameControls } from '../../components/GameControls';
import { PaintModeButtons } from '../../components/PaintModeButtons';
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

  // Handle puzzle completion with success animation (from reference)
  useEffect(() => {
    if (gameState.isComplete && !completionRef.current) {
      completionRef.current = true;
      
      // Success animation from reference project
      let flashes = 0;
      const maxFlashes = 10;
      const originalBg = document.body.style.backgroundColor || '';
      const green = '#b6f5c1';
      
      // Ensure smooth transition
      document.body.style.transition = 'background-color 1s cubic-bezier(.4,1.3,.5,1)';
      
      const flashInterval = setInterval(() => {
        document.body.style.backgroundColor = (flashes % 2 === 0) ? green : originalBg;
        flashes++;
        if (flashes > maxFlashes) {
          clearInterval(flashInterval);
          document.body.style.backgroundColor = originalBg;
        }
      }, 500);

      // Reset background after animation
      setTimeout(() => {
        document.body.style.backgroundColor = originalBg;
      }, 5000);
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
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>🎯 Nonogram Clássico</h1>
        <div className={styles.puzzleInfo}>
          <span>
            {type === 'classic' ? 'Picross Clássico' : 'Mega Picross'} - 
            Puzzle {puzzle.id} ({puzzle.size.width}x{puzzle.size.height})
          </span>
        </div>
      </header>

      <main className={styles.main}>
        <GameControls
          onShowSolution={toggleSolution}
          onClearGrid={clearGameGrid}
          showSolution={gameState.showSolution}
          puzzleType={type}
          isComplete={gameState.isComplete}
        />

        <PaintModeButtons
          currentMode={gameState.paintMode}
          onModeChange={setPaintMode}
        />

        <div className={styles.gameAreaWrapper}>
          <GameBoard
            puzzle={puzzle}
            grid={gameState.grid}
            showSolution={gameState.showSolution}
            onCellMouseDown={handleCellMouseDown}
            onCellMouseEnter={handleCellMouseEnter}
            onCellMouseUp={handleCellMouseUp}
            isComplete={gameState.isComplete}
          />
        </div>

        <div className={styles.controlsInfo}>
          🖱️ Esquerdo: ⬛ | 🖱️ Direito: ❌
        </div>
      </main>
    </div>
  );
}
