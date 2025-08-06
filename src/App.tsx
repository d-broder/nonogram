import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { PuzzleTypePage } from './pages/PuzzleTypePage';
import { PuzzleSelectionPage } from './pages/PuzzleSelectionPage';
import { GamePage } from './pages/GamePage';
import { CreateRoomPage } from './pages/CreateRoomPage';
import { JoinRoomPage } from './pages/JoinRoomPage';
import { MultiplayerPuzzleTypePage } from './pages/MultiplayerPuzzleTypePage';
import { WaitingRoomPage } from './pages/WaitingRoomPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {/* Single Player Routes */}
          <Route path="/puzzles" element={<PuzzleTypePage />} />
          <Route path="/puzzles/:type" element={<PuzzleSelectionPage />} />
          <Route path="/game/:type/:id" element={<GamePage />} />
          
          {/* Multiplayer Routes */}
          <Route path="/multiplayer/create" element={<CreateRoomPage />} />
          <Route path="/multiplayer/join/:roomId" element={<JoinRoomPage />} />
          <Route path="/multiplayer/room/:roomId/select-type" element={<MultiplayerPuzzleTypePage />} />
          <Route path="/multiplayer/room/:roomId/puzzles/:type" element={<PuzzleSelectionPage />} />
          <Route path="/multiplayer/room/:roomId/waiting" element={<WaitingRoomPage />} />
          <Route path="/multiplayer/game/:roomId/:type/:id" element={<GamePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
