import { useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface UseGamePageNavigationProps {
  puzzleType?: "classic" | "super";
  puzzleId?: number;
  isMultiplayerMode?: boolean;
  navigateToPuzzleSelection: () => void;
  loadSpecificPuzzle: (id: number, type: "classic" | "super") => Promise<void>;
  isUsingProps: boolean;
}

interface GamePageNavigation {
  effectiveType: "classic" | "super" | undefined;
  effectiveId: string | undefined;
  roomId: string | undefined;
  isMultiplayer: boolean;
  handleBackNavigation: () => void;
}

export const useGamePageNavigation = ({
  puzzleType,
  puzzleId,
  isMultiplayerMode,
  navigateToPuzzleSelection,
  loadSpecificPuzzle,
  isUsingProps,
}: UseGamePageNavigationProps): GamePageNavigation => {
  const { type, id, roomId } = useParams<{
    type: "classic" | "super";
    id: string;
    roomId?: string;
  }>();
  const navigate = useNavigate();

  // Use props if provided, otherwise fall back to URL params
  const effectiveType = puzzleType || type;
  const effectiveId = puzzleId?.toString() || id;

  // Check if this is multiplayer mode
  const isMultiplayer =
    isMultiplayerMode || window.location.pathname.includes("/multiplayer/");

  // Load puzzle on mount or when parameters change
  useEffect(() => {
    if (effectiveType && effectiveId) {
      const numericId = parseInt(effectiveId, 10);
      if (!isNaN(numericId)) {
        loadSpecificPuzzle(numericId, effectiveType);
      }
    }
  }, [effectiveType, effectiveId, loadSpecificPuzzle]);

  // Handle back navigation
  const handleBackNavigation = useCallback(() => {
    if (isUsingProps) {
      // When using props (controlled mode), use the provided navigation
      navigateToPuzzleSelection();
    } else {
      // When using URL routing, navigate based on current mode
      if (isMultiplayer && roomId) {
        navigate(`/multiplayer/${roomId}/puzzle-selection`);
      } else {
        navigate("/");
      }
    }
  }, [
    isUsingProps,
    isMultiplayer,
    roomId,
    navigate,
    navigateToPuzzleSelection,
  ]);

  return {
    effectiveType,
    effectiveId,
    roomId,
    isMultiplayer,
    handleBackNavigation,
  };
};
