import { Link } from 'react-router-dom';
import styles from './PuzzleTypePage.module.css';

export function PuzzleTypePage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Select Puzzle Type</h1>
        <p className={styles.subtitle}>Choose your puzzle type to get started</p>
      </header>

      <main className={styles.main}>
        <div className={styles.buttonContainer}>
          <Link to="/puzzles/classic" className={styles.gameTypeButton}>
            <div className={styles.buttonContent}>
              <h2>Classic Nonogram</h2>
              <p>Traditional nonogram puzzles with standard grid sizes</p>
            </div>
          </Link>

          <Link to="/puzzles/super" className={styles.gameTypeButton}>
            <div className={styles.buttonContent}>
              <h2>Super Nonogram</h2>
              <p>Larger, more challenging nonogram puzzles</p>
            </div>
          </Link>
        </div>

        <div className={styles.backButton}>
          <Link to="/" className={styles.backLink}>
            ← Back to Game Mode Selection
          </Link>
        </div>
      </main>
    </div>
  );
}
