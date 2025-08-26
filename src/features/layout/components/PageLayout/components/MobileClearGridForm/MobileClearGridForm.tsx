import styles from "./MobileClearGridForm.module.css";

interface MobileClearGridFormProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function MobileClearGridForm({
  onConfirm,
  onCancel,
}: MobileClearGridFormProps) {
  return (
    <div className={styles.mobileClearForm}>
      <h3 className={styles.formTitle}>Clear Grid</h3>

      <div className={styles.clearMessage}>
        <p>Are you sure you want to clear the entire grid?</p>
        <p>This action cannot be undone.</p>
      </div>

      <div className={styles.clearActions}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.clearCancelButton}
        >
          No
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={styles.clearConfirmButton}
        >
          Yes
        </button>
      </div>
    </div>
  );
}
