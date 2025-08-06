import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { PlayerColor } from '../../types';
import { useFirebaseRoom } from '../../hooks/useFirebaseRoom';
import styles from './JoinRoomPage.module.css';

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

export function JoinRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [playerName, setPlayerName] = useState('');
  const [selectedColor, setSelectedColor] = useState<PlayerColor>('blue');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { room, loading, error: roomError, joinRoom } = useFirebaseRoom(roomId || null);

  // Get used colors from room data
  const usedColors = room ? Object.values(room.players).map(player => player.color) : [];

  useEffect(() => {
    if (!roomId) {
      navigate('/');
      return;
    }

    // Find first available color
    const availableColor = AVAILABLE_COLORS.find(color => !usedColors.includes(color));
    if (availableColor) {
      setSelectedColor(availableColor);
    }
  }, [roomId, navigate, usedColors]);

  const handleJoinRoom = async () => {
    if (!playerName.trim()) {
      setError('Please enter a display name');
      return;
    }

    if (usedColors.includes(selectedColor)) {
      setError('This color is already taken. Please select another color.');
      return;
    }

    setIsJoining(true);
    setError(null);

    try {
      const playerId = Date.now().toString();
      
      const player = {
        id: playerId,
        name: playerName.trim(),
        color: selectedColor,
        isCreator: false
      };

      // Store player info in sessionStorage
      sessionStorage.setItem('playerInfo', JSON.stringify(player));

      // Join room in Firebase
      await joinRoom(player);

      // Navigate based on room status
      if (room?.status === 'playing' && room.puzzleType && room.puzzleId) {
        navigate(`/multiplayer/game/${roomId}/${room.puzzleType}/${room.puzzleId}`);
      } else {
        navigate(`/multiplayer/room/${roomId}/waiting`);
      }
    } catch (error) {
      console.error('Error joining room:', error);
      setError('Failed to join room. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const isColorDisabled = (color: PlayerColor) => usedColors.includes(color);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading room...</div>
      </div>
    );
  }

  if (roomError || !room) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Room not found</h2>
          <p>The room you're trying to join doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/')} className={styles.backButton}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Join Room</h1>
        <p className={styles.subtitle}>Room ID: {roomId}</p>
        <p className={styles.info}>
          {Object.keys(room.players).length} player(s) in room
        </p>
      </header>

      <main className={styles.main}>
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
                  className={`${styles.colorButton} ${
                    selectedColor === color ? styles.selected : ''
                  } ${isColorDisabled(color) ? styles.disabled : ''}`}
                  style={{ backgroundColor: COLOR_VALUES[color] }}
                  onClick={() => !isColorDisabled(color) && setSelectedColor(color)}
                  disabled={isColorDisabled(color)}
                  aria-label={`Select ${color} color ${isColorDisabled(color) ? '(taken)' : ''}`}
                />
              ))}
            </div>
            {usedColors.length > 0 && (
              <p className={styles.colorNote}>
                Grayed out colors are already taken by other players
              </p>
            )}
          </div>

          <div className={styles.actions}>
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
            <button
              type="button"
              onClick={handleJoinRoom}
              className={styles.joinButton}
              disabled={!playerName.trim() || isJoining || isColorDisabled(selectedColor)}
            >
              {isJoining ? 'Joining Room...' : 'Join Room'}
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
      </main>
    </div>
  );
}
