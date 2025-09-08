import type { CellState } from "../types";

/**
 * Checks if the grid has been modified (has more than one non-white cell)
 */
export function hasGridModifications(grid: CellState[][]): boolean {
  let modifiedCellCount = 0;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] !== "white") {
        modifiedCellCount++;
        if (modifiedCellCount > 1) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Gets the number of modified cells in the grid
 */
export function getModifiedCellCount(grid: CellState[][]): number {
  let count = 0;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] !== "white") {
        count++;
      }
    }
  }

  return count;
}
