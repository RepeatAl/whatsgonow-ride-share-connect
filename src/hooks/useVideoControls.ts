
import { useState, useRef, useCallback, useEffect } from 'react';

interface UseVideoControlsProps {
  isMobile: boolean;
}

export const useVideoControls = ({ isMobile }: UseVideoControlsProps) => {
  const [showControls, setShowControls] = useState(false);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  // Funktion zum Anzeigen der Controls mit Auto-Hide-Timer
  const showVideoControls = useCallback(() => {
    setShowControls(true);
    
    // Clear existing timeout
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    
    // Set new timeout to hide controls after 3 seconds
    controlsTimeout.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  }, []);

  // Funktion zum sofortigen Ausblenden der Controls
  const hideVideoControls = useCallback(() => {
    setShowControls(false);
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
      controlsTimeout.current = null;
    }
  }, []);

  // Event-Handler für Desktop (Mausbewegung)
  const handleMouseMove = useCallback(() => {
    if (!isMobile) {
      showVideoControls();
    }
  }, [isMobile, showVideoControls]);

  // Event-Handler für Desktop (Maus verlässt Bereich)
  const handleMouseLeave = useCallback(() => {
    if (!isMobile) {
      hideVideoControls();
    }
  }, [isMobile, hideVideoControls]);

  // Event-Handler für Mobile (Touch)
  const handleTouchStart = useCallback(() => {
    if (isMobile) {
      showVideoControls();
    }
  }, [isMobile, showVideoControls]);

  // Cleanup beim Unmount
  useEffect(() => {
    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, []);

  return {
    showControls,
    handleMouseMove,
    handleMouseLeave,
    handleTouchStart,
    showVideoControls,
    hideVideoControls
  };
};
