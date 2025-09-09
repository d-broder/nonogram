import type { Puzzle } from "../types";

/**
 * Load a puzzle from the public folder
 */
export async function loadPuzzle(
  id: number,
  type: "classic" | "super"
): Promise<Puzzle> {
  try {
    const response = await fetch(`/puzzles/${type}/${id}.json`);

    if (!response.ok) {
      throw new Error(`Failed to load puzzle ${id} of type ${type}`);
    }

    const puzzle: Puzzle = await response.json();

    // Validate puzzle structure
    if (!validatePuzzleStructure(puzzle)) {
      throw new Error(`Invalid puzzle structure for puzzle ${id}`);
    }

    return puzzle;
  } catch (error) {
    console.error("Error loading puzzle:", error);
    throw error;
  }
}

/**
 * Get list of available puzzles for a given type
 */
export async function getAvailablePuzzles(
  type: "classic" | "super"
): Promise<number[]> {
  // For now, we'll return a static list
  // In a real implementation, this could fetch from an index file
  if (type === "classic") {
    return [1, 2, 3]; // Sample puzzle IDs
  } else {
    return [1, 2, 3, 4]; // Sample super puzzle IDs
  }
}

/**
 * Type guard for checking if an object has the required puzzle properties
 */
function isPuzzleLike(puzzle: unknown): puzzle is {
  id: number;
  type: string;
  size: { width: number; height: number };
  rowClues: unknown[];
  colClues: unknown[];
  solution: unknown[];
} {
  return (
    puzzle !== null &&
    typeof puzzle === "object" &&
    "id" in puzzle &&
    "type" in puzzle &&
    "size" in puzzle &&
    "rowClues" in puzzle &&
    "colClues" in puzzle &&
    "solution" in puzzle
  );
}

/**
 * Validate that a puzzle has the correct structure
 */
function validatePuzzleStructure(puzzle: unknown): puzzle is Puzzle {
  if (!isPuzzleLike(puzzle)) {
    return false;
  }

  return (
    typeof puzzle.id === "number" &&
    (puzzle.type === "classic" || puzzle.type === "super") &&
    puzzle.size &&
    typeof puzzle.size === "object" &&
    puzzle.size !== null &&
    typeof puzzle.size.width === "number" &&
    typeof puzzle.size.height === "number" &&
    Array.isArray(puzzle.rowClues) &&
    Array.isArray(puzzle.colClues) &&
    Array.isArray(puzzle.solution) &&
    puzzle.rowClues.length === puzzle.size.height &&
    puzzle.colClues.length === puzzle.size.width &&
    puzzle.solution.length === puzzle.size.height &&
    puzzle.solution.every(
      (row: unknown) => Array.isArray(row) && row.length === puzzle.size.width
    )
  );
}
