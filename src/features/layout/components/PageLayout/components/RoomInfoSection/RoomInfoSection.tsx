import { CopyTooltip } from "../../../../../room";
import { RoomInfoDefault } from "../../../../../room";
import { COLOR_VALUES } from "../../../../../../shared/constants";
import type { Player } from "../../../../../../shared/types";
import styles from "./RoomInfoSection.module.css";

interface RoomInfoSectionProps {
  isMultiplayer?: boolean;
  roomLink?: string;
  players?: Player[];
  showTooltip?: boolean;
  onCreateRoom: () => void;
  onCopyLink?: () => void;
  onHideTooltip?: () => void;
}

export function RoomInfoSection({
  isMultiplayer = false,
  roomLink,
  players = [],
  showTooltip = false,
  onCreateRoom,
  onCopyLink,
  onHideTooltip,
}: RoomInfoSectionProps) {
  // Sort players: creator first, then alphabetically
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.isCreator && !b.isCreator) return -1;
    if (!a.isCreator && b.isCreator) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className={styles.roomInfo}>
      {!isMultiplayer ? (
        <RoomInfoDefault onCreateRoom={onCreateRoom} />
      ) : (
        <>
          {roomLink && (
            <div className={styles.copyButtonWrapper}>
              <button
                type="button"
                onClick={onCopyLink}
                className={styles.copyButton}
              >
                Copy Link
              </button>
              {onHideTooltip && (
                <CopyTooltip
                  text="Link copied!"
                  show={showTooltip}
                  onHide={onHideTooltip}
                />
              )}
            </div>
          )}

          {/* Players list */}
          {sortedPlayers.length > 0 && (
            <div className={styles.playersContainer}>
              <h3 className={styles.playersTitle}>
                Players ({sortedPlayers.length})
              </h3>
              <div className={styles.playersList}>
                {sortedPlayers.map((player) => (
                  <div key={player.id} className={styles.playerCard}>
                    <div
                      className={styles.playerColor}
                      style={{
                        backgroundColor: COLOR_VALUES[player.color],
                      }}
                    />
                    <div className={styles.playerInfo}>
                      <span className={styles.playerName}>{player.name}</span>
                      {player.isCreator && (
                        <span className={styles.creatorBadge}>Host</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
