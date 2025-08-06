import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFirebaseRoom } from '../../hooks/useFirebaseRoom';
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
  const { room, loading, error } = useFirebaseRoom(roomId || null);

  // Get players from room data
  const players = room ? Object.values(room.players) : [];

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

    // If room is ready and puzzle is selected, navigate to game
    if (room?.status === 'playing' && room.puzzleType && room.puzzleId) {
      navigate(`/multiplayer/game/${roomId}/${room.puzzleType}/${room.puzzleId}`);
    }
  }, [roomId, room, navigate]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading room...</div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Room not found</h2>
          <p>The room doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/')} className={styles.backButton}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

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
            {players.map((player: Player) => (
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
            Waiting for {players.find((p: Player) => p.isCreator)?.name || 'creator'} to select a puzzle...
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
