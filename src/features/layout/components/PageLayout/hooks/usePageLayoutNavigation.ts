import { useNavigate } from "react-router-dom";
import { useFirebaseRoom } from "../../../../room";

/**
 * Hook to handle navigation logic for PageLayout
 * Manages multiplayer room leaving and navigation
 */
export function usePageLayoutNavigation(roomId?: string) {
  const navigate = useNavigate();
  const { leaveRoom } = useFirebaseRoom(roomId || null);

  const handleHomeClick = async (onHomeClick?: () => void) => {
    // Check if we're in multiplayer mode
    if (roomId && leaveRoom) {
      const currentPlayerInfo = sessionStorage.getItem("playerInfo");
      if (currentPlayerInfo) {
        const playerInfo = JSON.parse(currentPlayerInfo);

        // Leave the room first
        await leaveRoom(playerInfo.id);

        // Clear player info from session storage
        sessionStorage.removeItem("playerInfo");
      }

      // Navigate to single player mode (root URL)
      navigate("/");
    } else if (onHomeClick) {
      // Use custom home click handler if provided (for single player internal navigation)
      onHomeClick();
    } else {
      // Default navigation to root
      navigate("/");
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return {
    handleHomeClick,
    handleBackClick,
  };
}
