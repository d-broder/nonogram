import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFirebaseRoom } from "../../features/room";
import { PageLayout } from "../../features/layout";
import styles from "./WaitingRoomPage.module.css";

export function WaitingRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { room, loading, error } = useFirebaseRoom(roomId || null);

  // Get players from room data
  const players = room ? Object.values(room.players) : [];

  useEffect(() => {
    if (!roomId) {
      navigate("/");
      return;
    }

    // Check if player info exists
    const playerInfo = sessionStorage.getItem("playerInfo");
    if (!playerInfo) {
      navigate("/");
      return;
    }

    // MultiplayerRoomHandler will handle navigation when room status changes
    // No manual navigation needed here
  }, [roomId, room, navigate]);

  // Sync sessionStorage with Firebase room data when player becomes host
  useEffect(() => {
    const playerInfoString = sessionStorage.getItem("playerInfo");
    if (!playerInfoString || !room?.players) return;

    const currentPlayerInfo = JSON.parse(playerInfoString);
    if (!currentPlayerInfo.id) return;

    const updatedPlayerInfo = room.players[currentPlayerInfo.id];
    if (!updatedPlayerInfo) return;

    // Check if this player became the host
    if (
      updatedPlayerInfo &&
      updatedPlayerInfo.isCreator !== currentPlayerInfo.isCreator
    ) {
      sessionStorage.setItem("playerInfo", JSON.stringify(updatedPlayerInfo));

      // If player became host, immediately redirect to force re-evaluation
      if (updatedPlayerInfo.isCreator && !currentPlayerInfo.isCreator) {
        console.log("Player became host, redirecting to puzzle selection");
        // Use window.location to force a complete re-evaluation
        window.location.href = `/${roomId}`;
      }
    }
  }, [room, roomId]);

  if (loading) {
    return (
      <PageLayout isMultiplayer roomId={roomId} players={players}>
        <div className={styles.loading}>Loading room...</div>
      </PageLayout>
    );
  }

  if (error || !room) {
    return (
      <PageLayout isMultiplayer roomId={roomId} players={players}>
        <div className={styles.error}>
          <h2>Room not found</h2>
          <p>The room doesn't exist or has been removed.</p>
        </div>
      </PageLayout>
    );
  }

  if (!roomId) return null;

  return (
    <PageLayout isMultiplayer roomId={roomId} players={players}>
      <div className={styles.statusContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.statusText}>
          Waiting for creator to select a puzzle...
        </p>
      </div>
    </PageLayout>
  );
}
