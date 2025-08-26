import type { Puzzle, CellState } from "../../../../../shared/types";

/**
 * Calcula as classes CSS para uma célula do grid baseada em sua posição e estado
 */
export function getCellClass(
  row: number,
  col: number,
  puzzle: Puzzle,
  grid: CellState[][],
  showSolution: boolean,
  styles: Record<string, string>
): string {
  const classes = [styles.cell];

  // Add thick borders for multiples of 5
  if ((col + 1) % 5 === 0 && col + 1 < puzzle.size.width) {
    classes.push(styles.thickRight);
  }
  if (col % 5 === 0 && col > 0) {
    classes.push(styles.thickLeft);
  }
  if ((row + 1) % 5 === 0 && row + 1 < puzzle.size.height) {
    classes.push(styles.thickBottom);
  }
  if (row % 5 === 0 && row > 0) {
    classes.push(styles.thickTop);
  }

  if (showSolution) {
    // Show solution
    if (puzzle.solution[row][col] === 1) {
      classes.push(styles.solutionFilled);
    }
  } else {
    // Show current state
    const cellState = grid[row][col];
    classes.push(styles[cellState]);
  }

  return classes.join(" ");
}

/**
 * Calcula o ID único para uma célula
 */
export function getCellId(row: number, col: number): string {
  return `${row}-${col}`;
}

/**
 * Calcula o ID único para uma clue
 */
export function getClueId(
  type: "row" | "col",
  index: number,
  clueIndex: number | string
): string {
  return `${type}-${index}-${clueIndex}`;
}

/**
 * Verifica se uma posição de célula é válida dentro do puzzle
 */
export function isValidCellPosition(
  row: number,
  col: number,
  puzzle: Puzzle
): boolean {
  return (
    row >= 0 && row < puzzle.size.height && col >= 0 && col < puzzle.size.width
  );
}

/**
 * Calcula as dimensões do grid baseadas no puzzle
 */
export function getGridDimensions(puzzle: Puzzle) {
  return {
    width: puzzle.size.width,
    height: puzzle.size.height,
    totalCells: puzzle.size.width * puzzle.size.height,
  };
}
