
import React from "react";

interface VideoLoadingStateProps {
  isLoading: boolean;
}

const VideoLoadingState = ({ isLoading }: VideoLoadingStateProps) => {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-sm">Video lädt...</p>
        <p className="text-xs opacity-75 mt-1">Cache wird umgangen...</p>
      </div>
    </div>
  );
};

export default VideoLoadingState;
