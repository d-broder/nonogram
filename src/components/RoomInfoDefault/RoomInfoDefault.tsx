import styles from './RoomInfoDefault.module.css';

interface RoomInfoDefaultProps {
  onCreateRoom: () => void;
}

export function RoomInfoDefault({ onCreateRoom }: RoomInfoDefaultProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h3 className={styles.title}>Multiplayer</h3>
        <p className={styles.description}>
          Create a room to play with friends in real-time
        </p>
        <button
          type="button"
          onClick={onCreateRoom}
          className={styles.createButton}
        >
          Create New Room
        </button>
      </div>
    </div>
  );
}
