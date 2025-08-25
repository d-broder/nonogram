import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export type AppView = "puzzle-selection" | "game";

export interface SelectedPuzzle {
  type: "classic" | "super";
  id: number;
}

interface AppNavigationContextType {
  currentView: AppView;
  selectedPuzzle: SelectedPuzzle | null;
  navigateToPuzzleSelection: () => void;
  navigateToGame: (puzzleType: "classic" | "super", puzzleId: number) => void;
}

const AppNavigationContext = createContext<
  AppNavigationContextType | undefined
>(undefined);

interface AppNavigationProviderProps {
  children: ReactNode;
}

export function AppNavigationProvider({
  children,
}: AppNavigationProviderProps) {
  const [currentView, setCurrentView] = useState<AppView>("puzzle-selection");
  const [selectedPuzzle, setSelectedPuzzle] = useState<SelectedPuzzle | null>(
    null
  );

  const navigateToPuzzleSelection = () => {
    setCurrentView("puzzle-selection");
    setSelectedPuzzle(null);
  };

  const navigateToGame = (
    puzzleType: "classic" | "super",
    puzzleId: number
  ) => {
    setSelectedPuzzle({ type: puzzleType, id: puzzleId });
    setCurrentView("game");
  };

  return (
    <AppNavigationContext.Provider
      value={{
        currentView,
        selectedPuzzle,
        navigateToPuzzleSelection,
        navigateToGame,
      }}
    >
      {children}
    </AppNavigationContext.Provider>
  );
}

export function useAppNavigation() {
  const context = useContext(AppNavigationContext);
  if (context === undefined) {
    throw new Error(
      "useAppNavigation must be used within an AppNavigationProvider"
    );
  }
  return context;
}
