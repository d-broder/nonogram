import { useState, useCallback, useRef } from 'react';
import type { GameState, CellPosition, Puzzle, PaintMode, DragState, CellState } from '../types';
import { createEmptyGrid, checkSolution, clearGrid, getNextState } from '../utils/gridUtils';

interface UseGameStateOptions {
  onCellChange?: (cellId: string, state: CellState, playerId?: string) => Promise<void>;
  playerId?: string; // Add playerId to track who made the change
}

export function useGameState(puzzle: Puzzle | null, options?: UseGameStateOptions) {
  const { onCellChange, playerId } = options || {};
  const [gameState, setGameState] = useState<GameState>(() => ({
    grid: puzzle ? createEmptyGrid(puzzle.size.width, puzzle.size.height) : [],
    isComplete: false,
    showSolution: false,
    paintMode: 'black',
  }));

  const dragState = useRef<DragState>({
    isDragging: false,
    startCell: null,
    direction: null,
    button: null,
    startState: null,
    modifiedCells: new Set(),
  });

  // Update grid when puzzle changes
  const initializeGame = useCallback((newPuzzle: Puzzle) => {
    setGameState({
      grid: createEmptyGrid(newPuzzle.size.width, newPuzzle.size.height),
      isComplete: false,
      showSolution: false,
      paintMode: 'black',
    });
    dragState.current = {
      isDragging: false,
      startCell: null,
      direction: null,
      button: null,
      startState: null,
      modifiedCells: new Set(),
    };
  }, []);

  // Handle mouse down on cell (start drag)
  const handleCellMouseDown = useCallback((position: CellPosition, button: number) => {
    if (!puzzle || gameState.isComplete || gameState.showSolution) return;

    const currentCell = gameState.grid[position.row][position.col];
    
    dragState.current = {
      isDragging: true,
      startCell: position,
      direction: null,
      button,
      startState: currentCell,
      modifiedCells: new Set(),
    };

    // Apply change to initial cell immediately
    applyCellChange(position);
  }, [puzzle, gameState.isComplete, gameState.showSolution, gameState.grid]);

  // Handle mouse enter on cell (continue drag)
  const handleCellMouseEnter = useCallback((position: CellPosition) => {
    if (!dragState.current.isDragging || !dragState.current.startCell) return;

    const { startCell } = dragState.current;
    const currentRow = position.row;
    const currentCol = position.col;
    const startRow = startCell.row;
    const startCol = startCell.col;

    // Define direction if not set yet
    if (!dragState.current.direction && (currentRow !== startRow || currentCol !== startCol)) {
      if (currentRow === startRow) {
        dragState.current.direction = 'horizontal';
      } else if (currentCol === startCol) {
        dragState.current.direction = 'vertical';
      } else {
        // If not in same row or column, define based on larger difference
        const rowDiff = Math.abs(currentRow - startRow);
        const colDiff = Math.abs(currentCol - startCol);
        dragState.current.direction = rowDiff > colDiff ? 'vertical' : 'horizontal';
      }
    }

    // Calculate all cells between start and current position
    const cellsToModify: CellPosition[] = [];
    
    if (dragState.current.direction === 'horizontal') {
      // Paint all cells in the horizontal line from start to current
      const row = startRow;
      const minCol = Math.min(startCol, currentCol);
      const maxCol = Math.max(startCol, currentCol);
      
      for (let col = minCol; col <= maxCol; col++) {
        if (col >= 0 && col < puzzle!.size.width) {
          cellsToModify.push({ row, col });
        }
      }
    } else if (dragState.current.direction === 'vertical') {
      // Paint all cells in the vertical line from start to current
      const col = startCol;
      const minRow = Math.min(startRow, currentRow);
      const maxRow = Math.max(startRow, currentRow);
      
      for (let row = minRow; row <= maxRow; row++) {
        if (row >= 0 && row < puzzle!.size.height) {
          cellsToModify.push({ row, col });
        }
      }
    } else {
      // No direction set yet, just modify the current cell
      cellsToModify.push(position);
    }

    // Apply changes to all cells in the line
    cellsToModify.forEach(cell => {
      if (cell.row >= 0 && cell.row < puzzle!.size.height &&
          cell.col >= 0 && cell.col < puzzle!.size.width) {
        applyCellChange(cell);
      }
    });
  }, [puzzle]);

  // Handle mouse up (end drag)
  const handleCellMouseUp = useCallback(() => {
    dragState.current = {
      isDragging: false,
      startCell: null,
      direction: null,
      button: null,
      startState: null,
      modifiedCells: new Set(),
    };
  }, []);

  // Apply cell change based on drag logic
  const applyCellChange = useCallback(async (position: CellPosition) => {
    if (!puzzle || !dragState.current.startState || !dragState.current.startCell) return;

    const cellId = `${position.row}-${position.col}`;
    // Check if this cell has already been modified in this drag
    if (dragState.current.modifiedCells.has(cellId)) return;

    setGameState(prev => {
      const currentCell = prev.grid[position.row][position.col];
      let newState = currentCell;

      // Determine new state based on rules
      if (dragState.current.button === 0) { // Left button
        newState = getNextState(prev.paintMode, dragState.current.startState!, currentCell);
      } else if (dragState.current.button === 1) { // Middle button
        newState = getNextState('o', dragState.current.startState!, currentCell);
      } else if (dragState.current.button === 2) { // Right button
        newState = getNextState('x', dragState.current.startState!, currentCell);
      }

      // Apply new state if there was a change
      if (newState !== currentCell) {
        const newGrid = prev.grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            if (rowIndex === position.row && colIndex === position.col) {
              return newState;
            }
            return cell;
          })
        );

        dragState.current.modifiedCells.add(cellId);

        // Sync to Firebase if callback is provided
        if (onCellChange) {
          onCellChange(cellId, newState, playerId).catch(error => {
            console.error('Error syncing cell to Firebase:', error);
          });
        }

        // Check if puzzle is complete
        const isComplete = checkSolution(newGrid, puzzle.solution);

        return {
          ...prev,
          grid: newGrid,
          isComplete,
        };
      }

      return prev;
    });
  }, [puzzle, onCellChange, playerId]);

  // Set paint mode
  const setPaintMode = useCallback((mode: PaintMode) => {
    setGameState(prev => ({
      ...prev,
      paintMode: mode,
    }));
  }, []);

  // Clear the grid
  const clearGameGrid = useCallback(() => {
    if (!puzzle) return;

    setGameState(prev => ({
      ...prev,
      grid: clearGrid(puzzle.size.width, puzzle.size.height),
      isComplete: false,
      showSolution: false,
    }));
  }, [puzzle]);

  // Show/hide solution
  const toggleSolution = useCallback(() => {
    if (!puzzle) return;

    setGameState(prev => ({
      ...prev,
      showSolution: !prev.showSolution,
    }));
  }, [puzzle]);

  // Update cell externally (for Firebase sync)
  const updateCellExternally = useCallback((cellId: string, newState: CellState) => {
    const [row, col] = cellId.split('-').map(Number);
    
    setGameState(prev => {
      // Check if cell is already in this state
      if (prev.grid[row] && prev.grid[row][col] === newState) {
        return prev;
      }

      const newGrid = prev.grid.map((gridRow, rowIndex) =>
        gridRow.map((cell, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            return newState;
          }
          return cell;
        })
      );

      // Check if puzzle is complete
      const isComplete = puzzle ? checkSolution(newGrid, puzzle.solution) : false;

      return {
        ...prev,
        grid: newGrid,
        isComplete,
      };
    });
  }, [puzzle]);

  return {
    gameState,
    initializeGame,
    handleCellMouseDown,
    handleCellMouseEnter,
    handleCellMouseUp,
    setPaintMode,
    clearGameGrid,
    toggleSolution,
    updateCellExternally,
  };
}
