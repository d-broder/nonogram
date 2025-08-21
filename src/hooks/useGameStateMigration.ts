import { useCallback } from 'react';
import type { GameState, Puzzle } from '../types';
import { useFirebaseRoom } from './useFirebaseRoom';

interface MigrationData {
  gameState: GameState;
  puzzle: Puzzle;
  puzzleType: 'classic' | 'super'; // Add explicit puzzle type from URL
  puzzleId: number; // Add explicit puzzle ID from URL
  creatorId: string; // Add creator ID for cellAuthors
  clueStates: {
    clickedRowClues: Set<string>;
    clickedColClues: Set<string>;
  };
  uiSettings?: {
    paintMode?: string;
    stickyClues?: boolean;
    showPlayerIndicators?: boolean;
  };
}

export function useGameStateMigration() {
  const { migrateGameState } = useFirebaseRoom(null);

  const migrateToMultiplayer = useCallback(async (
    roomId: string, 
    migrationData: MigrationData
  ) => {
    try {
      // Convert Sets to Arrays for Firebase
      const clueStatesForFirebase = {
        rowClues: Array.from(migrationData.clueStates.clickedRowClues),
        colClues: Array.from(migrationData.clueStates.clickedColClues)
      };

      // Prepare grid data for Firebase
      const gridForFirebase: { [cellId: string]: string } = {};
      const cellAuthorsForFirebase: { [cellId: string]: string } = {};
      
      migrationData.gameState.grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell !== 'white') { // Only store non-empty cells
            const cellId = `${rowIndex}-${colIndex}`;
            gridForFirebase[cellId] = cell;
            cellAuthorsForFirebase[cellId] = migrationData.creatorId; // All existing cells belong to creator
          }
        });
      });

      // Upload state to Firebase including puzzle info and status
      await migrateGameState(roomId, {
        grid: gridForFirebase,
        cellAuthors: cellAuthorsForFirebase,
        clues: {
          ...clueStatesForFirebase.rowClues.reduce((acc, clueId) => ({ ...acc, [clueId]: true }), {}),
          ...clueStatesForFirebase.colClues.reduce((acc, clueId) => ({ ...acc, [clueId]: true }), {})
        },
        puzzle: migrationData.puzzle,
        gameSettings: {
          paintMode: migrationData.uiSettings?.paintMode || 'black',
          showSolution: migrationData.gameState.showSolution || false,
          isComplete: migrationData.gameState.isComplete || false
        },
        // Set room status to playing and define current puzzle
        status: 'playing',
        puzzleType: migrationData.puzzleType,
        puzzleId: migrationData.puzzleId
      });

      return { success: true };
    } catch (error) {
      console.error('Failed to migrate game state:', error);
      return { success: false, error };
    }
  }, [migrateGameState]);

  return {
    migrateToMultiplayer
  };
}
