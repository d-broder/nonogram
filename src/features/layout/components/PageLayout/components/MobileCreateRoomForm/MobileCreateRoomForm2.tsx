import { RoomForm } from "../../../../../../shared/components";
import { useRoomForm } from "../../../../../../shared/hooks";

interface MobileCreateRoomFormProps {
  onRoomCreated: (roomId: string, playerId: string) => void;
}

export function MobileCreateRoomForm({
  onRoomCreated,
}: MobileCreateRoomFormProps) {
  const [formData, formActions] = useRoomForm({
    onRoomCreated,
  });

  return (
    <RoomForm
      playerName={formData.playerName}
      selectedColor={formData.selectedColor}
      isLoading={formData.isLoading}
      error={formData.error}
      onPlayerNameChange={formActions.setPlayerName}
      onColorChange={formActions.setSelectedColor}
      onSubmit={formActions.createRoom}
      submitLabel="Create Room"
      title="Create New Room"
      layout="inline"
    />
  );
}
