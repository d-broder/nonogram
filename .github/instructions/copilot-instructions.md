<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Nonogram React Project Instructions - v2.0

## 🏗️ **Project Architecture Overview**

React 18+ Nonogram puzzle game with **dual-mode architecture**:

- **Singleplayer**: Local state management only
- **Multiplayer**: Real-time Firebase Firestore synchronization

**Core Design Pattern**: Shared game logic with conditional synchronization based on route detection.

## 🔍 **Current Project Structure (As of August 2025)**

```
src/
├── main.tsx & App.tsx              # Entry points
├── components/ (12 components)      # All UI components (needs refactoring)
│   ├── PageLayout/                 # 🔥 CRITICAL: 799 lines - TOO LARGE
│   ├── CreateRoomModal/            # ⚠️ Duplicated form logic
│   ├── GameBoard/                  # Core puzzle interface
│   ├── GameControls/GameControlsPanel/GameControlButton/
│   ├── ButtonGroup/ClueToggleButton/PlayerIndicatorToggleButton/
│   └── ConfirmationModal/CopyTooltip/RoomInfoDefault/
├── pages/ (6 pages)                # Route handlers and views
│   ├── UnifiedPage/                # Singleplayer router
│   ├── MultiplayerRoomHandler/     # Multiplayer router
│   ├── GamePage/                   # Main game view (503 lines)
│   ├── PuzzleSelectionPage/        # Puzzle picker
│   ├── JoinRoomPage/               # Room joining (265 lines)
│   └── WaitingRoomPage/            # Pre-game lobby
├── hooks/ (6 hooks)                # Custom React hooks
│   ├── useGameState.ts             # Core game logic (267 lines)
│   ├── useFirebaseRoom.ts          # Multiplayer sync (254 lines)
│   ├── usePuzzleLoader.ts          # Puzzle loading
│   ├── useZoom.ts                  # Zoom functionality
│   ├── useRoomCleanup.ts           # Multiplayer cleanup
│   └── useGameStateMigration.ts    # State migration
├── contexts/AppNavigationContext.tsx
├── types/index.ts
├── utils/gridUtils.ts & puzzleUtils.ts
└── firebase.ts                     # Firestore configuration
```

## 🚨 **CRITICAL ISSUES REQUIRING ATTENTION**

### 1. **PageLayout.tsx - 799 Lines (URGENT REFACTORING NEEDED)**

```tsx
// PROBLEMS:
- Contains embedded MobileCreateRoomForm (lines 40-85)
- Contains embedded MobileClearGridForm (lines 147-181)
- Mixed responsibilities: layout + forms + business logic
- Duplicated color constants (COLOR_VALUES, AVAILABLE_COLORS)
- 30+ props interface

// SOLUTION: Split into 8 separate components
```

### 2. **Form Logic Duplication (3 Locations)**

```tsx
// DUPLICATED ACROSS:
- CreateRoomModal.tsx (182 lines) - Desktop modal
- MobileCreateRoomForm in PageLayout.tsx (45 lines) - Mobile inline
- JoinRoomPage.tsx (265 lines) - Similar validation logic

// SOLUTION: Create unified RoomForm base component
```

### 3. **Large Component Files**

- `GamePage.tsx`: 503 lines (consider splitting)
- `GameBoard.tsx`: 534 lines (acceptable for core component)
- `JoinRoomPage.tsx`: 265 lines (extract form logic)

## 🎯 **Key Architectural Patterns**

### **Route-Based Mode Detection**

```tsx
// CRITICAL PATTERN: Used throughout codebase
const isMultiplayer = location.pathname.includes("/multiplayer/");
const isSinglePlayer = !location.pathname.includes("/multiplayer/");

// URL Structure:
// Singleplayer: "/" -> UnifiedPage -> PuzzleSelectionPage <-> GamePage
// Multiplayer:  "/{roomId}" -> MultiplayerRoomHandler -> JoinRoom|WaitingRoom|PuzzleSelection|Game
```

### **Conditional Synchronization**

```tsx
// Core pattern in useGameState hook
const gameState = useGameState(puzzle, {
  onCellChange: isMultiplayer ? updateGridCell : undefined,
  onClueToggle: isMultiplayer ? updateClueState : undefined,
});

// External updates bypass sync callbacks
const updateCellExternally = (cellId: string, state: CellState) => {
  // Updates local state without triggering Firebase sync
};
```

### **Firebase Real-time Structure**

```ts
// Firestore Document: /rooms/{roomId}
interface Room {
  players: { [playerId]: Player };          // Player management
  grid: { [cellId]: CellState };            // "0-1": "black"
  cellAuthors: { [cellId]: playerId };      // Track who filled each cell
  clues: { [clueId]: boolean };             // "row-0-0": true
  status: 'waiting' | 'playing';            // Room state
  createdAt: Timestamp;
  puzzle: { id: string; type: string };
}

// Player stored in sessionStorage:
{ id: string, name: string, color: PlayerColor, isCreator: boolean }
```

## 🎮 **Component Architecture Patterns**

### **PageLayout Component (NEEDS REFACTORING)**

```tsx
// Current Issues:
- 799 lines with mixed responsibilities
- Embedded forms that should be separate components
- Responsive design logic scattered throughout
- Props interface too complex (30+ properties)

// Refactoring Plan:
PageLayout/
├── PageLayout.tsx           # Simplified main component
├── Sidebar/                 # Desktop sidebar
├── MobileTopBar/           # Mobile header
├── MobileBottomBar/        # Mobile controls
├── RoomInfo/               # Multiplayer room display
└── forms/                  # Extracted form components
```

### **CSS Modules Pattern**

```css
/* Naming Convention */
.componentName {
  /* Base styles */
}
.componentName.stateModifier {
  /* State variations */
}
.componentName.enabled {
  /* Example: enabled state */
}

/* Responsive Design */
@media (max-width: 768px) {
  .componentName {
    /* Mobile styles */
  }
}

/* CSS Variables for Zoom */
.gameCell {
  width: var(--cell-size, 40px);
  height: var(--cell-size, 40px);
}
```

### **Custom Hooks Strategy**

```tsx
// useGameState.ts - Core game logic (267 lines)
// Single source of truth for puzzle state
// Conditional callbacks for multiplayer sync

// useFirebaseRoom.ts - Multiplayer operations (254 lines)
// Real-time listeners, CRUD operations, error handling

// usePuzzleLoader.ts - Puzzle management
// Loads from /public/puzzles/{type}/{id}.json

// useZoom.ts - Responsive sizing
// Calculates proportional sizing configs
```

## 🚀 **Development Workflow**

### **Commands**

```bash
npm run dev     # Vite dev server
npm run build   # TypeScript check + Vite build
npm run lint    # ESLint check
```

### **Local Multiplayer Testing**

1. `npm run dev`
2. Create room in browser tab 1
3. Join room in incognito/different browser tab 2
4. Both players interact with shared grid

### **Firebase Integration**

```tsx
// Error Handling Pattern
try {
  await updateDoc(roomRef, updates);
} catch (error) {
  console.error("Firebase sync failed:", error);
  // Revert optimistic update if needed
}

// Real-time Listener Pattern
useEffect(() => {
  const unsubscribe = onSnapshot(roomRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      updateLocalState(data);
    }
  });
  return unsubscribe;
}, [roomId]);
```

## 📝 **Type System Guidelines**

### **Core Types**

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

interface Puzzle {
  id: string;
  name: string;
  difficulty: "easy" | "medium" | "hard";
  grid: CellState[][];
  rowClues: number[][];
  colClues: number[][];
}
```

### **Component Props Pattern**

```tsx
interface ComponentProps {
  // Required props first
  puzzle: Puzzle;

  // Optional with defaults
  showSolution?: boolean;

  // Multiplayer-only props
  cellAuthors?: { [cellId: string]: string };

  // Callback props (conditional based on mode)
  onCellChange?: (
    cellId: string,
    state: CellState,
    playerId?: string
  ) => Promise<void>;
}
```

## 🛠️ **Code Quality Standards**

### **File Size Guidelines**

- ⚠️ **Over 500 lines**: Consider refactoring
- 🔥 **Over 700 lines**: Urgent refactoring needed
- ✅ **Under 300 lines**: Ideal size

### **Responsibility Separation**

- **Components**: UI rendering only
- **Hooks**: State management and side effects
- **Utils**: Pure functions
- **Services**: External API calls

### **Import Organization**

```tsx
// 1. React imports
import React, { useState, useEffect } from "react";

// 2. Third-party libraries
import { onSnapshot, updateDoc } from "firebase/firestore";

// 3. Internal imports (relative paths)
import { useGameState } from "../../hooks/useGameState";
import styles from "./Component.module.css";
```

## 📁 **File Organization Best Practices**

### **1. Container-Controlled Spacing Pattern**

Use **container-controlled spacing** for consistent, maintainable layouts:

```tsx
// ❌ AVOID: Child components managing their own margins
const BadComponent = () => (
  <div className={styles.container}>
    <Header className={styles.headerWithMargin} />
    <Content className={styles.contentWithMargin} />
    <Footer className={styles.footerWithMargin} />
  </div>
);

// ✅ PREFERRED: Container controls all spacing
const GoodComponent = () => (
  <div className={styles.container}>
    <Header />
    <Content />
    <Footer />
  </div>
);

// CSS: Container manages spacing between children
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Container controls spacing */
}

.container > * + * {
  margin-top: 1rem; /* Alternative: adjacent sibling spacing */
}
```

### **2. Component File Structure Standard**

```
ComponentName/
├── index.ts                    # Barrel export
├── ComponentName.tsx           # Main component
├── ComponentName.module.css    # Styles
├── ComponentName.test.tsx      # Tests (future)
├── types.ts                    # Component-specific types
└── hooks/                      # Component-specific hooks
    ├── useComponentLogic.ts
    └── useComponentState.ts
```

### **3. CSS Architecture Guidelines**

```css
/* 1. Container-Controlled Spacing */
.componentContainer {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md); /* Use CSS custom properties */
}

/* 2. BEM-like Component Naming */
.componentName {
  /* Block */
}
.componentName__element {
  /* Element */
}
.componentName--modifier {
  /* Modifier */
}

/* 3. State-based Modifiers */
.componentName.isEnabled {
  /* State */
}
.componentName.isLoading {
  /* State */
}

/* 4. Responsive Design */
@media (max-width: 768px) {
  .componentContainer {
    gap: var(--spacing-sm);
  }
}

/* 5. Zoom-responsive Variables */
.gameCell {
  width: var(--cell-size, 40px);
  height: var(--cell-size, 40px);
}
```

### **4. Spacing System (CSS Custom Properties)**

```css
/* Design tokens for consistent spacing */
:root {
  --spacing-xs: 0.25rem; /* 4px */
  --spacing-sm: 0.5rem; /* 8px */
  --spacing-md: 1rem; /* 16px */
  --spacing-lg: 1.5rem; /* 24px */
  --spacing-xl: 2rem; /* 32px */
  --spacing-2xl: 3rem; /* 48px */
}

/* Mobile spacing adjustments */
@media (max-width: 768px) {
  :root {
    --spacing-md: 0.75rem;
    --spacing-lg: 1rem;
  }
}
```

### **5. Component Composition Patterns**

```tsx
// ✅ PREFERRED: Composition over configuration
const GameView = () => (
  <PageLayout>
    <PageLayout.Header>
      <GameControls />
    </PageLayout.Header>

    <PageLayout.Main>
      <GameBoard />
    </PageLayout.Main>

    <PageLayout.Sidebar>
      <PuzzleInfo />
      <PlayersList />
    </PageLayout.Sidebar>
  </PageLayout>
);

// ❌ AVOID: Prop drilling
const GameView = () => (
  <PageLayout
    showHeader={true}
    headerContent={<GameControls />}
    showSidebar={true}
    sidebarContent={[<PuzzleInfo />, <PlayersList />]}
    mainContent={<GameBoard />}
  />
);
```

### **6. TypeScript Organization**

```tsx
// File: ComponentName.tsx

// 1. Type imports first
import type { FC, ReactNode } from "react";
import type { Puzzle, CellState } from "../../types";

// 2. Regular imports
import React, { useState } from "react";
import styles from "./ComponentName.module.css";

// 3. Local types (if component-specific)
interface ComponentProps {
  puzzle: Puzzle;
  onCellChange?: (cellId: string, state: CellState) => void;
  children?: ReactNode;
}

// 4. Component implementation
export const ComponentName: FC<ComponentProps> = ({
  puzzle,
  onCellChange,
  children,
}) => {
  // Implementation
};

// 5. Default export (if needed)
export default ComponentName;
```

### **7. Folder Naming Conventions**

```
src/
├── components/           # PascalCase for component folders
│   ├── GameBoard/       # Component name matches folder
│   └── PlayersList/
├── hooks/               # camelCase for hook files
│   ├── useGameState.ts
│   └── useFirebaseRoom.ts
├── utils/               # camelCase for utility files
│   ├── gridUtils.ts
│   └── puzzleUtils.ts
├── types/               # camelCase for type files
│   └── index.ts
└── constants/           # camelCase for constant files
    ├── colors.ts
    └── gameConfig.ts
```

### **8. Barrel Export Strategy**

```tsx
// components/index.ts - Centralized exports
export { GameBoard } from "./GameBoard";
export { PageLayout } from "./PageLayout";
export { GameControls } from "./GameControls";

// feature/puzzle/index.ts - Feature exports
export * from "./components";
export * from "./hooks";
export * from "./types";

// Usage:
import { GameBoard, PageLayout } from "../components";
import { useGameState, usePuzzleLoader } from "../features/puzzle";
```

### **9. Error Boundary Patterns**

```tsx
// ErrorBoundary with container-controlled spacing
const GameErrorBoundary: FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary>
    <div className={styles.errorContainer}>
      {children}
    </div>
  </ErrorBoundary>
);

// CSS: Container controls error state spacing
.errorContainer {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: var(--spacing-md);
}
```

### **10. Performance Organization**

```tsx
// Lazy loading with consistent spacing
const LazyGameBoard = lazy(() => import('./GameBoard'));

const GameView = () => (
  <div className={styles.gameContainer}>
    <Suspense fallback={<GameBoardSkeleton />}>
      <LazyGameBoard />
    </Suspense>
  </div>
);

// CSS: Skeleton maintains same spacing as real component
.gameContainer {
  display: grid;
  gap: var(--spacing-md);
  grid-template-areas: "board controls";
}
```

## 🎯 **Priority Refactoring Tasks**

### **Immediate (Next Sprint)**

1. 🔥 **PageLayout.tsx**: Split into 8 components
2. ⚠️ **Form Duplication**: Create unified RoomForm component
3. 🔄 **Constants**: Centralize color definitions

### **Short Term (Next Month)**

1. **Feature-based Structure**: Reorganize by domain
2. **GamePage.tsx**: Split into smaller components
3. **Barrel Exports**: Add index.ts files

### **Long Term (Next Quarter)**

1. **Testing**: Add comprehensive test suite
2. **Performance**: Implement React.memo and useMemo
3. **Accessibility**: Full WCAG compliance

## 💬 **Communication Guidelines**

- **Code/Comments**: English only
- **Developer Communication**: Portuguese (pt-BR)
- **Naming**: camelCase for all identifiers
- **Comments**: Focus on "what" and "why", avoid "who" or "when"
- **Commit Messages**: English, conventional commits format

## 🚀 **When Assisting with Code**

1. **Always check current file sizes** before suggesting changes
2. **Consider refactoring opportunities** in large files (>500 lines)
3. **Maintain consistent patterns** with existing codebase
4. **Test multiplayer scenarios** when making changes to shared state
5. **Preserve responsive design** in mobile/desktop implementations
6. **Follow the conditional synchronization pattern** for new features

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

## 🚀 **When Assisting with Code**

1. **Always check current file sizes** before suggesting changes
2. **Consider refactoring opportunities** in large files (>500 lines)
3. **Maintain consistent patterns** with existing codebase
4. **Test multiplayer scenarios** when making changes to shared state
5. **Preserve responsive design** in mobile/desktop implementations
6. **Follow the conditional synchronization pattern** for new features
7. **Apply container-controlled spacing** when refactoring layouts
8. **Use composition over configuration** for complex components
9. **Implement proper TypeScript organization** for new files
10. **Create barrel exports** for better import management

## 🎯 **Container-Controlled Spacing Applications**

### **PageLayout Refactoring (Priority 1):**

```tsx
// When splitting PageLayout.tsx (799 lines), use container-controlled spacing:

// ✅ New PageLayout structure
const PageLayout: FC<PageLayoutProps> = ({ children }) => (
  <div className={styles.pageContainer}>
    {children}
  </div>
);

// CSS: Container controls all child spacing
.pageContainer {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main";
  gap: var(--spacing-md);
  height: 100vh;
}

@media (max-width: 768px) {
  .pageContainer {
    grid-template-areas:
      "header"
      "main"
      "footer";
    gap: var(--spacing-sm);
  }
}
```

### **Form Unification (Priority 2):**

```tsx
// When unifying CreateRoomModal, MobileCreateRoomForm, JoinRoomPage:

const RoomForm: FC<RoomFormProps> = ({ children }) => (
  <form className={styles.formContainer}>
    {children}
  </form>
);

// CSS: Form container controls field spacing
.formContainer {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.formContainer .fieldGroup {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
```

### **GameBoard Improvements:**

```tsx
// GameBoard.tsx (534 lines) spacing improvements:

const GameBoard = () => (
  <div className={styles.gameBoardContainer}>
    <div className={styles.cluesContainer}>
      <RowClues />
      <ColClues />
    </div>
    <div className={styles.gridContainer}>
      <GameGrid />
    </div>
  </div>
);

// CSS: Container manages game element spacing
.gameBoardContainer {
  display: grid;
  grid-template-areas: "clues grid";
  gap: var(--spacing-sm);
  width: 100%;
  height: 100%;
}
```

### **Component Composition Example:**

```tsx
// Apply to any new components during refactoring:

const GameControls = () => (
  <div className={styles.controlsContainer}>
    <ButtonGroup>
      <GameControlButton mode="black" />
      <GameControlButton mode="x" />
      <GameControlButton mode="o" />
    </ButtonGroup>
    <ClueToggleButton />
    <PlayerIndicatorToggleButton />
  </div>
);

// CSS: Container controls button spacing
.controlsContainer {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
}
```
