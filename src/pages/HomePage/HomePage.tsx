import { Link } from 'react-router-dom';
import { PageLayout } from '../../components/PageLayout';
import styles from './HomePage.module.css';

export function HomePage() {
  return (
    <PageLayout>
      <header className={styles.header}>
        <h1 className={styles.title}>Nonogram Puzzle Game</h1>
        <p className={styles.subtitle}>Choose your game mode to get started</p>
      </header>

      <main className={styles.main}>
        <div className={styles.buttonContainer}>
          <Link to="/puzzles" className={styles.gameTypeButton}>
            <div className={styles.buttonContent}>
              <h2>Single Player</h2>
              <p>Play alone and solve puzzles at your own pace</p>
            </div>
          </Link>

          <Link to="/multiplayer/create" className={styles.gameTypeButton}>
            <div className={styles.buttonContent}>
              <h2>Multiplayer</h2>
              <p>Create or join a room to solve puzzles with friends</p>
            </div>
          </Link>
        </div>
      </main>
    </PageLayout>
  );
}
