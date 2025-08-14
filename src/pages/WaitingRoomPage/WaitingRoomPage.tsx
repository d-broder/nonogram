import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFirebaseRoom } from '../../hooks/useFirebaseRoom';
import { PageLayout } from '../../components/PageLayout';
import type { Player } from '../../types';
import styles from './WaitingRoomPage.module.css';

export function WaitingRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { room, loading, error } = useFirebaseRoom(roomId || null);

  // Get players from room data
  const players = room ? Object.values(room.players) : [];
  const roomLink = roomId ? `${window.location.origin}/multiplayer/join/${roomId}` : '';

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
      <PageLayout
        showBackButton
        isMultiplayer
        roomId={roomId}
        roomLink={roomLink}
        players={players}
      >
        <div className={styles.loading}>Loading room...</div>
      </PageLayout>
    );
  }

  if (error || !room) {
    return (
      <PageLayout
        showBackButton
        isMultiplayer
        roomId={roomId}
        roomLink={roomLink}
        players={players}
      >
        <div className={styles.error}>
          <h2>Room not found</h2>
          <p>The room doesn't exist or has been removed.</p>
        </div>
      </PageLayout>
    );
  }

  if (!roomId) return null;

  return (
    <PageLayout
      showBackButton
      isMultiplayer
      roomId={roomId}
      roomLink={roomLink}
      players={players}
    >
      <div className={styles.statusContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.statusText}>
          Waiting for {players.find((p: Player) => p.isCreator)?.name || 'creator'} to select a puzzle...
        </p>
      </div>
    </PageLayout>
  );
}
