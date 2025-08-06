export interface PuzzleSize {
  width: number;
  height: number;
}

// Type for super clues - can be number, 'super' string, or nested arrays
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

// Multiplayer types
export type PlayerColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'pink' | 'teal';

export interface Player {
  id: string;
  name: string;
  color: PlayerColor;
  isCreator: boolean;
}

export interface Room {
  id: string;
  creator: Player;
  players: Player[];
  gameState: GameState | null;
  puzzle: Puzzle | null;
  clickedRowClues: Set<string>;
  clickedColClues: Set<string>;
}

export interface MultiplayerGameState extends GameState {
  clickedRowClues: Set<string>;
  clickedColClues: Set<string>;
}

export type GameMode = 'singleplayer' | 'multiplayer';
