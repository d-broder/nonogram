import type { CellState, Puzzle, ClueValidation, PaintMode, ClueElement } from '../types';

/**
 * Create an empty grid with the specified dimensions
 */
export function createEmptyGrid(width: number, height: number): CellState[][] {
  return Array.from({ length: height }, () => 
    Array.from({ length: width }, () => 'white' as CellState)
  );
}

/**
 * Check if the current grid matches the puzzle solution
 */
export function checkSolution(grid: CellState[][], solution: number[][]): boolean {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      // Only check filled cells (black) against solution
      if (solution[row][col] === 1 && grid[row][col] !== 'black') {
        return false;
      }
      // Empty cells in solution should not be filled
      if (solution[row][col] === 0 && grid[row][col] === 'black') {
        return false;
      }
    }
  }
  return true;
}

/**
 * Get the current state of a row as filled/empty sequence
 */
export function getRowSequence(grid: CellState[][], rowIndex: number): number[] {
  const row = grid[rowIndex];
  const sequence: number[] = [];
  let currentCount = 0;

  for (const cell of row) {
    if (cell === 'black') { // filled
      currentCount++;
    } else {
      if (currentCount > 0) {
        sequence.push(currentCount);
        currentCount = 0;
      }
    }
  }

  if (currentCount > 0) {
    sequence.push(currentCount);
  }

  return sequence.length === 0 ? [0] : sequence;
}

/**
 * Get the current state of a column as filled/empty sequence
 */
export function getColSequence(grid: CellState[][], colIndex: number): number[] {
  const sequence: number[] = [];
  let currentCount = 0;

  for (let row = 0; row < grid.length; row++) {
    if (grid[row][colIndex] === 'black') { // filled
      currentCount++;
    } else {
      if (currentCount > 0) {
        sequence.push(currentCount);
        currentCount = 0;
      }
    }
  }

  if (currentCount > 0) {
    sequence.push(currentCount);
  }

  return sequence.length === 0 ? [0] : sequence;
}

/**
 * Convert clues to simple number array (for classic puzzles only)
 */
function clueElementsToNumbers(clues: ClueElement[]): number[] {
  return clues.filter((clue): clue is number => typeof clue === 'number');
}

/**
 * Validate if current sequences match the clues (classic puzzles only)
 */
export function validateClues(grid: CellState[][], puzzle: Puzzle): {
  rows: ClueValidation[];
  cols: ClueValidation[];
} {
  const rowValidations: ClueValidation[] = [];
  const colValidations: ClueValidation[] = [];

  // Only validate classic puzzles for now
  if (puzzle.type === 'classic') {
    // Validate rows
    for (let i = 0; i < puzzle.size.height; i++) {
      const currentSequence = getRowSequence(grid, i);
      const expectedClues = clueElementsToNumbers(puzzle.rowClues[i]);
      const isValid = arraysEqual(currentSequence, expectedClues);
      rowValidations.push({
        isValid,
        completedClues: isValid ? expectedClues.map(() => true) : expectedClues.map(() => false)
      });
    }

    // Validate columns
    for (let i = 0; i < puzzle.size.width; i++) {
      const currentSequence = getColSequence(grid, i);
      const expectedClues = clueElementsToNumbers(puzzle.colClues[i]);
      const isValid = arraysEqual(currentSequence, expectedClues);
      colValidations.push({
        isValid,
        completedClues: isValid ? expectedClues.map(() => true) : expectedClues.map(() => false)
      });
    }
  } else {
    // For super puzzles, create placeholder validations
    for (let i = 0; i < puzzle.size.height; i++) {
      rowValidations.push({
        isValid: false,
        completedClues: puzzle.rowClues[i].map(() => false)
      });
    }
    for (let i = 0; i < puzzle.size.width; i++) {
      colValidations.push({
        isValid: false,
        completedClues: puzzle.colClues[i].map(() => false)
      });
    }
  }

  return { rows: rowValidations, cols: colValidations };
}

/**
 * Helper function to compare two arrays for equality
 */
function arraysEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
}

/**
 * Clear the entire grid
 */
export function clearGrid(width: number, height: number): CellState[][] {
  return createEmptyGrid(width, height);
}

/**
 * Get next cell state based on paint mode and current state (from reference logic)
 */
export function getNextState(mode: PaintMode, startState: CellState, currentState: CellState): CellState {
  // Define transitions for each mode based on reference project
  const transitions: Record<PaintMode, Record<CellState, Partial<Record<CellState, CellState>>>> = {
    black: {
      white: { white: 'black', o: 'black' },
      black: { black: 'white' },
      x: { white: 'black', x: 'black', o: 'black' },
      o: { white: 'black', o: 'black' }
    },
    x: {
      white: { white: 'x', o: 'x' },
      black: { white: 'x', black: 'x' },
      x: { x: 'white' },
      o: { o: 'x' }
    },
    o: {
      white: { white: 'o' },
      black: { white: 'o', black: 'o' },
      x: { x: 'o' },
      o: { o: 'white' }
    }
  };

  // Return the new state or current if no transition
  const modeTransitions = transitions[mode];
  const startTransitions = modeTransitions?.[startState];
  return startTransitions?.[currentState] || currentState;
}
