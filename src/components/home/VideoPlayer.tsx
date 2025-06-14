
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
import { useVideoControls } from "@/hooks/useVideoControls";

interface VideoPlayerProps {
  src?: string;
  placeholder?: React.ReactNode;
  videoId?: string;
  component?: string;
}

const VideoPlayer = ({ src, placeholder, videoId, component = 'VideoPlayer' }: VideoPlayerProps) => {
  const { isMobile } = useMobileVideoDetection();
  const {
    isPlaying,
    setIsPlaying,
    isMuted,
    setIsMuted,
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
    videoRef,
    videoId: actualVideoId
  } = useVideoState({ videoId, component });

  // Controls mit Auto-Hide
  const {
    showControls,
    handleMouseMove,
    handleMouseLeave,
    handleTouchStart
  } = useVideoControls({ isMobile });

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
    videoId: actualVideoId,
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
    videoId: actualVideoId,
    component,
    src,
    hasError,
    isLoading,
    videoLoaded,
    cacheBustedSrc: !!cacheBustedSrc,
    videoRef: !!videoRef.current,
    showControls,
    isMobile
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
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
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
      
      {/* Main Video Element - Mobile optimized */}
      {cacheBustedSrc && (
        <video
          key={`${actualVideoId}_${cacheBustedSrc}`}
          ref={videoRef}
          src={cacheBustedSrc}
          className="w-full aspect-video cursor-pointer"
          onClick={togglePlay}
          onPlay={() => {
            console.log('📺 Video onPlay event triggered:', actualVideoId);
            setIsPlaying(true);
          }}
          onPause={() => {
            console.log('📺 Video onPause event triggered:', actualVideoId);
            setIsPlaying(false);
          }}
          onCanPlay={handleCanPlay}
          onCanPlayThrough={handleCanPlay}
          onLoadedData={handleLoadedData}
          onError={handleError}
          onLoadStart={handleLoadStart}
          onLoadedMetadata={handleLoadedMetadata}
          preload={isMobile ? "none" : "metadata"}
          playsInline
          muted={isMuted}
          crossOrigin="anonymous"
          controls={false}
          poster=""
          webkit-playsinline="true"
          data-video-id={actualVideoId}
          data-component={component}
        />
      )}
      
      {/* Loading Indicator */}
      {isLoading && <VideoLoadingState isLoading={isLoading} />}
      
      {/* Video Controls Overlay */}
      {!isLoading && videoLoaded && cacheBustedSrc && (
        <VideoOverlay 
          isPlaying={isPlaying}
          showControls={showControls}
          onTogglePlay={togglePlay}
        />
      )}
      
      {/* Bottom Controls */}
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
      
      {/* Mobile hint */}
      {!isLoading && videoLoaded && !isPlaying && isMobile && !showControls && (
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
