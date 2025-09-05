import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFirebaseRoom, useRoomCleanup } from "../features/room";
import {
  PuzzleSelectionPage,
  GamePage,
  JoinRoomPage,
  WaitingRoomPage,
} from "../views";

export function MultiplayerRouter() {
  const { roomId } = useParams<{ roomId: string }>();
  const { room, loading } = useFirebaseRoom(roomId || null);
  const [isPlayerInRoom, setIsPlayerInRoom] = useState(false);
  const [playerInfo, setPlayerInfo] = useState<{
    id: string;
    isCreator: boolean;
  } | null>(null);

  // Auto cleanup when leaving the room (with conservative approach)
  useRoomCleanup(roomId || null);

  // Check if current player is already in the room and update player info
  useEffect(() => {
    const playerInfoString = sessionStorage.getItem("playerInfo");
    if (playerInfoString && room) {
      const player = JSON.parse(playerInfoString);
      const playerExists = room.players[player.id];
      setIsPlayerInRoom(!!playerExists);

      // Update local player info state to trigger re-renders
      if (playerExists) {
        setPlayerInfo(room.players[player.id]);
      }
    } else if (!playerInfoString) {
      // Only set to false if there's no player info at all
      setIsPlayerInRoom(false);
      setPlayerInfo(null);
    }
    // If playerInfo exists but room is still loading, don't change the state
  }, [room]);

  // Loading state
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        Loading room...
      </div>
    );
  }

  // Room not found
  if (!room) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          gap: "16px",
        }}
      >
        <h2>Room Not Found</h2>
        <p>The room you're looking for doesn't exist or has been deleted.</p>
        <button
          onClick={() => (window.location.href = "/")}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Go to Home
        </button>
      </div>
    );
  }

  // Check if player info exists and if player is in room
  const playerInfoString = sessionStorage.getItem("playerInfo");
  if (!isPlayerInRoom && !(loading && playerInfoString)) {
    return <JoinRoomPage />;
  }

  // Use the state playerInfo for routing decisions (more reliable than sessionStorage)
  const currentPlayerInfo =
    playerInfo || (playerInfoString ? JSON.parse(playerInfoString) : {});

  // Player is in room - determine view based on room status
  switch (room.status) {
    case "waiting":
      // Show puzzle selection for creator, waiting room for others
      if (currentPlayerInfo.isCreator) {
        console.log("Showing PuzzleSelectionPage for creator");
        return <PuzzleSelectionPage isMultiplayerMode={true} />;
      } else {
        console.log("Showing WaitingRoomPage for non-creator");
        return <WaitingRoomPage />;
      }

    case "playing":
      // Show game page with room's selected puzzle
      if (room.puzzleType && room.puzzleId) {
        return (
          <GamePage
            puzzleType={room.puzzleType}
            puzzleId={room.puzzleId}
            isMultiplayerMode={true}
          />
        );
      } else {
        // Fallback if puzzle data is missing
        return <PuzzleSelectionPage isMultiplayerMode={true} />;
      }

    case "completed":
      // Game completed - could show results or allow new game
      if (room.puzzleType && room.puzzleId) {
        return (
          <GamePage
            puzzleType={room.puzzleType}
            puzzleId={room.puzzleId}
            isMultiplayerMode={true}
          />
        );
      } else {
        return <PuzzleSelectionPage isMultiplayerMode={true} />;
      }

    default:
      return <PuzzleSelectionPage isMultiplayerMode={true} />;
  }
}
