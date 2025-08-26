import { useCallback } from "react";

interface UseGamePageSyncProps {
  isMultiplayer: boolean;
  roomId?: string | null;
  updateClueState?: (
    clueId: string,
    state: boolean,
    playerId?: string
  ) => Promise<void>;
  clickedRowClues: Set<string>;
  setClickedRowClues: (clues: Set<string>) => void;
  clickedColClues: Set<string>;
  setClickedColClues: (clues: Set<string>) => void;
}

interface GamePageSync {
  handleRowClueClick: (
    rowIndex: number,
    clueIndex: number | string
  ) => Promise<void>;
  handleColClueClick: (
    colIndex: number,
    clueIndex: number | string
  ) => Promise<void>;
}

export const useGamePageSync = ({
  isMultiplayer,
  roomId,
  updateClueState,
  clickedRowClues,
  setClickedRowClues,
  clickedColClues,
  setClickedColClues,
}: UseGamePageSyncProps): GamePageSync => {
  // Row clue click handler with Firebase sync
  const handleRowClueClick = useCallback(
    async (rowIndex: number, clueIndex: number | string) => {
      const clueId = `row-${rowIndex}-${clueIndex}`;
      const isCurrentlyClicked = clickedRowClues.has(clueId);
      const newState = !isCurrentlyClicked; // Toggle state

      // Update local state immediately for responsive UI
      const newSet = new Set(clickedRowClues);
      if (newState) {
        newSet.add(clueId);
      } else {
        newSet.delete(clueId);
      }
      setClickedRowClues(newSet);

      // Sync with Firebase if multiplayer
      if (isMultiplayer && roomId && updateClueState) {
        try {
          await updateClueState(clueId, newState);
        } catch (error) {
          console.error("Failed to sync row clue state:", error);
          // Revert local state on error
          setClickedRowClues(clickedRowClues);
        }
      }
    },
    [
      isMultiplayer,
      roomId,
      updateClueState,
      clickedRowClues,
      setClickedRowClues,
    ]
  );

  // Column clue click handler with Firebase sync
  const handleColClueClick = useCallback(
    async (colIndex: number, clueIndex: number | string) => {
      const clueId = `col-${colIndex}-${clueIndex}`;
      const isCurrentlyClicked = clickedColClues.has(clueId);
      const newState = !isCurrentlyClicked; // Toggle state

      // Update local state immediately for responsive UI
      const newSet = new Set(clickedColClues);
      if (newState) {
        newSet.add(clueId);
      } else {
        newSet.delete(clueId);
      }
      setClickedColClues(newSet);

      // Sync with Firebase if multiplayer
      if (isMultiplayer && roomId && updateClueState) {
        try {
          await updateClueState(clueId, newState);
        } catch (error) {
          console.error("Failed to sync column clue state:", error);
          // Revert local state on error
          setClickedColClues(clickedColClues);
        }
      }
    },
    [
      isMultiplayer,
      roomId,
      updateClueState,
      clickedColClues,
      setClickedColClues,
    ]
  );

  return {
    handleRowClueClick,
    handleColClueClick,
  };
};
