import { useState, useEffect, useRef } from "react";
import { serverTimestamp } from "firebase/firestore";
import { AVAILABLE_COLORS } from "../constants";
import { ensureAuthenticated } from "../services/firebase";
import type { PlayerColor } from "../types";
import { useFirebaseRoom } from "../../features/room";

export interface RoomFormData {
  playerName: string;
  selectedColor: PlayerColor;
  isLoading: boolean;
  error: string | null;
}

export interface RoomFormActions {
  setPlayerName: (name: string) => void;
  setSelectedColor: (color: PlayerColor) => void;
  setError: (error: string | null) => void;
  createRoom: () => Promise<void>;
  joinRoom: () => Promise<void>;
  clearForm: () => void;
}

export interface UseRoomFormOptions {
  roomId?: string | null;
  usedColors?: PlayerColor[];
  onRoomCreated?: (roomId: string, playerId: string) => void;
  onRoomJoined?: (roomId: string, playerId: string) => void;
  autoSelectAvailableColor?: boolean;
}

export function useRoomForm({
  roomId = null,
  usedColors = [],
  onRoomCreated,
  onRoomJoined,
  autoSelectAvailableColor = false,
}: UseRoomFormOptions = {}): [RoomFormData, RoomFormActions] {
  const [playerName, setPlayerName] = useState("");
  const [selectedColor, setSelectedColor] = useState<PlayerColor>("red");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasUserSelectedColor = useRef(false);

  const { createRoom: firebaseCreateRoom, joinRoom: firebaseJoinRoom } =
    useFirebaseRoom(roomId);

  // Auto-select available color if current is taken
  useEffect(() => {
    if (
      autoSelectAvailableColor &&
      !hasUserSelectedColor.current &&
      usedColors.includes(selectedColor)
    ) {
      const availableColor = AVAILABLE_COLORS.find(
        (color: PlayerColor) => !usedColors.includes(color)
      );
      if (availableColor) {
        setSelectedColor(availableColor);
      }
    }
  }, [usedColors, selectedColor, autoSelectAvailableColor]);

  const createRoom = async () => {
    if (!playerName.trim()) {
      setError("Please enter a display name");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get authenticated user ID
      const playerId = await ensureAuthenticated();

      // Generate random room ID
      const newRoomId = Math.random().toString(36).substr(2, 8).toUpperCase();

      const player = {
        id: playerId,
        name: playerName.trim(),
        color: selectedColor,
        isCreator: true,
        joinedAt: serverTimestamp(),
      };

      // Store player info in sessionStorage
      sessionStorage.setItem(
        "playerInfo",
        JSON.stringify({
          id: playerId,
          name: playerName.trim(),
          color: selectedColor,
          isCreator: true,
          joinedAt: Date.now(), // Use timestamp for sessionStorage
        })
      );

      // Create room in Firebase
      await firebaseCreateRoom(player, newRoomId);

      // Notify success
      if (onRoomCreated) {
        onRoomCreated(newRoomId, playerId);
      }

      // Reset form
      clearForm();
    } catch (error) {
      console.error("Error creating room:", error);
      setError("Failed to create room. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const joinRoom = async () => {
    if (!roomId) {
      setError("No room ID provided");
      return;
    }

    if (!playerName.trim()) {
      setError("Please enter a display name");
      return;
    }

    if (usedColors.includes(selectedColor)) {
      setError("This color is already taken. Please choose another color.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get authenticated user ID
      const playerId = await ensureAuthenticated();

      const player = {
        id: playerId,
        name: playerName.trim(),
        color: selectedColor,
        isCreator: false,
        joinedAt: serverTimestamp(),
      };

      // Store player info in sessionStorage
      sessionStorage.setItem(
        "playerInfo",
        JSON.stringify({
          id: playerId,
          name: playerName.trim(),
          color: selectedColor,
          isCreator: false,
          joinedAt: Date.now(), // Use timestamp for sessionStorage
        })
      );

      // Join room in Firebase
      await firebaseJoinRoom(player);

      // Notify success
      if (onRoomJoined) {
        onRoomJoined(roomId, playerId);
      }

      // Reset form
      clearForm();
    } catch (error) {
      console.error("Error joining room:", error);
      setError("Failed to join room. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setPlayerName("");
    setSelectedColor("red");
    setError(null);
    hasUserSelectedColor.current = false;
  };

  const handleSetSelectedColor = (color: PlayerColor) => {
    hasUserSelectedColor.current = true;
    setSelectedColor(color);
  };

  return [
    {
      playerName,
      selectedColor,
      isLoading,
      error,
    },
    {
      setPlayerName,
      setSelectedColor: handleSetSelectedColor,
      setError,
      createRoom,
      joinRoom,
      clearForm,
    },
  ];
}
