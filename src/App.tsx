import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { PuzzleSelectionPage } from './pages/PuzzleSelectionPage';
import { GamePage } from './pages/GamePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/puzzles/:type" element={<PuzzleSelectionPage />} />
          <Route path="/game/:type/:id" element={<GamePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
