import { useNavigate } from 'react-router-dom';
import styles from './SuccessModal.module.css';

interface SuccessModalProps {
  isVisible: boolean;
  puzzleType: 'classic' | 'super';
  puzzleId: number;
  onClose: () => void;
}

export function SuccessModal({ isVisible, puzzleType, puzzleId, onClose }: SuccessModalProps) {
  const navigate = useNavigate();

  if (!isVisible) return null;

  const handleBackToHome = () => {
    navigate('/');
    onClose();
  };

  const handleBackToPuzzles = () => {
    navigate(`/puzzles/${puzzleType}`);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.celebration}>
          <div className={styles.emoji}>🎉</div>
          <h2 className={styles.title}>Congratulations!</h2>
          <p className={styles.message}>
            You successfully solved {puzzleType === 'classic' ? 'Classic' : 'Super'} Nonogram Puzzle {puzzleId}!
          </p>
        </div>
        
        <div className={styles.actions}>
          <button 
            onClick={handleBackToPuzzles}
            className={`${styles.button} ${styles.primaryButton}`}
          >
            Back to Puzzles
          </button>
          <button 
            onClick={handleBackToHome}
            className={`${styles.button} ${styles.secondaryButton}`}
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
