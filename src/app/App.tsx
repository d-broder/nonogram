import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AppNavigationProvider } from "../shared/contexts/AppNavigationContext";
import { SinglePlayerRouter } from "../pages/SinglePlayerRouter";
import { MultiplayerRouter } from "../pages/MultiplayerRouter";
import { useAuth } from "../shared/hooks";
import "./App.css";
import styles from "./AppLoading.module.css";

// Lazy load views for better performance
const PuzzleSelectionPage = lazy(() =>
  import("../views").then((module) => ({ default: module.PuzzleSelectionPage }))
);
const GamePage = lazy(() =>
  import("../views").then((module) => ({ default: module.GamePage }))
);
const JoinRoomPage = lazy(() =>
  import("../views").then((module) => ({ default: module.JoinRoomPage }))
);
const WaitingRoomPage = lazy(() =>
  import("../views").then((module) => ({ default: module.WaitingRoomPage }))
);

// Loading component
function LoadingSpinner() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingContent}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Loading...</p>
      </div>
    </div>
  );
}

// Force refresh
console.log("App.tsx loaded");

function App() {
  const { authLoading, isAuthenticated } = useAuth();

  // Show loading while authenticating
  if (authLoading) {
    return <LoadingSpinner />;
  }

  // Show error if authentication failed (though this shouldn't happen with anonymous auth)
  if (!isAuthenticated) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2 className={styles.errorTitle}>Authentication Failed</h2>
          <p className={styles.errorMessage}>
            Unable to authenticate. Please refresh the page to try again.
          </p>
          <button
            className={styles.refreshButton}
            onClick={() => window.location.reload()}
          >
            🔄 Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <AppNavigationProvider>
      <Router>
        <div className="app">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<SinglePlayerRouter />} />

              {/* Multiplayer Room Route - handles all multiplayer scenarios */}
              <Route path="/:roomId" element={<MultiplayerRouter />} />

              {/* Legacy Single Player Routes (kept for backward compatibility) */}
              <Route path="/puzzles" element={<PuzzleSelectionPage />} />
              <Route path="/game/:type/:id" element={<GamePage />} />

              {/* Legacy Multiplayer Routes (redirected or deprecated) */}
              <Route
                path="/multiplayer/join/:roomId"
                element={<JoinRoomPage />}
              />
              <Route
                path="/multiplayer/room/:roomId/puzzles"
                element={<PuzzleSelectionPage />}
              />
              <Route
                path="/multiplayer/room/:roomId/waiting"
                element={<WaitingRoomPage />}
              />
              <Route
                path="/multiplayer/game/:roomId/:type/:id"
                element={<GamePage />}
              />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </AppNavigationProvider>
  );
}

export default App;
