import styles from './RoomInfoDefault.module.css';

interface RoomInfoDefaultProps {
  onCreateRoom: () => void;
}

export function RoomInfoDefault({ onCreateRoom }: RoomInfoDefaultProps) {
  return (
    <button
      type="button"
      onClick={onCreateRoom}
      className={styles.createButton}
    >
      Create New Room
    </button>
  );
}
