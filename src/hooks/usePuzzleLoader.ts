import { useState, useEffect, useCallback } from 'react';
import type { Puzzle } from '../types';
import { loadPuzzle, getAvailablePuzzles } from '../utils/puzzleUtils';

export function usePuzzleLoader() {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [availablePuzzles, setAvailablePuzzles] = useState<{
    classic: number[];
    super: number[];
  }>({
    classic: [],
    super: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load available puzzles on mount
  useEffect(() => {
    const loadAvailablePuzzles = async () => {
      try {
        const [classicPuzzles, superPuzzles] = await Promise.all([
          getAvailablePuzzles('classic'),
          getAvailablePuzzles('super'),
        ]);

        setAvailablePuzzles({
          classic: classicPuzzles,
          super: superPuzzles,
        });
      } catch (err) {
        console.error('Failed to load available puzzles:', err);
        setError('Failed to load puzzle list');
      }
    };

    loadAvailablePuzzles();
  }, []);

  // Load a specific puzzle
  const loadSpecificPuzzle = useCallback(async (id: number, type: 'classic' | 'super') => {
    setLoading(true);
    setError(null);

    try {
      const loadedPuzzle = await loadPuzzle(id, type);
      setPuzzle(loadedPuzzle);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load puzzle';
      setError(errorMessage);
      setPuzzle(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear current puzzle
  const clearPuzzle = useCallback(() => {
    setPuzzle(null);
    setError(null);
  }, []);

  return {
    puzzle,
    availablePuzzles,
    loading,
    error,
    loadSpecificPuzzle,
    clearPuzzle,
  };
}
