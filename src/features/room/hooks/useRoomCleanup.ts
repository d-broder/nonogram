import { useEffect, useRef } from 'react';
import { useFirebaseRoom } from './useFirebaseRoom';

export function useRoomCleanup(roomId: string | null) {
  const { leaveRoom } = useFirebaseRoom(roomId);
  const cleanupExecuted = useRef(false);

  useEffect(() => {
    if (!roomId) return;

    const playerInfo = sessionStorage.getItem('playerInfo');
    if (!playerInfo) return;

    const player = JSON.parse(playerInfo);

    const cleanup = async () => {
      if (cleanupExecuted.current) return;
      cleanupExecuted.current = true;
      
      try {
        await leaveRoom(player.id);
        sessionStorage.removeItem('playerInfo');
      } catch (error) {
        console.error('Error during cleanup:', error);
      }
    };

    // Only handle beforeunload - the most reliable indicator of actual departure
    const handleBeforeUnload = () => {
      cleanup();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup listeners on unmount, but don't execute cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      cleanupExecuted.current = false;
    };
  }, [roomId, leaveRoom]);
}
