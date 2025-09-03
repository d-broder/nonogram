import { useState, useEffect, useCallback } from "react";
import {
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  deleteField,
  deleteDoc,
} from "firebase/firestore";
import {
  firestore,
  ensureAuthenticated,
} from "../../../shared/services/firebase";
import type { Player, Room, CellState } from "../../../shared/types";

export function useFirebaseRoom(roomId: string | null) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) {
      setLoading(false);
      return;
    }

    // Listen to room changes in real-time
    const unsubscribe = onSnapshot(
      doc(firestore, "rooms", roomId),
      (doc) => {
        if (doc.exists()) {
          setRoom({ id: doc.id, ...doc.data() } as Room);
          setError(null);
        } else {
          setError("Room not found");
          setRoom(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to room:", error);
        setError("Failed to connect to room");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [roomId]);

  // Create a new room
  const createRoom = async (creator: Player, roomId: string): Promise<void> => {
    try {
      // Ensure user is authenticated
      await ensureAuthenticated();

      const roomData: Omit<Room, "id"> = {
        createdAt: serverTimestamp(),
        createdBy: creator.id,
        players: {
          [creator.id]: creator,
        },
        status: "waiting",
        puzzleType: null,
        puzzleId: null,
        grid: {},
        cellAuthors: {},
        clues: {},
      };

      await setDoc(doc(firestore, "rooms", roomId), roomData);
    } catch (error) {
      console.error("Error creating room:", error);
      throw new Error("Failed to create room");
    }
  };

  // Join an existing room
  const joinRoom = async (player: Player): Promise<void> => {
    if (!roomId) throw new Error("No room ID provided");

    try {
      // Ensure user is authenticated
      await ensureAuthenticated();

      await updateDoc(doc(firestore, "rooms", roomId), {
        [`players.${player.id}`]: player,
      });
    } catch (error) {
      console.error("Error joining room:", error);
      throw new Error("Failed to join room");
    }
  };

  // Leave room with host transfer and room cleanup logic
  const leaveRoom = useCallback(
    async (playerId: string): Promise<void> => {
      if (!roomId || !room) return;

      try {
        const players = Object.values(room.players);
        const leavingPlayer = room.players[playerId];

        if (!leavingPlayer) return;

        // If this is the only player, delete the room
        if (players.length === 1) {
          await deleteDoc(doc(firestore, "rooms", roomId));
          return;
        }

        // Remove the player from the room
        const updateData: any = {
          [`players.${playerId}`]: deleteField(),
        };

        // If the leaving player is the creator, transfer host to another player
        if (leavingPlayer.isCreator) {
          const remainingPlayers = players.filter((p) => p.id !== playerId);
          if (remainingPlayers.length > 0) {
            const newHost = remainingPlayers[0];
            // Update the new host
            updateData[`players.${newHost.id}`] = {
              ...newHost,
              isCreator: true,
            };
            // Update createdBy field
            updateData.createdBy = newHost.id;
          }
        }

        await updateDoc(doc(firestore, "rooms", roomId), updateData);
      } catch (error) {
        console.error("Error leaving room:", error);
      }
    },
    [roomId, room]
  );

  // Update puzzle selection and initialize grid
  const updatePuzzleSelection = async (
    puzzleType: "classic" | "super",
    puzzleId: number
  ): Promise<void> => {
    if (!roomId) throw new Error("No room ID provided");

    try {
      // Load the puzzle to get dimensions
      const puzzleResponse = await fetch(
        `/puzzles/${puzzleType}/${puzzleId}.json`
      );
      const puzzle = await puzzleResponse.json();

      // Initialize grid with all cells as "white"
      const initialGrid: { [cellId: string]: CellState } = {};
      for (let row = 0; row < puzzle.size.height; row++) {
        for (let col = 0; col < puzzle.size.width; col++) {
          const cellId = `${row}-${col}`;
          initialGrid[cellId] = "white";
        }
      }

      await updateDoc(doc(firestore, "rooms", roomId), {
        puzzleType,
        puzzleId,
        status: "playing",
        grid: initialGrid,
        cellAuthors: {}, // Reset cell authors as well
        // Reset clues as well
        clues: {},
      });
    } catch (error) {
      console.error("Error updating puzzle selection:", error);
      throw new Error("Failed to update puzzle selection");
    }
  };

  // Update grid cell with author tracking
  const updateGridCell = async (
    cellId: string,
    state: CellState,
    playerId?: string
  ): Promise<void> => {
    if (!roomId) throw new Error("No room ID provided");

    try {
      const updateData: any = {
        [`grid.${cellId}`]: state,
      };

      // If cell is being filled (not white) and playerId is provided, track the author
      if (state !== "white" && playerId) {
        updateData[`cellAuthors.${cellId}`] = playerId;
      } else if (state === "white") {
        // If cell is being cleared, remove the author
        updateData[`cellAuthors.${cellId}`] = null;
      }

      await updateDoc(doc(firestore, "rooms", roomId), updateData);
    } catch (error) {
      console.error("Error updating grid cell:", error);
      throw new Error("Failed to update grid cell");
    }
  };

  // Update clue state using clueId (e.g., "row-0-0", "col-1-2")
  const updateClueState = async (
    clueId: string,
    clicked: boolean
  ): Promise<void> => {
    if (!roomId) throw new Error("No room ID provided");

    try {
      await updateDoc(doc(firestore, "rooms", roomId), {
        [`clues.${clueId}`]: clicked,
      });
    } catch (error) {
      console.error("Error updating clue state:", error);
      throw new Error("Failed to update clue state");
    }
  };

  // Reset room to waiting state (for "Back to Puzzles")
  const resetRoomToWaiting = async (): Promise<void> => {
    if (!roomId) throw new Error("No room ID provided");

    try {
      await updateDoc(doc(firestore, "rooms", roomId), {
        status: "waiting",
        puzzleType: null,
        puzzleId: null,
        grid: {},
        cellAuthors: {},
        clues: {},
      });
    } catch (error) {
      console.error("Error resetting room:", error);
      throw new Error("Failed to reset room");
    }
  };

  // Migrate game state to a room (for single player to multiplayer transition)
  const migrateGameState = async (
    targetRoomId: string,
    migrationData: any
  ): Promise<void> => {
    try {
      await updateDoc(doc(firestore, "rooms", targetRoomId), {
        grid: migrationData.grid || {},
        cellAuthors: migrationData.cellAuthors || {},
        clues: migrationData.clues || {},
        status: migrationData.status || "waiting",
        puzzleType: migrationData.puzzleType || null,
        puzzleId: migrationData.puzzleId || null,
        gameSettings: {
          ...migrationData.gameSettings,
          migratedAt: serverTimestamp(),
        },
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error migrating game state:", error);
      throw new Error("Failed to migrate game state");
    }
  };

  return {
    room,
    loading,
    error,
    createRoom,
    joinRoom,
    leaveRoom,
    updatePuzzleSelection,
    updateGridCell,
    updateClueState,
    resetRoomToWaiting,
    migrateGameState,
  };
}
