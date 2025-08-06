import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import styles from './MultiplayerPuzzleTypePage.module.css';

export function MultiplayerPuzzleTypePage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [roomLink, setRoomLink] = useState('');

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

    const fullRoomLink = `${window.location.origin}/multiplayer/join/${roomId}`;
    setRoomLink(fullRoomLink);
  }, [roomId, navigate]);

  const copyRoomLink = async () => {
    try {
      await navigator.clipboard.writeText(roomLink);
      alert('Room link copied to clipboard!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = roomLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Room link copied to clipboard!');
    }
  };

  if (!roomId) return null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Room Created!</h1>
        <p className={styles.subtitle}>Select puzzle type and share the link with friends</p>
      </header>

      <main className={styles.main}>
        <div className={styles.roomInfo}>
          <h3 className={styles.roomTitle}>Room: {roomId}</h3>
          <div className={styles.linkContainer}>
            <input
              type="text"
              value={roomLink}
              readOnly
              className={styles.linkInput}
            />
            <button
              type="button"
              onClick={copyRoomLink}
              className={styles.copyButton}
            >
              Copy Link
            </button>
          </div>
        </div>

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
