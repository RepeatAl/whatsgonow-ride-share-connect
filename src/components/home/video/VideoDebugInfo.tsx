
import React from "react";

interface VideoDebugInfoProps {
  isMobile: boolean;
  isLoading: boolean;
  videoLoaded: boolean;
  debugInfo: string;
  cacheBustedSrc: string;
  loadAttempts: number;
}

const VideoDebugInfo = ({ 
  isMobile, 
  isLoading, 
  videoLoaded, 
  debugInfo, 
  cacheBustedSrc, 
  loadAttempts 
}: VideoDebugInfoProps) => {
  // Only show debug info on mobile if there's an error or loading issue
  if (!isMobile || (videoLoaded && !isLoading)) return null;

  return (
    <div className="absolute top-2 left-2 right-2 z-50 text-xs text-white bg-black bg-opacity-75 p-2 rounded">
      <div>Status: {isLoading ? 'Loading...' : videoLoaded ? 'Ready' : 'Not Ready'}</div>
      <div>Debug: {debugInfo}</div>
      <div>URL: {cacheBustedSrc ? 'Valid' : 'No URL'}</div>
      <div>Attempts: {loadAttempts}</div>
    </div>
  );
};

export default VideoDebugInfo;
