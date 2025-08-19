<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Nonogram React Project Instructions

## Project Architecture Overview

A React 18+ Nonogram game with dual-mode architecture: singleplayer (local state) and multiplayer (Firebase real-time sync). Core pattern: **shared game logic with conditional synchronization**.

### Key Architectural Patterns

- **Route-based Mode Detection**: `location.pathname.includes('/multiplayer/')` determines sync behavior
- **Conditional Callbacks**: `useGameState(puzzle, { onCellChange: isMultiplayer ? updateGridCell : undefined })`
- **SessionStorage Player Identity**: Multiplayer players store `{id, name, color, isCreator}` in sessionStorage
- **Real-time State Sync**: Firebase `onSnapshot` listeners + `updateCellExternally()` for external updates

## Critical Data Flow Patterns

### 1. Cell State Management

```tsx
// Single source of truth in useGameState hook
const updateCellExternally = (cellId: string, state: CellState) => {
  // Updates grid without triggering sync callbacks
};

// Multiplayer sync: GamePage -> useGameState -> Firebase -> other players
```

### 2. Firebase Room Structure

```ts
Room {
  players: { [playerId]: Player },
  grid: { [cellId]: CellState },           // "0-1": "black"
  cellAuthors: { [cellId]: playerId },     // Track who filled each cell
  clues: { [clueId]: boolean },            // "row-0-0": true
  status: 'waiting' | 'playing'
}
```

## Component Architecture

### PageLayout Component

- **Responsive Design**: Desktop sidebar + mobile bottom bar
- **Conditional UI**: `{isMultiplayer && roomId && (...)}` pattern throughout
- **Button States**: All game controls disable when `isComplete={true}`

### CSS Modules Pattern

- **Naming**: `.componentName` + `.componentNameState` (e.g., `.toggleButton.enabled`)
- **Responsive**: Mobile styles at `@media (max-width: 768px)`
- **CSS Variables**: Use `var(--cell-size, 40px)` for zoom-responsive sizing

### Custom Hooks Architecture

- **useGameState**: Core game logic with optional Firebase callbacks
- **useFirebaseRoom**: Real-time sync + CRUD operations
- **useZoom**: Calculates proportional sizing configs
- **usePuzzleLoader**: Loads puzzles from `/public/puzzles/{type}/{id}.json`

## Development Workflow

### Build & Dev Commands

```bash
npm run dev     # Vite dev server
npm run build   # TypeScript check + Vite build
npm run lint    # ESLint check
```

### Testing Multiplayer Locally

1. Start dev server: `npm run dev`
2. Create room in one browser/tab
3. Join room in incognito/different browser using room link
4. Both players can interact with shared grid state

## Critical Implementation Details

### Firebase Integration

- **Firestore Config**: `src/firebase.ts` - already configured for production
- **Real-time Listeners**: Use `onSnapshot()` for automatic updates
- **Error Handling**: Always wrap Firebase calls in try-catch
- **Offline Tolerance**: Game continues working in singleplayer if Firebase fails

### Mobile Responsiveness

- **Touch Events**: GameBoard handles both mouse and touch events
- **Layout Switching**: `isMobile` state switches between sidebar and bottom bar
- **Scroll Prevention**: Touch interactions prevent page scrolling during gameplay

### State Synchronization Strategy

- **Optimistic Updates**: Local state updates immediately, then syncs to Firebase
- **External Updates**: Use `updateCellExternally()` to avoid sync loops
- **Error Recovery**: Revert local state if Firebase sync fails

## Type System Patterns

### Key Type Definitions

```tsx
type CellState = "white" | "black" | "x" | "o";
type PaintMode = "black" | "x" | "o";
type PlayerColor =
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "purple"
  | "orange"
  | "pink"
  | "teal";
```

### Component Props Pattern

```tsx
interface ComponentProps {
  // Required props first
  puzzle: Puzzle;

  // Optional with defaults
  showSolution?: boolean;

  // Conditional props (only in multiplayer)
  cellAuthors?: { [cellId: string]: string };

  // Callback props
  onCellChange?: (
    cellId: string,
    state: CellState,
    playerId?: string
  ) => Promise<void>;
}
```

## Deployment & Production

- **Static Hosting**: Vercel-compatible build output
- **Asset Loading**: All puzzles in `/public/puzzles/` for static serving
- **Firebase Production**: Already configured with production keys
- **Error Boundaries**: Console logging for debugging multiplayer sync issues

## Communication Guidelines

- **Code/Comments**: English only
- **Developer Communication**: Portuguese (pt-BR)
- **Naming**: camelCase for all JavaScript/TypeScript identifiers
- **Comments**: Focus on "what" and "why", never "who" or "when"
