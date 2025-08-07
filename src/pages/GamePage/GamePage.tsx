import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { usePuzzleLoader } from '../../hooks/usePuzzleLoader';
import { useGameState } from '../../hooks/useGameState';
import { useZoom } from '../../hooks/useZoom';
import { useFirebaseRoom } from '../../hooks/useFirebaseRoom';
import { GameBoard } from '../../components/GameBoard';
import { Sidebar } from '../../components/Sidebar';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import type { CellState } from '../../types';
import styles from './GamePage.module.css';

export function GamePage() {
  const { type, id, roomId } = useParams<{ type: 'classic' | 'super'; id: string; roomId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { puzzle, loading, error, loadSpecificPuzzle } = usePuzzleLoader();
  
  // Check if this is multiplayer mode
  const isMultiplayer = location.pathname.includes('/multiplayer/');
  
  const { room, updateGridCell, updateClueState } = useFirebaseRoom(roomId || null);
  
  const { 
    gameState, 
    initializeGame, 
    handleCellMouseDown,
    handleCellMouseEnter,
    handleCellMouseUp,
    setPaintMode,
    clearGameGrid, 
    toggleSolution,
    updateCellExternally
  } = useGameState(puzzle, {
    onCellChange: isMultiplayer && roomId ? updateGridCell : undefined
  });
  
  const { config: zoomConfig, zoomIn, zoomOut, resetZoom, canZoomIn, canZoomOut, zoomPercentage } = useZoom();
  
  const completionRef = useRef(false);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);

  // State for clue clicks (moved from GameBoard to sync with Firebase)
  const [clickedRowClues, setClickedRowClues] = useState<Set<string>>(new Set());
  const [clickedColClues, setClickedColClues] = useState<Set<string>>(new Set());

  // Clue click handlers for multiplayer sync
  const handleRowClueClick = async (rowIndex: number, clueIndex: number | string) => {
    const clueId = `row-${rowIndex}-${clueIndex}`;
    const isCurrentlyClicked = clickedRowClues.has(clueId);
    const newState = !isCurrentlyClicked; // Toggle state
    
    // Update local state immediately for responsive UI
    const newSet = new Set(clickedRowClues);
    if (newState) {
      newSet.add(clueId);
    } else {
      newSet.delete(clueId);
    }
    setClickedRowClues(newSet);
    
    // If multiplayer, sync to Firebase
    if (isMultiplayer && roomId) {
      try {
        await updateClueState(clueId, newState);
      } catch (error) {
        console.error('Error syncing clue to Firebase:', error);
        // Revert local state on error
        setClickedRowClues(clickedRowClues);
      }
    }
  };

  const handleColClueClick = async (colIndex: number, clueIndex: number | string) => {
    const clueId = `col-${colIndex}-${clueIndex}`;
    const isCurrentlyClicked = clickedColClues.has(clueId);
    const newState = !isCurrentlyClicked; // Toggle state
    
    // Update local state immediately for responsive UI
    const newSet = new Set(clickedColClues);
    if (newState) {
      newSet.add(clueId);
    } else {
      newSet.delete(clueId);
    }
    setClickedColClues(newSet);
    
    // If multiplayer, sync to Firebase
    if (isMultiplayer && roomId) {
      try {
        await updateClueState(clueId, newState);
      } catch (error) {
        console.error('Error syncing clue to Firebase:', error);
        // Revert local state on error
        setClickedColClues(clickedColClues);
      }
    }
  };

  // Clear grid with confirmation
  const handleClearGridClick = () => {
    setShowClearConfirmation(true);
  };

  const handleConfirmClear = () => {
    clearGameGrid();
    setShowClearConfirmation(false);
  };

  const handleCancelClear = () => {
    setShowClearConfirmation(false);
  };

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

  // Listen for Firebase updates in multiplayer mode
  useEffect(() => {
    if (!isMultiplayer || !room) return;

    // Update grid based on Firebase room state
    if (room.grid) {
      Object.entries(room.grid).forEach(([cellId, cellState]) => {
        updateCellExternally(cellId, cellState as CellState);
      });
    }

    // Update clue states based on Firebase room state
    if (room.clues) {
      const newClickedRowClues = new Set<string>();
      const newClickedColClues = new Set<string>();

      Object.entries(room.clues).forEach(([clueId, isClicked]) => {
        if (isClicked) {
          if (clueId.startsWith('row-')) {
            newClickedRowClues.add(clueId);
          } else if (clueId.startsWith('col-')) {
            newClickedColClues.add(clueId);
          }
        }
      });

      setClickedRowClues(newClickedRowClues);
      setClickedColClues(newClickedColClues);
    }
  }, [room, isMultiplayer, updateCellExternally]);

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
        onClearGrid={handleClearGridClick}
        onModeChange={setPaintMode}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={resetZoom}
        canZoomIn={canZoomIn}
        canZoomOut={canZoomOut}
        zoomPercentage={zoomPercentage}
      />
      
      <main className={styles.gameBoardArea}>
        {/* Success message overlay */}
        {gameState.isComplete && (
          <div className={styles.successOverlay}>
          <h1 className={styles.successMessage}>
            {(type === 'classic' ? 'CLASSIC' : 'SUPER').toUpperCase()} PUZZLE {puzzle.id} SOLVED
          </h1>
          </div>
        )}
        
        <GameBoard
          puzzle={puzzle}
          grid={gameState.grid}
          showSolution={gameState.showSolution}
          onCellMouseDown={handleCellMouseDown}
          onCellMouseEnter={handleCellMouseEnter}
          onCellMouseUp={handleCellMouseUp}
          isComplete={gameState.isComplete}
          zoomConfig={zoomConfig}
          onRowClueClick={isMultiplayer ? handleRowClueClick : undefined}
          onColClueClick={isMultiplayer ? handleColClueClick : undefined}
          clickedRowClues={isMultiplayer ? clickedRowClues : undefined}
          clickedColClues={isMultiplayer ? clickedColClues : undefined}
        />
      </main>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showClearConfirmation}
        title="Clear Grid"
        message="Are you sure you want to clear the entire grid? This action cannot be undone."
        onConfirm={handleConfirmClear}
        onCancel={handleCancelClear}
        confirmText="Yes"
        cancelText="No"
      />
    </div>
  );
}
