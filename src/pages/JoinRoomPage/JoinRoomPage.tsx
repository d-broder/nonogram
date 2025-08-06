import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { PlayerColor } from '../../types';
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
  const [usedColors] = useState<PlayerColor[]>(['red']); // Simulate some colors already taken
  const navigate = useNavigate();

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

  const handleJoinRoom = () => {
    if (!playerName.trim()) {
      alert('Please enter a display name');
      return;
    }

    if (usedColors.includes(selectedColor)) {
      alert('This color is already taken. Please select another color.');
      return;
    }

    // Store player info in sessionStorage
    sessionStorage.setItem('playerInfo', JSON.stringify({
      name: playerName.trim(),
      color: selectedColor,
      isCreator: false
    }));

    // Navigate to waiting room (creator hasn't selected puzzle yet)
    navigate(`/multiplayer/room/${roomId}/waiting`);
  };

  const isColorDisabled = (color: PlayerColor) => usedColors.includes(color);

  if (!roomId) return null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Join Room: {roomId}</h1>
        <p className={styles.subtitle}>Set up your player identity</p>
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
              {AVAILABLE_COLORS.map((color) => {
                const disabled = isColorDisabled(color);
                return (
                  <button
                    key={color}
                    type="button"
                    className={`${styles.colorButton} ${selectedColor === color ? styles.selected : ''} ${disabled ? styles.disabled : ''}`}
                    style={{ backgroundColor: COLOR_VALUES[color] }}
                    onClick={() => !disabled && setSelectedColor(color)}
                    disabled={disabled}
                    aria-label={`${disabled ? 'Taken' : 'Select'} ${color} color`}
                  >
                    {disabled && <span className={styles.takenMark}>✓</span>}
                  </button>
                );
              })}
            </div>
            <p className={styles.colorHint}>Colors with ✓ are already taken by other players</p>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleJoinRoom}
              className={styles.joinButton}
              disabled={!playerName.trim() || usedColors.includes(selectedColor)}
            >
              Join Room
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
