/**
 * Hook to handle modal and form interactions for PageLayout
 */
export function usePageLayoutHandlers(
  isMobile: boolean,
  setShowCreateRoomModal: (show: boolean) => void,
  setShowMobileCreateRoom: (show: boolean) => void,
  setShowMobileClearGrid: (show: boolean) => void,
  setIsCollapsed: (collapsed: boolean) => void,
  onRoomCreated?: (roomId: string, playerId: string) => void,
  onClearGrid?: () => void,
  onConfirmClear?: () => void,
  onCancelClear?: () => void
) {
  // Modal handlers
  const handleOpenCreateModal = () => {
    if (isMobile) {
      // No mobile, usar topBarExpanded em vez de modal
      setShowMobileCreateRoom(true);
      setIsCollapsed(false); // Expandir a sidebar
    } else {
      setShowCreateRoomModal(true);
    }
  };

  const handleCloseCreateModal = () => {
    setShowCreateRoomModal(false);
    setShowMobileCreateRoom(false);
  };

  const handleRoomCreated = (roomId: string, playerId: string) => {
    setShowCreateRoomModal(false);
    setShowMobileCreateRoom(false);
    // No mobile, colapsar a topBar após criar sala
    if (isMobile) {
      setIsCollapsed(true);
    }
    if (onRoomCreated) {
      onRoomCreated(roomId, playerId);
    }
  };

  // Clear Grid mobile handlers
  const handleClearGrid = () => {
    if (isMobile) {
      // No mobile, usar topBarExpanded em vez de modal
      setShowMobileClearGrid(true);
      setIsCollapsed(false); // Expandir a sidebar
    } else if (onClearGrid) {
      onClearGrid();
    }
  };

  const handleMobileClearConfirm = () => {
    setShowMobileClearGrid(false);
    if (onConfirmClear) {
      onConfirmClear();
    }
  };

  const handleMobileClearCancel = () => {
    setShowMobileClearGrid(false);
    if (onCancelClear) {
      onCancelClear();
    }
  };

  return {
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleRoomCreated,
    handleClearGrid,
    handleMobileClearConfirm,
    handleMobileClearCancel,
  };
}
