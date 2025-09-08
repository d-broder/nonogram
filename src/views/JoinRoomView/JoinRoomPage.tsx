import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RoomForm, useRoomForm, useFirebaseRoom } from "../../features/room";
import { PageLayout } from "../../features/layout";
import styles from "./JoinRoomPage.module.css";

export function JoinRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [showTooltip, setShowTooltip] = useState(false);
  const [roomLink, setRoomLink] = useState("");
  const navigate = useNavigate();

  const { room, loading, error: roomError } = useFirebaseRoom(roomId || null);

  // Get used colors from room data
  const usedColors = room
    ? Object.values(room.players).map((player) => player.color)
    : [];

  const [formData, formActions] = useRoomForm({
    roomId,
    usedColors,
    autoSelectAvailableColor: true,
    onRoomJoined: () => {
      // Room joined successfully, PageLayout will handle navigation
    },
  });

  // Set room link
  useEffect(() => {
    if (roomId) {
      const fullRoomLink = `${window.location.origin}/${roomId}`;
      setRoomLink(fullRoomLink);
    }
  }, [roomId]);

  useEffect(() => {
    if (!roomId) {
      navigate("/");
      return;
    }
  }, [roomId, navigate]);

  if (loading) {
    return (
      <PageLayout>
        <div className={styles.loading}>Loading room...</div>
      </PageLayout>
    );
  }

  if (roomError || !room) {
    return (
      <PageLayout
        isMultiplayer={true}
        roomId={roomId}
        showTooltip={showTooltip}
        onCopyLink={() => {
          if (roomId) {
            navigator.clipboard.writeText(roomLink);
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 2000);
          }
        }}
      >
        <div className={styles.error}>
          <h2>Room not found</h2>
          <p>
            The room you're trying to join doesn't exist or has been removed.
          </p>
          <button onClick={() => navigate("/")} className={styles.backButton}>
            Back to Home
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      isMultiplayer={true}
      roomId={roomId}
      players={room ? Object.values(room.players) : undefined}
      showTooltip={showTooltip}
      onCopyLink={() => {
        if (roomId) {
          navigator.clipboard.writeText(roomLink);
          setShowTooltip(true);
          setTimeout(() => setShowTooltip(false), 2000);
        }
      }}
    >
      <header className={styles.header}>
        <h1 className={styles.title}>Join Room</h1>
        <p className={styles.subtitle}>Room ID: {roomId}</p>
        <p className={styles.info}>
          {Object.keys(room.players).length} player(s) in room
        </p>
      </header>

      <div className={styles.form}>
        <RoomForm
          playerName={formData.playerName}
          selectedColor={formData.selectedColor}
          isLoading={formData.isLoading}
          error={formData.error}
          usedColors={usedColors}
          onPlayerNameChange={formActions.setPlayerName}
          onColorChange={formActions.setSelectedColor}
          onSubmit={formActions.joinRoom}
          submitLabel="Join Room"
          layout="page"
        ></RoomForm>
      </div>
    </PageLayout>
  );
}
