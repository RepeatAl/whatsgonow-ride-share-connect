
import React from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoOverlayProps {
  isPlaying: boolean;
  showControls: boolean;
  onTogglePlay: () => void;
}

const VideoOverlay = ({ isPlaying, showControls, onTogglePlay }: VideoOverlayProps) => {
  return (
    <div 
      className={`absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center transition-opacity ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <Button
        size="lg"
        variant="ghost"
        onClick={onTogglePlay}
        className="bg-white bg-opacity-20 text-white hover:bg-opacity-30 backdrop-blur-sm"
      >
        {isPlaying ? (
          <Pause className="h-8 w-8" />
        ) : (
          <Play className="h-8 w-8" />
        )}
      </Button>
    </div>
  );
};

export default VideoOverlay;
