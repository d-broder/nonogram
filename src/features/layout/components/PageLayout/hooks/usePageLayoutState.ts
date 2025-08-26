import { useState, useEffect } from "react";

/**
 * Hook to manage mobile state and modal state for PageLayout
 */
export function usePageLayoutState() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileCreateRoom, setShowMobileCreateRoom] = useState(false);
  const [showMobileClearGrid, setShowMobileClearGrid] = useState(false);

  // Check for mobile screen size and set viewport height
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true); // Default collapsed on mobile
      }
    };

    // Set CSS custom property for real viewport height (fallback for older browsers)
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    checkMobile();
    setViewportHeight();

    window.addEventListener("resize", checkMobile);
    window.addEventListener("resize", setViewportHeight);
    window.addEventListener("orientationchange", setViewportHeight);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("resize", setViewportHeight);
      window.removeEventListener("orientationchange", setViewportHeight);
    };
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    // Reset mobile forms when toggling sidebar
    setShowMobileCreateRoom(false);
    setShowMobileClearGrid(false);
  };

  return {
    isCollapsed,
    showCreateRoomModal,
    isMobile,
    showMobileCreateRoom,
    showMobileClearGrid,
    setIsCollapsed,
    setShowCreateRoomModal,
    setShowMobileCreateRoom,
    setShowMobileClearGrid,
    toggleSidebar,
  };
}
