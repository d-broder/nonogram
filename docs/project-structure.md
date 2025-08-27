# Estrutura do Projeto Nonogram

## 📁 Estrutura Completa com Checkboxes

```
📁 Nonogram-V1.1/
├── □ eslint.config.js
├── □ index.html
├── □ package.json
├── □ README.md
├── □ TODO.md
├── □ tsconfig.app.json
├── □ tsconfig.json
├── □ tsconfig.node.json
├── □ vercel.json
├── □ vite.config.ts
├── 📁 .github/
│   └── 📁 instructions/
│       └── □ copilot-instructions.md
├── 📁 docs/
│   ├── □ clue-click-logic.md
│   ├── □ grid-sync-refactor.md
│   └── □ unified-button-system.md
├── 📁 public/
│   ├── □ logo.png
│   ├── □ vite.svg
│   └── 📁 puzzles/
│       ├── 📁 classic/
│       │   ├── □ 1.json
│       │   ├── □ 2.json
│       │   └── □ 3.json
│       └── 📁 super/
│           ├── □ 1.json
│           ├── □ 2.json
│           └── □ 3.json
├── 📁 src/
│   ├── □ index.css
│   ├── □ main.tsx
│   ├── 📁 app/
│   │   ├── □ App.css
│   │   ├── □ App.tsx
│   │   └── □ index.ts
│   ├── 📁 assets/
│   │   ├── □ icon-o.png
│   │   ├── □ icon-square.png
│   │   ├── □ icon-x.png
│   │   └── □ react.svg
│   ├── 📁 features/
│   │   ├── □ index.ts
│   │   ├── 📁 game/
│   │   │   ├── □ index.ts
│   │   │   ├── 📁 components/
│   │   │   │   ├── 📁 ClueToggleButton/
│   │   │   │   │   ├── □ index.ts
│   │   │   │   │   ├── □ ClueToggleButton.module.css
│   │   │   │   │   └── □ ClueToggleButton.tsx
│   │   │   │   ├── 📁 GameBoard/
│   │   │   │   │   ├── □ index.ts
│   │   │   │   │   ├── □ GameBoard.module.css
│   │   │   │   │   ├── □ GameBoard.tsx
│   │   │   │   │   ├── □ GameBoardCell.module.css
│   │   │   │   │   ├── □ GameBoardCell.tsx
│   │   │   │   │   ├── □ GameBoardClue.module.css
│   │   │   │   │   ├── □ GameBoardClue.tsx
│   │   │   │   │   ├── □ GameBoardGrid.module.css
│   │   │   │   │   └── □ GameBoardGrid.tsx
│   │   │   │   ├── 📁 GameControlButton/
│   │   │   │   │   ├── □ index.ts
│   │   │   │   │   ├── □ GameControlButton.module.css
│   │   │   │   │   └── □ GameControlButton.tsx
│   │   │   │   ├── 📁 GameControls/
│   │   │   │   │   ├── □ index.ts
│   │   │   │   │   ├── □ GameControls.module.css
│   │   │   │   │   └── □ GameControls.tsx
│   │   │   │   └── 📁 GameControlsPanel/
│   │   │   │       ├── □ index.ts
│   │   │   │       ├── □ GameControlsPanel.module.css
│   │   │   │       └── □ GameControlsPanel.tsx
│   │   │   └── 📁 hooks/
│   │   │       ├── □ useGameState.ts
│   │   │       ├── □ useGameStateMigration.ts
│   │   │       ├── □ usePuzzleLoader.ts
│   │   │       └── □ useZoom.ts
│   │   ├── 📁 layout/
│   │   │   ├── □ index.ts
│   │   │   └── 📁 components/
│   │   │       └── 📁 PageLayout/
│   │   │           ├── □ index.ts
│   │   │           ├── □ PageLayout.module.css
│   │   │           └── □ PageLayout.tsx
│   │   ├── 📁 room/
│   │   │   ├── □ index.ts
│   │   │   ├── 📁 components/
│   │   │   │   ├── 📁 CopyTooltip/
│   │   │   │   │   ├── □ index.ts
│   │   │   │   │   ├── □ CopyTooltip.module.css
│   │   │   │   │   └── □ CopyTooltip.tsx
│   │   │   │   ├── 📁 CreateRoomModal/
│   │   │   │   │   ├── □ index.ts
│   │   │   │   │   ├── □ CreateRoomModal.module.css
│   │   │   │   │   └── □ CreateRoomModal.tsx
│   │   │   │   └── 📁 RoomInfoDefault/
│   │   │   │       ├── □ index.ts
│   │   │   │       ├── □ RoomInfoDefault.module.css
│   │   │   │       └── □ RoomInfoDefault.tsx
│   │   │   └── 📁 hooks/
│   │   │       ├── □ useFirebaseRoom.ts
│   │   │       └── □ useRoomCleanup.ts
│   │   └── 📁 ui/
│   │       ├── □ index.ts
│   │       └── 📁 components/
│   │           ├── 📁 ButtonGroup/
│   │           │   ├── □ index.ts
│   │           │   ├── □ ButtonGroup.module.css
│   │           │   └── □ ButtonGroup.tsx
│   │           └── 📁 ConfirmationModal/
│   │               ├── □ index.ts
│   │               ├── □ ConfirmationModal.module.css
│   │               └── □ ConfirmationModal.tsx
│   ├── 📁 pages/
│   │   ├── □ MultiplayerRouter.tsx
│   │   └── □ SinglePlayerRouter.tsx
│   ├── 📁 shared/
│   │   ├── □ index.ts
│   │   ├── 📁 components/
│   │   │   ├── □ index.ts
│   │   │   ├── 📁 RoomForm/
│   │   │   │   ├── □ index.ts
│   │   │   │   ├── □ RoomForm.module.css
│   │   │   │   └── □ RoomForm.tsx
│   │   │   └── 📁 ui/
│   │   │       ├── □ index.ts
│   │   │       └── 📁 Button/
│   │   │           ├── □ index.ts
│   │   │           ├── □ Button.module.css
│   │   │           └── □ Button.tsx
│   │   ├── 📁 constants/
│   │   │   ├── □ colors.ts
│   │   │   └── □ index.ts
│   │   ├── 📁 contexts/
│   │   │   ├── □ AppNavigationContext.tsx
│   │   │   └── □ index.ts
│   │   ├── 📁 hooks/
│   │   │   ├── □ index.ts
│   │   │   └── □ useRoomForm.ts
│   │   ├── 📁 services/
│   │   │   ├── □ firebase.ts
│   │   │   └── □ index.ts
│   │   ├── 📁 types/
│   │   │   ├── □ index.ts
│   │   │   └── □ vite-env.d.ts
│   │   └── 📁 utils/
│   │       ├── □ gridUtils.ts
│   │       ├── □ index.ts
│   │       └── □ puzzleUtils.ts
│   ├── 📁 styles/
│   │   ├── 📁 tokens/
│   │   │   ├── □ breakpoints.css
│   │   │   ├── □ colors.css
│   │   │   ├── □ index.css
│   │   │   ├── □ layout.css
│   │   │   └── □ typography.css
│   │   └── 📁 utilities/
│   │       ├── □ layout.css
│   │       └── □ responsive.css
│   └── 📁 views/
│       ├── □ index.ts
│       ├── 📁 GameView/
│       │   ├── □ index.ts
│       │   ├── □ GamePage.module.css
│       │   ├── □ GamePage.tsx
│       │   ├── 📁 components/
│       │   │   ├── □ index.ts
│       │   │   ├── □ GameFooter.tsx
│       │   │   ├── □ GameHeader.tsx
│       │   │   └── □ GameModals.tsx
│       │   └── 📁 hooks/
│       │       ├── □ index.ts
│       │       ├── □ useGamePageNavigation.ts
│       │       ├── □ useGamePageState.ts
│       │       └── □ useGamePageSync.ts
│       ├── 📁 JoinRoomView/
│       │   ├── □ index.ts
│       │   ├── □ JoinRoomPage.module.css
│       │   └── □ JoinRoomPage.tsx
│       ├── 📁 PuzzleSelectionView/
│       │   ├── □ index.ts
│       │   ├── □ PuzzleSelectionPage.module.css
│       │   └── □ PuzzleSelectionPage.tsx
│       └── 📁 WaitingRoomView/
│           ├── □ index.ts
│           ├── □ WaitingRoomPage.module.css
│           └── □ WaitingRoomPage.tsx
```

**Total de arquivos:** 132  
**Total de diretórios:** 35  
**Arquivos CSS:** 25
