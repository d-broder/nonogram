import { useAppNavigation } from "../../contexts/AppNavigationContext";
import { PuzzleSelectionPage } from "../PuzzleSelectionPage";
import { GamePage } from "../GamePage";

export function UnifiedPage() {
  const { currentView, selectedPuzzle } = useAppNavigation();

  if (currentView === "game" && selectedPuzzle) {
    return (
      <GamePage puzzleType={selectedPuzzle.type} puzzleId={selectedPuzzle.id} />
    );
  }

  return <PuzzleSelectionPage />;
}
