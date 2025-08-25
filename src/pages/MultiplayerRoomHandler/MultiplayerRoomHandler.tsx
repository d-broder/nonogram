import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFirebaseRoom } from "../../hooks/useFirebaseRoom";
import { PuzzleSelectionPage } from "../PuzzleSelectionPage";
import { GamePage } from "../GamePage";
import { JoinRoomPage } from "../JoinRoomPage";
import { WaitingRoomPage } from "../WaitingRoomPage";

export function MultiplayerRoomHandler() {
  const { roomId } = useParams<{ roomId: string }>();
  const { room, loading } = useFirebaseRoom(roomId || null);
  const [isPlayerInRoom, setIsPlayerInRoom] = useState(false);

  // Check if current player is already in the room
  useEffect(() => {
    const playerInfo = sessionStorage.getItem("playerInfo");
    if (playerInfo && room) {
      const player = JSON.parse(playerInfo);
      const playerExists = room.players[player.id];
      setIsPlayerInRoom(!!playerExists);
    } else {
      setIsPlayerInRoom(false);
    }
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

  // If player is not in the room, show join page
  if (!isPlayerInRoom) {
    return <JoinRoomPage />;
  }

  // Player is in room - determine view based on room status
  switch (room.status) {
    case "waiting":
      // Show puzzle selection for creator, waiting room for others
      const playerInfo = JSON.parse(
        sessionStorage.getItem("playerInfo") || "{}"
      );
      if (playerInfo.isCreator) {
        return <PuzzleSelectionPage isMultiplayerMode={true} />;
      } else {
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
