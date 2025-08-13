import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PlayerColor } from '../../types';
import { useFirebaseRoom } from '../../hooks/useFirebaseRoom';
import styles from './CreateRoomPage.module.css';

const AVAILABLE_COLORS: PlayerColor[] = [
  'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'teal'
];

const COLOR_VALUES = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
  purple: '#a855f7',
  orange: '#f97316',
  pink: '#ec4899',
  teal: '#14b8a6'
};

export function CreateRoomPage() {
  const [playerName, setPlayerName] = useState('');
  const [selectedColor, setSelectedColor] = useState<PlayerColor>('blue');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { createRoom } = useFirebaseRoom(null);

  const handleCreateRoom = async () => {
    if (!playerName.trim()) {
      setError('Please enter a display name');
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
        isCreator: true
      };

      // Store player info in sessionStorage
      sessionStorage.setItem('playerInfo', JSON.stringify({
        id: playerId,
        name: playerName.trim(),
        color: selectedColor,
        isCreator: true
      }));

      // Create room in Firebase
      await createRoom(player, roomId);

      // Navigate to puzzle type selection with room context
      navigate(`/multiplayer/room/${roomId}/select-type`);
    } catch (error) {
      console.error('Error creating room:', error);
      setError('Failed to create room. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Room</h1>

      <div className={styles.form}>
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
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Player Color</label>
          <div className={styles.colorGrid}>
            {AVAILABLE_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`${styles.colorButton} ${selectedColor === color ? styles.selected : ''}`}
                style={{ backgroundColor: COLOR_VALUES[color] }}
                onClick={() => setSelectedColor(color)}
                aria-label={`Select ${color} color`}
              />
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}
          <button
            type="button"
            onClick={handleCreateRoom}
            className={styles.createButton}
            disabled={!playerName.trim() || isCreating}
          >
            {isCreating ? 'Creating Room...' : 'Create Room'}
          </button>
        </div>
      </div>

      <div className={styles.backButton}>
        <button
          type="button"
          onClick={() => navigate('/')}
          className={styles.backLink}
        >
          ← Back to Game Mode Selection
        </button>
      </div>
    </div>
  );
}
