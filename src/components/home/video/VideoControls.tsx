
import React from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  showControls: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onRefresh: () => void;
}

const VideoControls = ({ 
  isPlaying, 
  isMuted, 
  showControls, 
  onTogglePlay, 
  onToggleMute, 
  onToggleFullscreen,
  onRefresh 
}: VideoControlsProps) => {
  return (
    <div 
      className={`absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 transition-opacity ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={onTogglePlay}
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={onToggleMute}
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={onRefresh}
            className="text-white hover:bg-white hover:bg-opacity-20"
            title="Video neu laden"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={onToggleFullscreen}
          className="text-white hover:bg-white hover:bg-opacity-20"
        >
          <Maximize className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default VideoControls;
