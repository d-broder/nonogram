import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppNavigationProvider } from "./contexts/AppNavigationContext";
import { PuzzleSelectionPage } from "./pages/PuzzleSelectionPage";
import { GamePage } from "./pages/GamePage";
import { JoinRoomPage } from "./pages/JoinRoomPage";
import { WaitingRoomPage } from "./pages/WaitingRoomPage";
import { UnifiedPage } from "./pages/UnifiedPage";
import { MultiplayerRoomHandler } from "./pages/MultiplayerRoomHandler";
import "./App.css";

function App() {
  return (
    <AppNavigationProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<UnifiedPage />} />

            {/* Multiplayer Room Route - handles all multiplayer scenarios */}
            <Route path="/:roomId" element={<MultiplayerRoomHandler />} />

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
