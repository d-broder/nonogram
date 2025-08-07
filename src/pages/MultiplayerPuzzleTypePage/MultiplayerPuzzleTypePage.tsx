import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import { useFirebaseRoom } from '../../hooks/useFirebaseRoom';
import styles from './MultiplayerPuzzleTypePage.module.css';

export function MultiplayerPuzzleTypePage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [roomLink, setRoomLink] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const { room } = useFirebaseRoom(roomId || null);

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

    // Check if user is the creator
    const player = JSON.parse(playerInfo);
    if (!player.isCreator) {
      navigate(`/multiplayer/room/${roomId}/waiting`);
      return;
    }

    const fullRoomLink = `${window.location.origin}/multiplayer/join/${roomId}`;
    setRoomLink(fullRoomLink);
  }, [roomId, navigate]);

  const copyRoomLink = async () => {
    try {
      await navigator.clipboard.writeText(roomLink);
      setShowTooltip(true);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = roomLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowTooltip(true);
    }
  };

  if (!roomId) return null;

  return (
    <div className={styles.container}>
      <Sidebar
        isMultiplayer={true}
        roomId={roomId}
        roomLink={roomLink}
        players={room ? Object.values(room.players) : []}
        showTooltip={showTooltip}
        onCopyLink={copyRoomLink}
        onHideTooltip={() => setShowTooltip(false)}
      />
      
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Room Created!</h1>
          <p className={styles.subtitle}>Select puzzle type and share the link with friends</p>
        </header>

        <div className={styles.buttonContainer}>
          <Link to={`/multiplayer/room/${roomId}/puzzles/classic`} className={styles.gameTypeButton}>
            <div className={styles.buttonContent}>
              <h2>Classic Nonogram</h2>
              <p>Traditional nonogram puzzles with standard grid sizes</p>
            </div>
          </Link>

          <Link to={`/multiplayer/room/${roomId}/puzzles/super`} className={styles.gameTypeButton}>
            <div className={styles.buttonContent}>
              <h2>Super Nonogram</h2>
              <p>Larger, more challenging nonogram puzzles</p>
            </div>
          </Link>
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
