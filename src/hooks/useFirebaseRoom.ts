import { useState, useEffect } from 'react';
import { 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  serverTimestamp,
  deleteField 
} from 'firebase/firestore';
import { firestore } from '../firebase';
import type { Player, Room, CellState } from '../types';

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
      doc(firestore, 'rooms', roomId),
      (doc) => {
        if (doc.exists()) {
          setRoom({ id: doc.id, ...doc.data() } as Room);
          setError(null);
        } else {
          setError('Room not found');
          setRoom(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to room:', error);
        setError('Failed to connect to room');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [roomId]);

  // Create a new room
  const createRoom = async (creator: Player, roomId: string): Promise<void> => {
    try {
      const roomData: Omit<Room, 'id'> = {
        createdAt: serverTimestamp(),
        createdBy: creator.id,
        players: {
          [creator.id]: creator
        },
        status: 'waiting',
        puzzleType: null,
        puzzleId: null,
        grid: {},
        clues: {}
      };

      await setDoc(doc(firestore, 'rooms', roomId), roomData);
    } catch (error) {
      console.error('Error creating room:', error);
      throw new Error('Failed to create room');
    }
  };

  // Join an existing room
  const joinRoom = async (player: Player): Promise<void> => {
    if (!roomId) throw new Error('No room ID provided');
    
    try {
      await updateDoc(doc(firestore, 'rooms', roomId), {
        [`players.${player.id}`]: player
      });
    } catch (error) {
      console.error('Error joining room:', error);
      throw new Error('Failed to join room');
    }
  };

  // Leave room
  const leaveRoom = async (playerId: string): Promise<void> => {
    if (!roomId) return;
    
    try {
      await updateDoc(doc(firestore, 'rooms', roomId), {
        [`players.${playerId}`]: deleteField()
      });
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

  // Update puzzle selection and initialize grid
  const updatePuzzleSelection = async (puzzleType: 'classic' | 'super', puzzleId: number): Promise<void> => {
    if (!roomId) throw new Error('No room ID provided');
    
    try {
      // Load the puzzle to get dimensions
      const puzzleResponse = await fetch(`/puzzles/${puzzleType}/${puzzleId}.json`);
      const puzzle = await puzzleResponse.json();
      
      // Initialize grid with all cells as "white"
      const initialGrid: { [cellId: string]: CellState } = {};
      for (let row = 0; row < puzzle.size.height; row++) {
        for (let col = 0; col < puzzle.size.width; col++) {
          const cellId = `${row}-${col}`;
          initialGrid[cellId] = 'white';
        }
      }
      
      await updateDoc(doc(firestore, 'rooms', roomId), {
        puzzleType,
        puzzleId,
        status: 'playing',
        grid: initialGrid,
        // Reset clues as well
        clues: {}
      });
    } catch (error) {
      console.error('Error updating puzzle selection:', error);
      throw new Error('Failed to update puzzle selection');
    }
  };

  // Update grid cell
  const updateGridCell = async (cellId: string, state: CellState): Promise<void> => {
    if (!roomId) throw new Error('No room ID provided');
    
    try {
      await updateDoc(doc(firestore, 'rooms', roomId), {
        [`grid.${cellId}`]: state
      });
    } catch (error) {
      console.error('Error updating grid cell:', error);
      throw new Error('Failed to update grid cell');
    }
  };

  // Update clue state using clueId (e.g., "row-0-0", "col-1-2")
  const updateClueState = async (clueId: string, clicked: boolean): Promise<void> => {
    if (!roomId) throw new Error('No room ID provided');
    
    try {
      await updateDoc(doc(firestore, 'rooms', roomId), {
        [`clues.${clueId}`]: clicked
      });
    } catch (error) {
      console.error('Error updating clue state:', error);
      throw new Error('Failed to update clue state');
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
    updateClueState
  };
}
