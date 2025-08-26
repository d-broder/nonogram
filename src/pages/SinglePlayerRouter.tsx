import { useAppNavigation } from "../shared/contexts";
import { PuzzleSelectionPage, GamePage } from "../views";

export function SinglePlayerRouter() {
  const { currentView, selectedPuzzle } = useAppNavigation();

  if (currentView === "game" && selectedPuzzle) {
    return (
      <GamePage puzzleType={selectedPuzzle.type} puzzleId={selectedPuzzle.id} />
    );
  }

  return <PuzzleSelectionPage />;
}
