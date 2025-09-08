import { useState, useEffect } from "react";

interface UseGamePageStateProps {
  isMultiplayer?: boolean;
  currentPlayerInfo?: any;
  room?: any;
}

interface GamePageState {
  // UI State
  showTooltip: boolean;
  setShowTooltip: (show: boolean) => void;

  isMigrating: boolean;
  setIsMigrating: (migrating: boolean) => void;

  showClearConfirmation: boolean;
  setShowClearConfirmation: (show: boolean) => void;

  showExitConfirmation: boolean;
  setShowExitConfirmation: (show: boolean) => void;

  isMobile: boolean;

  stickyClues: boolean;
  setStickyClues: (sticky: boolean) => void;

  showPlayerIndicators: boolean;
  setShowPlayerIndicators: (show: boolean) => void;

  // Game State
  clickedRowClues: Set<string>;
  setClickedRowClues: (clues: Set<string>) => void;

  clickedColClues: Set<string>;
  setClickedColClues: (clues: Set<string>) => void;

  // Computed properties
  isCreator: boolean;
  effectiveType: string | undefined;
  effectiveId: string | undefined;
  isUsingProps: boolean;
}

export const useGamePageState = ({
  isMultiplayer,
  currentPlayerInfo,
  room,
}: UseGamePageStateProps): GamePageState => {
  // UI States
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [stickyClues, setStickyClues] = useState(true);
  const [showPlayerIndicators, setShowPlayerIndicators] = useState(true);

  // Clue States
  const [clickedRowClues, setClickedRowClues] = useState<Set<string>>(
    new Set()
  );
  const [clickedColClues, setClickedColClues] = useState<Set<string>>(
    new Set()
  );

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Determine if current player is the creator
  const isCreator =
    !isMultiplayer ||
    (currentPlayerInfo &&
      room &&
      room.players[currentPlayerInfo.id]?.isCreator);

  return {
    // UI State
    showTooltip,
    setShowTooltip,
    isMigrating,
    setIsMigrating,
    showClearConfirmation,
    setShowClearConfirmation,
    showExitConfirmation,
    setShowExitConfirmation,
    isMobile,
    stickyClues,
    setStickyClues,
    showPlayerIndicators,
    setShowPlayerIndicators,

    // Game State
    clickedRowClues,
    setClickedRowClues,
    clickedColClues,
    setClickedColClues,

    // Computed
    isCreator,
    effectiveType: undefined, // Will be set from props
    effectiveId: undefined, // Will be set from props
    isUsingProps: false, // Will be set from props
  };
};
