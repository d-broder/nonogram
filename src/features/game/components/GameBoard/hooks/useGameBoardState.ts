import { useCallback, useState } from "react";

interface UseGameBoardStateProps {
  // External clue states for multiplayer mode
  externalClickedRowClues?: Set<string>;
  externalClickedColClues?: Set<string>;
  // Optional clue click handlers for multiplayer sync
  onRowClueClick?: (rowIndex: number, clueIndex: number | string) => void;
  onColClueClick?: (colIndex: number, clueIndex: number | string) => void;
}

interface UseGameBoardStateReturn {
  clickedRowClues: Set<string>;
  clickedColClues: Set<string>;
  handleRowClueClick: (
    e: React.MouseEvent,
    rowIndex: number,
    clueIndex: number | string
  ) => void;
  handleColClueClick: (
    e: React.MouseEvent,
    colIndex: number,
    clueIndex: number | string
  ) => void;
}

/**
 * Hook para gerenciar o estado das clues clicadas no GameBoard
 * Suporta tanto modo singleplayer (estado interno) quanto multiplayer (estado externo)
 */
export function useGameBoardState({
  externalClickedRowClues,
  externalClickedColClues,
  onRowClueClick,
  onColClueClick,
}: UseGameBoardStateProps): UseGameBoardStateReturn {
  // State to track which clues are clicked/highlighted
  // Use external state if provided (for multiplayer), otherwise use internal state
  const [internalClickedRowClues, setInternalClickedRowClues] = useState<
    Set<string>
  >(new Set());
  const [internalClickedColClues, setInternalClickedColClues] = useState<
    Set<string>
  >(new Set());

  const clickedRowClues = externalClickedRowClues || internalClickedRowClues;
  const clickedColClues = externalClickedColClues || internalClickedColClues;

  // Handle row clue clicking
  const handleRowClueClick = useCallback(
    (e: React.MouseEvent, rowIndex: number, clueIndex: number | string) => {
      e.preventDefault();
      e.stopPropagation();

      if (onRowClueClick) {
        // Use external handler (for multiplayer)
        onRowClueClick(rowIndex, clueIndex);
      } else {
        // Use internal state (for single player)
        const clueId = `row-${rowIndex}-${clueIndex}`;
        setInternalClickedRowClues((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(clueId)) {
            newSet.delete(clueId);
          } else {
            newSet.add(clueId);
          }
          return newSet;
        });
      }
    },
    [onRowClueClick]
  );

  // Handle column clue clicking
  const handleColClueClick = useCallback(
    (e: React.MouseEvent, colIndex: number, clueIndex: number | string) => {
      e.preventDefault();
      e.stopPropagation();

      if (onColClueClick) {
        // Use external handler (for multiplayer)
        onColClueClick(colIndex, clueIndex);
      } else {
        // Use internal state (for single player)
        const clueId = `col-${colIndex}-${clueIndex}`;
        setInternalClickedColClues((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(clueId)) {
            newSet.delete(clueId);
          } else {
            newSet.add(clueId);
          }
          return newSet;
        });
      }
    },
    [onColClueClick]
  );

  return {
    clickedRowClues,
    clickedColClues,
    handleRowClueClick,
    handleColClueClick,
  };
}
