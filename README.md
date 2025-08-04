# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Nonogram Puzzle Game

A modern, modular Nonogram puzzle game built with React 18+, Vite, and TypeScript. Features classic and super nonogram puzzles with a clean, intuitive interface.

## Features

- **Two Game Types**: Classic Nonogram and Super Nonogram puzzles
- **Intuitive Interface**: Click to fill cells, right-click to mark as empty
- **Solution Helper**: Show/hide solution functionality
- **Responsive Design**: Works on desktop and mobile devices
- **Modular Architecture**: Clean, maintainable code structure
- **TypeScript**: Full type safety throughout the application

## Game Flow

1. **Home Page**: Choose between Classic or Super Nonogram
2. **Puzzle Selection**: Select from available numbered puzzles
3. **Game Play**: Solve puzzles using logical deduction
4. **Controls**: Back, Show Solution, and Clear Grid buttons

## How to Play

- **Left Click**: Cycle through cell states (empty → filled → marked → empty)
- **Fill cells** based on the number clues for each row and column
- **Numbers indicate** consecutive filled cells in that row/column
- **Complete the puzzle** by correctly filling all cells

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── GameBoard/      # Main game grid component
│   └── GameControls/   # Game control buttons
├── hooks/              # Custom React hooks
│   ├── useGameState.ts # Game state management
│   └── usePuzzleLoader.ts # Puzzle loading logic
├── pages/              # Route-based page components
│   ├── HomePage/       # Landing page
│   ├── PuzzleSelectionPage/ # Puzzle selection
│   └── GamePage/       # Main game interface
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   ├── gridUtils.ts    # Grid manipulation utilities
│   └── puzzleUtils.ts  # Puzzle loading utilities
└── App.tsx             # Main application with routing

public/
└── puzzles/            # Puzzle data files
    ├── classic/        # Classic nonogram puzzles
    └── super/          # Super nonogram puzzles
```

## Technologies Used

- **React 18+**: Modern React with hooks
- **TypeScript**: Type safety and better developer experience
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing
- **CSS Modules**: Scoped styling to avoid conflicts

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the displayed local URL

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## Deployment

This project is optimized for static hosting platforms like Vercel, Netlify, or GitHub Pages. The build output contains only static files with no server-side dependencies.

## Puzzle Format

Puzzles are stored as JSON files with the following structure:

```json
{
  "id": 1,
  "type": "classic",
  "size": { "width": 5, "height": 5 },
  "rowClues": [[2], [1, 1], [5], [1, 1], [2]],
  "colClues": [[2], [1, 1], [5], [1, 1], [2]],
  "solution": [
    [0, 1, 1, 1, 0],
    [1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [0, 1, 1, 1, 0]
  ]
}
```

## Contributing

1. Follow the existing code style and architecture
2. Use TypeScript for all new code
3. Add appropriate comments explaining logic (not implementation details)
4. Test thoroughly on different screen sizes
5. Ensure compatibility with the deployment target

## License

This project is for educational and personal use.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
