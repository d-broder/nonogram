import type { Puzzle, CellState } from "../../../../../shared/types";

/**
 * Valida se o estado atual do board está correto em relação à solução
 */
export function validateBoardState(
  grid: CellState[][],
  puzzle: Puzzle
): {
  isValid: boolean;
  errors: Array<{ row: number; col: number; message: string }>;
} {
  const errors: Array<{ row: number; col: number; message: string }> = [];

  for (let row = 0; row < puzzle.size.height; row++) {
    for (let col = 0; col < puzzle.size.width; col++) {
      const currentState = grid[row][col];
      const correctState = puzzle.solution[row][col];

      // Check for incorrect filled cells
      if (currentState === "black" && correctState === 0) {
        errors.push({
          row,
          col,
          message: "Cell should be empty but is filled",
        });
      }

      // Check for incorrect empty marks
      if (currentState === "x" && correctState === 1) {
        errors.push({
          row,
          col,
          message: "Cell should be filled but is marked empty",
        });
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Verifica se o puzzle está completo (todas as células corretas preenchidas)
 */
export function isPuzzleComplete(grid: CellState[][], puzzle: Puzzle): boolean {
  for (let row = 0; row < puzzle.size.height; row++) {
    for (let col = 0; col < puzzle.size.width; col++) {
      const currentState = grid[row][col];
      const correctState = puzzle.solution[row][col];

      // Check if required cell is not filled
      if (correctState === 1 && currentState !== "black") {
        return false;
      }

      // Check if cell is incorrectly filled
      if (correctState === 0 && currentState === "black") {
        return false;
      }
    }
  }

  return true;
}

/**
 * Calcula o progresso do puzzle (porcentagem de células corretas)
 */
export function calculatePuzzleProgress(
  grid: CellState[][],
  puzzle: Puzzle
): {
  percentage: number;
  correctCells: number;
  totalRequiredCells: number;
} {
  let correctCells = 0;
  let totalRequiredCells = 0;

  for (let row = 0; row < puzzle.size.height; row++) {
    for (let col = 0; col < puzzle.size.width; col++) {
      const currentState = grid[row][col];
      const correctState = puzzle.solution[row][col];

      if (correctState === 1) {
        totalRequiredCells++;
        if (currentState === "black") {
          correctCells++;
        }
      }
    }
  }

  const percentage =
    totalRequiredCells > 0 ? (correctCells / totalRequiredCells) * 100 : 100;

  return {
    percentage: Math.round(percentage * 100) / 100, // Round to 2 decimal places
    correctCells,
    totalRequiredCells,
  };
}

/**
 * Verifica se uma linha está completa e correta
 */
export function isRowComplete(
  grid: CellState[][],
  puzzle: Puzzle,
  rowIndex: number
): boolean {
  if (rowIndex < 0 || rowIndex >= puzzle.size.height) {
    return false;
  }

  for (let col = 0; col < puzzle.size.width; col++) {
    const currentState = grid[rowIndex][col];
    const correctState = puzzle.solution[rowIndex][col];

    if (correctState === 1 && currentState !== "black") {
      return false;
    }
    if (correctState === 0 && currentState === "black") {
      return false;
    }
  }

  return true;
}

/**
 * Verifica se uma coluna está completa e correta
 */
export function isColumnComplete(
  grid: CellState[][],
  puzzle: Puzzle,
  colIndex: number
): boolean {
  if (colIndex < 0 || colIndex >= puzzle.size.width) {
    return false;
  }

  for (let row = 0; row < puzzle.size.height; row++) {
    const currentState = grid[row][colIndex];
    const correctState = puzzle.solution[row][colIndex];

    if (correctState === 1 && currentState !== "black") {
      return false;
    }
    if (correctState === 0 && currentState === "black") {
      return false;
    }
  }

  return true;
}
