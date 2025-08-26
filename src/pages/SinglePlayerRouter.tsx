import { Suspense, lazy } from "react";
import { useAppNavigation } from "../shared/contexts";

// Lazy load views
const PuzzleSelectionPage = lazy(() =>
  import("../views").then((module) => ({ default: module.PuzzleSelectionPage }))
);
const GamePage = lazy(() =>
  import("../views").then((module) => ({ default: module.GamePage }))
);

export function SinglePlayerRouter() {
  const { currentView, selectedPuzzle } = useAppNavigation();

  if (currentView === "game" && selectedPuzzle) {
    return (
      <Suspense fallback={<div>Loading game...</div>}>
        <GamePage
          puzzleType={selectedPuzzle.type}
          puzzleId={selectedPuzzle.id}
        />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<div>Loading puzzles...</div>}>
      <PuzzleSelectionPage />
    </Suspense>
  );
}
