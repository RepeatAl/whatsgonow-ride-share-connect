
import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
  src?: string;
  placeholder?: React.ReactNode;
}

const VideoPlayer = ({ src, placeholder }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // URL-Validierung und Logging
  useEffect(() => {
    console.log('🎬 VideoPlayer received src:', src);
    
    if (!src) {
      console.log('❌ No src provided to VideoPlayer');
      setHasError(true);
      setIsLoading(false);
      return;
    }

    // URL-Format validieren
    const isValidUrl = src.startsWith('http') && (src.includes('.mp4') || src.includes('.webm') || src.includes('.ogg'));
    console.log('🔍 URL validation:', { src, isValidUrl });
    
    if (!isValidUrl) {
      console.warn('⚠️ Invalid video URL format:', src);
      setHasError(true);
      setIsLoading(false);
      return;
    }

    setHasError(false);
    setIsLoading(true);
  }, [src]);

  const togglePlay = () => {
    if (videoRef.current && !hasError) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(error => {
          console.error('❌ Video play failed:', error);
          setHasError(true);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current && !hasError) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current && !hasError) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen().catch(error => {
          console.error('❌ Fullscreen failed:', error);
        });
      }
    }
  };

  const handleVideoClick = () => {
    togglePlay();
  };

  const handleCanPlay = () => {
    console.log('✅ Video can play:', src);
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = (error: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('❌ Video error:', error);
    console.error('❌ Video error details:', {
      src,
      error: videoRef.current?.error,
      networkState: videoRef.current?.networkState,
      readyState: videoRef.current?.readyState
    });
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoadStart = () => {
    console.log('🔄 Video load start:', src);
    setIsLoading(true);
  };

  // Fallback für fehlende oder fehlerhafte URLs
  if (!src || hasError) {
    return placeholder || (
      <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-brand-primary to-brand-orange rounded-lg">
        <div className="text-center text-white">
          <Play className="h-16 w-16 mx-auto mb-4" />
          <p className="text-lg font-medium">Video wird bald verfügbar sein</p>
          <p className="text-sm opacity-80 mt-2">
            Hier wird das Erklärvideo zu whatsgonow eingebettet
          </p>
          {hasError && (
            <p className="text-xs opacity-60 mt-1">
              Fehler beim Laden des Videos
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative bg-black rounded-lg overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Haupt-Video Element */}
      <video
        ref={videoRef}
        src={src}
        className="w-full aspect-video cursor-pointer"
        onClick={handleVideoClick}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onCanPlay={handleCanPlay}
        onError={handleError}
        onLoadStart={handleLoadStart}
        preload="metadata"
        playsInline
      />
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-sm">Video lädt...</p>
          </div>
        </div>
      )}
      
      {/* Video Controls Overlay */}
      {!isLoading && (
        <div 
          className={`absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center transition-opacity ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Center Play Button */}
          <Button
            size="lg"
            variant="ghost"
            onClick={togglePlay}
            className="bg-white bg-opacity-20 text-white hover:bg-opacity-30 backdrop-blur-sm"
          >
            {isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8" />
            )}
          </Button>
        </div>
      )}
      
      {/* Bottom Controls */}
      {!isLoading && (
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
                onClick={togglePlay}
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
                onClick={toggleMute}
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white hover:bg-opacity-20"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
