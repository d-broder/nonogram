import { RoomForm } from "../../../../shared/components";
import { useRoomForm } from "../../../../shared/hooks";
import styles from "./CreateRoomModal.module.css";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoomCreated: (roomId: string, playerId: string) => void;
}

export function CreateRoomModal({
  isOpen,
  onClose,
  onRoomCreated,
}: CreateRoomModalProps) {
  const [formData, formActions] = useRoomForm({
    onRoomCreated: (roomId, playerId) => {
      onRoomCreated(roomId, playerId);
      onClose();
    },
  });

  const handleClose = () => {
    if (!formData.isLoading) {
      formActions.clearForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Create New Room</h2>
          <button
            type="button"
            onClick={handleClose}
            className={styles.closeButton}
            disabled={formData.isLoading}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className={styles.content}>
          <RoomForm
            playerName={formData.playerName}
            selectedColor={formData.selectedColor}
            isLoading={formData.isLoading}
            error={formData.error}
            onPlayerNameChange={formActions.setPlayerName}
            onColorChange={formActions.setSelectedColor}
            onSubmit={formActions.createRoom}
            onCancel={handleClose}
            submitLabel="Create Room"
            showCancel={true}
            layout="modal"
          />
        </div>
      </div>
    </div>
  );
}
