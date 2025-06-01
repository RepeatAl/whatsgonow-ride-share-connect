
import React from "react";
import VideoErrorDisplay from "./video/VideoErrorDisplay";
import VideoLoadingState from "./video/VideoLoadingState";
import VideoOverlay from "./video/VideoOverlay";
import VideoControls from "./video/VideoControls";
import VideoDebugInfo from "./video/VideoDebugInfo";
import VideoMobileHint from "./video/VideoMobileHint";
import { useMobileVideoDetection } from "@/hooks/useMobileVideoDetection";
import { useVideoState } from "@/hooks/useVideoState";
import { useVideoUrl } from "@/hooks/useVideoUrl";
import { useVideoHandlers } from "@/hooks/useVideoHandlers";

interface VideoPlayerProps {
  src?: string;
  placeholder?: React.ReactNode;
}

const VideoPlayer = ({ src, placeholder }: VideoPlayerProps) => {
  const { isMobile } = useMobileVideoDetection();
  const {
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
  } = useVideoState();

  useVideoUrl({
    src,
    isMobile,
    setCacheBustedSrc,
    setHasError,
    setIsLoading,
    setErrorDetails,
    setDebugInfo,
    setVideoLoaded,
    setLoadAttempts
  });

  const {
    handleRefresh,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    testDirectAccess,
    handleCanPlay,
    handleLoadedData,
    handleError,
    handleLoadStart,
    handleLoadedMetadata
  } = useVideoHandlers({
    videoRef,
    hasError,
    videoLoaded,
    isPlaying,
    isMuted,
    isMobile,
    loadAttempts,
    src,
    cacheBustedSrc,
    setIsPlaying,
    setIsMuted,
    setIsLoading,
    setHasError,
    setVideoLoaded,
    setErrorDetails,
    setDebugInfo,
    setCacheBustedSrc,
    setLoadAttempts
  });

  // Log current state for debugging
  console.log('🎯 VideoPlayer render state:', {
    src,
    hasError,
    isLoading,
    videoLoaded,
    cacheBustedSrc: !!cacheBustedSrc,
    videoRef: !!videoRef.current
  });

  // Fallback for missing or error URLs
  if (!src || hasError) {
    return (
      <VideoErrorDisplay 
        error={errorDetails}
        src={src}
        onRefresh={handleRefresh}
        onTestDirectAccess={testDirectAccess}
      />
    );
  }

  return (
    <div 
      className="relative bg-black rounded-lg overflow-hidden group"
      onMouseEnter={() => !isMobile && setShowControls(true)}
      onMouseLeave={() => !isMobile && setShowControls(false)}
      onTouchStart={() => isMobile && setShowControls(true)}
    >
      {/* Debug Info - Show only when needed */}
      <VideoDebugInfo
        isMobile={isMobile}
        isLoading={isLoading}
        videoLoaded={videoLoaded}
        debugInfo={debugInfo}
        cacheBustedSrc={cacheBustedSrc}
        loadAttempts={loadAttempts}
      />
      
      {/* Main Video Element - Always render when we have a URL */}
      {cacheBustedSrc && (
        <video
          key={cacheBustedSrc} // Force reload when URL changes
          ref={videoRef}
          src={cacheBustedSrc}
          className="w-full aspect-video cursor-pointer"
          onClick={togglePlay}
          onPlay={() => {
            console.log('📺 Video onPlay event triggered');
            setIsPlaying(true);
          }}
          onPause={() => {
            console.log('📺 Video onPause event triggered');
            setIsPlaying(false);
          }}
          onCanPlay={handleCanPlay}
          onCanPlayThrough={handleCanPlay}
          onLoadedData={handleLoadedData}
          onError={handleError}
          onLoadStart={handleLoadStart}
          onLoadedMetadata={handleLoadedMetadata}
          preload={isMobile ? "metadata" : "auto"}
          playsInline
          muted={isMuted}
          crossOrigin="anonymous"
          controls={false}
          poster=""
          webkit-playsinline="true"
        />
      )}
      
      {/* Loading Indicator - Only show when actually loading */}
      {isLoading && <VideoLoadingState isLoading={isLoading} />}
      
      {/* Video Controls Overlay - Show when video is ready */}
      {!isLoading && videoLoaded && cacheBustedSrc && (
        <VideoOverlay 
          isPlaying={isPlaying}
          showControls={showControls}
          onTogglePlay={togglePlay}
        />
      )}
      
      {/* Bottom Controls - Show when video is ready */}
      {!isLoading && videoLoaded && cacheBustedSrc && (
        <VideoControls
          isPlaying={isPlaying}
          isMuted={isMuted}
          showControls={showControls}
          onTogglePlay={togglePlay}
          onToggleMute={toggleMute}
          onToggleFullscreen={toggleFullscreen}
          onRefresh={handleRefresh}
        />
      )}
      
      {/* Mobile hint - Show when video is ready but not playing */}
      {!isLoading && videoLoaded && !isPlaying && isMobile && (
        <VideoMobileHint
          isLoading={isLoading}
          videoLoaded={videoLoaded}
          isPlaying={isPlaying}
          isMobile={isMobile}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
