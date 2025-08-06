import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Player } from '../../types';
import styles from './WaitingRoomPage.module.css';

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

export function WaitingRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [players] = useState<Player[]>([
    {
      id: '1',
      name: 'Creator Player',
      color: 'red',
      isCreator: true
    },
    {
      id: '2',
      name: 'Joined Player',
      color: 'blue',
      isCreator: false
    }
  ]);

  useEffect(() => {
    if (!roomId) {
      navigate('/');
      return;
    }

    // Check if player info exists
    const playerInfo = sessionStorage.getItem('playerInfo');
    if (!playerInfo) {
      navigate('/');
      return;
    }

    // Simulate checking if puzzle is selected by creator
    // In real implementation, this would listen to room state changes
    const timer = setTimeout(() => {
      // Simulate creator selecting a puzzle
      console.log('Creator selected puzzle, redirecting to game...');
      // navigate(`/multiplayer/game/${roomId}/classic/1`);
    }, 10000); // Simulate 10 seconds wait

    return () => clearTimeout(timer);
  }, [roomId, navigate]);

  if (!roomId) return null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Room: {roomId}</h1>
        <p className={styles.subtitle}>Awaiting creator to select puzzle...</p>
      </header>

      <main className={styles.main}>
        <div className={styles.playersContainer}>
          <h2 className={styles.playersTitle}>Players in Room</h2>
          <div className={styles.playersList}>
            {players.map((player) => (
              <div key={player.id} className={styles.playerCard}>
                <div
                  className={styles.playerColor}
                  style={{ backgroundColor: COLOR_VALUES[player.color] }}
                />
                <div className={styles.playerInfo}>
                  <span className={styles.playerName}>{player.name}</span>
                  {player.isCreator && <span className={styles.creatorBadge}>Creator</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.statusContainer}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.statusText}>
            Waiting for {players.find(p => p.isCreator)?.name || 'creator'} to select a puzzle...
          </p>
        </div>

        <div className={styles.backButton}>
          <button
            type="button"
            onClick={() => navigate('/')}
            className={styles.backLink}
          >
            ← Leave Room
          </button>
        </div>
      </main>
    </div>
  );
}
