
import React from "react";

interface VideoMobileHintProps {
  isLoading: boolean;
  videoLoaded: boolean;
  isPlaying: boolean;
  isMobile: boolean;
}

const VideoMobileHint = ({ isLoading, videoLoaded, isPlaying, isMobile }: VideoMobileHintProps) => {
  if (isLoading || !videoLoaded || isPlaying || !isMobile) return null;

  return (
    <div className="absolute bottom-16 left-4 right-4 text-center">
      <p className="text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded">
        Tippen zum Abspielen
      </p>
    </div>
  );
};

export default VideoMobileHint;
