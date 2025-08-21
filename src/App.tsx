import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PuzzleSelectionPage } from './pages/PuzzleSelectionPage';
import { GamePage } from './pages/GamePage';
import { JoinRoomPage } from './pages/JoinRoomPage';
import { WaitingRoomPage } from './pages/WaitingRoomPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<PuzzleSelectionPage />} />
          
          {/* Single Player Routes */}
          <Route path="/puzzles" element={<PuzzleSelectionPage />} />
          <Route path="/game/:type/:id" element={<GamePage />} />
          
          {/* Multiplayer Routes */}
          <Route path="/multiplayer/join/:roomId" element={<JoinRoomPage />} />
          <Route path="/multiplayer/room/:roomId/puzzles" element={<PuzzleSelectionPage />} />
          <Route path="/multiplayer/room/:roomId/waiting" element={<WaitingRoomPage />} />
          <Route path="/multiplayer/game/:roomId/:type/:id" element={<GamePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
