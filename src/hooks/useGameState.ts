import { useState, useCallback, useRef } from 'react';
import type { GameState, CellPosition, Puzzle, PaintMode, DragState } from '../types';
import { createEmptyGrid, checkSolution, clearGrid, getNextState } from '../utils/gridUtils';

export function useGameState(puzzle: Puzzle | null) {
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

    // Interpret cell based on defined direction
    let targetPosition = position;
    if (dragState.current.direction === 'horizontal') {
      // If in horizontal mode, interpret as same row as initial cell
      if (currentRow !== startRow) {
        targetPosition = { row: startRow, col: currentCol };
      }
    } else if (dragState.current.direction === 'vertical') {
      // If in vertical mode, interpret as same column as initial cell
      if (currentCol !== startCol) {
        targetPosition = { row: currentRow, col: startCol };
      }
    }

    // Apply changes to interpreted cell
    if (targetPosition.row >= 0 && targetPosition.row < puzzle!.size.height &&
        targetPosition.col >= 0 && targetPosition.col < puzzle!.size.width) {
      applyCellChange(targetPosition);
    }
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
  const applyCellChange = useCallback((position: CellPosition) => {
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
  }, [puzzle]);

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

  return {
    gameState,
    initializeGame,
    handleCellMouseDown,
    handleCellMouseEnter,
    handleCellMouseUp,
    setPaintMode,
    clearGameGrid,
    toggleSolution,
  };
}
