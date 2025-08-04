export interface PuzzleSize {
  width: number;
  height: number;
}

// Type for mega clues - can be number, 'mega' string, or nested arrays
export type ClueElement = number | string | number[][] | (number | number[])[];

export interface Puzzle {
  id: number;
  type: 'classic' | 'super';
  size: PuzzleSize;
  rowClues: ClueElement[][];
  colClues: ClueElement[][];
  solution: number[][];
}

export type CellState = 'white' | 'black' | 'x' | 'o'; // States from reference project

export type PaintMode = 'black' | 'x' | 'o'; // Paint modes from reference

export interface GameState {
  grid: CellState[][];
  isComplete: boolean;
  showSolution: boolean;
  paintMode: PaintMode;
}

export interface CellPosition {
  row: number;
  col: number;
}

export interface ClueValidation {
  isValid: boolean;
  completedClues: boolean[];
}

export interface DragState {
  isDragging: boolean;
  startCell: CellPosition | null;
  direction: 'horizontal' | 'vertical' | null;
  button: number | null;
  startState: CellState | null;
  modifiedCells: Set<string>;
}
