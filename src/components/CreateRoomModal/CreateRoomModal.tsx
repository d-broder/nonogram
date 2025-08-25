import { useState } from "react";
import type { PlayerColor } from "../../types";
import { useFirebaseRoom } from "../../hooks/useFirebaseRoom";
import styles from "./CreateRoomModal.module.css";

const AVAILABLE_COLORS: PlayerColor[] = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "pink",
  "teal",
];

const COLOR_VALUES = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
  purple: "#a855f7",
  orange: "#f97316",
  pink: "#ec4899",
  teal: "#14b8a6",
};

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoomCreated: (roomId: string, playerId: string) => void;
}

export function CreateRoomModal({
  isOpen,
  onClose,
  onRoomCreated,
}: CreateRoomModalProps) {
  const [playerName, setPlayerName] = useState("");
  const [selectedColor, setSelectedColor] = useState<PlayerColor>("red");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createRoom } = useFirebaseRoom(null);

  const handleCreateRoom = async () => {
    if (!playerName.trim()) {
      setError("Please enter a display name");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      // Generate random room ID
      const roomId = Math.random().toString(36).substr(2, 8).toUpperCase();
      const playerId = Date.now().toString();

      const player = {
        id: playerId,
        name: playerName.trim(),
        color: selectedColor,
        isCreator: true,
      };

      // Store player info in sessionStorage
      sessionStorage.setItem(
        "playerInfo",
        JSON.stringify({
          id: playerId,
          name: playerName.trim(),
          color: selectedColor,
          isCreator: true,
        })
      );

      // Create room in Firebase
      await createRoom(player, roomId);

      // Notify parent component
      onRoomCreated(roomId, playerId);

      // Reset form
      setPlayerName("");
      setSelectedColor("red");
      setError(null);
    } catch (error) {
      console.error("Error creating room:", error);
      setError("Failed to create room. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setPlayerName("");
      setSelectedColor("red");
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Create New Room</h2>
          <button
            type="button"
            onClick={handleClose}
            className={styles.closeButton}
            disabled={isCreating}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.field}>
            <label htmlFor="playerName" className={styles.label}>
              Display Name
            </label>
            <input
              id="playerName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name..."
              className={styles.input}
              maxLength={20}
              disabled={isCreating}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Player Color</label>
            <div className={styles.colorGrid}>
              {AVAILABLE_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`${styles.colorButton} ${
                    selectedColor === color ? styles.selected : ""
                  }`}
                  style={{ backgroundColor: COLOR_VALUES[color] }}
                  onClick={() => setSelectedColor(color)}
                  disabled={isCreating}
                  aria-label={`Select ${color} color`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          {error && <div className={styles.error}>{error}</div>}
          <button
            type="button"
            onClick={handleClose}
            className={styles.cancelButton}
            disabled={isCreating}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreateRoom}
            className={styles.createButton}
            disabled={!playerName.trim() || isCreating}
          >
            {isCreating ? "Creating Room..." : "Create Room"}
          </button>
        </div>
      </div>
    </div>
  );
}
