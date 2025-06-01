
import { useState, useRef } from 'react';

export const useVideoState = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [cacheBustedSrc, setCacheBustedSrc] = useState<string>('');
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);

  return {
    isPlaying,
    setIsPlaying,
    isMuted,
    setIsMuted,
    showControls,
    setShowControls,
    hasError,
    setHasError,
    isLoading,
    setIsLoading,
    errorDetails,
    setErrorDetails,
    cacheBustedSrc,
    setCacheBustedSrc,
    loadAttempts,
    setLoadAttempts,
    videoLoaded,
    setVideoLoaded,
    debugInfo,
    setDebugInfo,
    videoRef
  };
};
