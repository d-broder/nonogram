import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppNavigationProvider } from "./shared/contexts/AppNavigationContext";
import {
  PuzzleSelectionPage,
  GamePage,
  JoinRoomPage,
  WaitingRoomPage,
} from "./views";
import { SinglePlayerRouter } from "./pages/SinglePlayerRouter";
import { MultiplayerRouter } from "./pages/MultiplayerRouter";
import "./App.css";

// Force refresh
console.log("App.tsx loaded");

function App() {
  return (
    <AppNavigationProvider>
      <Router>
        <div className="app">
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
        </div>
      </Router>
    </AppNavigationProvider>
  );
}

export default App;
