# Estrutura do Projeto

```
src
│   index.css
│   main.tsx
│
├───app
│       App.css
│       App.tsx
│       index.ts
│
├───assets
│       icon-o.png
│       icon-square.png
│       icon-x.png
│       react.svg
│
├───features
│   │   index.ts
│   │
│   ├───game
│   │   │   index.ts
│   │   │
│   │   ├───components
│   │   │   ├───ClueToggleButton
│   │   │   │       index.ts
│   │   │   │
│   │   │   ├───GameBoard
│   │   │   │   │   GameBoard.module.css
│   │   │   │   │   GameBoard.tsx
│   │   │   │   │   index.ts
│   │   │   │   │
│   │   │   │   ├───components
│   │   │   │   │       BoardControls.tsx
│   │   │   │   │       CellRenderer.tsx
│   │   │   │   │       ClueRenderer.tsx
│   │   │   │   │       GridContainer.tsx
│   │   │   │   │       index.ts
│   │   │   │   │
│   │   │   │   ├───hooks
│   │   │   │   │       index.ts
│   │   │   │   │       useGameBoardInteraction.ts
│   │   │   │   │       useGameBoardState.ts
│   │   │   │   │       useGameBoardZoom.ts
│   │   │   │   │
│   │   │   │   └───utils
│   │   │   │           boardValidation.ts
│   │   │   │           cellCalculations.ts
│   │   │   │           index.ts
│   │   │   │
│   │   │   ├───GameControlButton
│   │   │   │       GameControlButton.tsx
│   │   │   │
│   │   │   ├───GameControls
│   │   │   │       GameControls.module.css
│   │   │   │       GameControls.tsx
│   │   │   │       index.ts
│   │   │   │
│   │   │   └───GameControlsPanel
│   │   │           GameControlsPanel.module.css
│   │   │           GameControlsPanel.tsx
│   │   │           index.ts
│   │   │
│   │   └───hooks
│   │           useGameState.ts
│   │           useGameStateMigration.ts
│   │           usePuzzleLoader.ts
│   │           useZoom.ts
│   │
│   ├───layout
│   │   │   index.ts
│   │   │
│   │   └───components
│   │       └───PageLayout
│   │           │   index.ts
│   │           │   PageLayout.module.css
│   │           │   PageLayout.tsx
│   │           │
│   │           ├───components
│   │           │   │   DesktopSidebar.module.css
│   │           │   │   DesktopSidebar.tsx
│   │           │   │   index.ts
│   │           │   │   MobileExpandedContent.module.css
│   │           │   │   MobileExpandedContent.tsx
│   │           │   │
│   │           │   ├───MobileBottomBar
│   │           │   │       index.ts
│   │           │   │       MobileBottomBar.module.css
│   │           │   │       MobileBottomBar.tsx
│   │           │   │
│   │           │   ├───MobileClearGridForm
│   │           │   │       index.ts
│   │           │   │       MobileClearGridForm.module.css
│   │           │   │       MobileClearGridForm.tsx
│   │           │   │
│   │           │   ├───MobileCreateRoomForm
│   │           │   │       index.ts
│   │           │   │       MobileCreateRoomForm.module.css
│   │           │   │       MobileCreateRoomForm.tsx
│   │           │   │
│   │           │   ├───MobileTopBar
│   │           │   │       index.ts
│   │           │   │       MobileTopBar.module.css
│   │           │   │       MobileTopBar.tsx
│   │           │   │
│   │           │   ├───MobileTopBarExpanded
│   │           │   │       index.ts
│   │           │   │       MobileTopBarExpanded.module.css
│   │           │   │       MobileTopBarExpanded.tsx
│   │           │   │
│   │           │   └───RoomInfoSection
│   │           │           index.ts
│   │           │           RoomInfoSection.module.css
│   │           │           RoomInfoSection.tsx
│   │           │
│   │           └───hooks
│   │                   index.ts
│   │                   usePageLayoutHandlers.ts
│   │                   usePageLayoutNavigation.ts
│   │                   usePageLayoutState.ts
│   │
│   ├───room
│   │   │   index.ts
│   │   │
│   │   ├───components
│   │   │   ├───CopyTooltip
│   │   │   │       CopyTooltip.module.css
│   │   │   │       CopyTooltip.tsx
│   │   │   │       index.ts
│   │   │   │
│   │   │   ├───CreateRoomModal
│   │   │   │       CreateRoomModal.module.css
│   │   │   │       CreateRoomModal.tsx
│   │   │   │       index.ts
│   │   │   │
│   │   │   └───RoomInfoDefault
│   │   │           index.ts
│   │   │           RoomInfoDefault.module.css
│   │   │           RoomInfoDefault.tsx
│   │   │
│   │   └───hooks
│   │           useFirebaseRoom.ts
│   │           useRoomCleanup.ts
│   │
│   └───ui
│       │   index.ts
│       │
│       └───components
│           ├───ButtonGroup
│           │       ButtonGroup.module.css
│           │       ButtonGroup.tsx
│           │       index.ts
│           │
│           └───ConfirmationModal
│                   ConfirmationModal.module.css
│                   ConfirmationModal.tsx
│                   index.ts
│
├───pages
│       MultiplayerRouter.tsx
│       SinglePlayerRouter.tsx
│
├───shared
│   │   index.ts
│   │
│   ├───components
│   │   │   index.ts
│   │   │
│   │   ├───RoomForm
│   │   │       index.ts
│   │   │       RoomForm.module.css
│   │   │       RoomForm.tsx
│   │   │
│   │   └───ui
│   │       │   index.ts
│   │       │
│   │       └───Button
│   │           └───GameControlButton
│   │                   GameControlButton.module.css
│   │                   GameControlButton.tsx
│   │                   index.ts
│   │
│   ├───constants
│   │       colors.ts
│   │       index.ts
│   │
│   ├───contexts
│   │       AppNavigationContext.tsx
│   │       index.ts
│   │
│   ├───hooks
│   │       index.ts
│   │       useRoomForm.ts
│   │
│   ├───services
│   │       firebase.ts
│   │       index.ts
│   │
│   ├───types
│   │       index.ts
│   │       vite-env.d.ts
│   │
│   └───utils
│           gridUtils.ts
│           index.ts
│           puzzleUtils.ts
│
├───styles
│   ├───tokens
│   │       breakpoints.css
│   │       colors.css
│   │       index.css
│   │       layout.css
│   │       spacing.css
│   │       typography.css
│   │
│   └───utilities
│           layout.css
│           responsive.css
│
└───views
    │   index.ts
    │
    ├───GameView
    │   │   GamePage.module.css
    │   │   GamePage.tsx
    │   │   index.ts
    │   │
    │   ├───components
    │   │       GameFooter.tsx
    │   │       GameHeader.tsx
    │   │       GameModals.tsx
    │   │       index.ts
    │   │
    │   └───hooks
    │           index.ts
    │           useGamePageNavigation.ts
    │           useGamePageState.ts
    │           useGamePageSync.ts
    │
    ├───JoinRoomView
    │       index.ts
    │       JoinRoomPage.module.css
    │       JoinRoomPage.tsx
    │
    ├───PuzzleSelectionView
    │       index.ts
    │       PuzzleSelectionPage.module.css
    │       PuzzleSelectionPage.tsx
    │
    └───WaitingRoomView
            index.ts
            WaitingRoomPage.module.css
            WaitingRoomPage.tsx

```
