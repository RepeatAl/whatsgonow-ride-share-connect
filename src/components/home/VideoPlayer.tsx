
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
      {/* Debug Info for Mobile */}
      <VideoDebugInfo
        isMobile={isMobile}
        isLoading={isLoading}
        videoLoaded={videoLoaded}
        debugInfo={debugInfo}
        cacheBustedSrc={cacheBustedSrc}
        loadAttempts={loadAttempts}
      />
      
      {/* Main Video Element */}
      <video
        ref={videoRef}
        src={cacheBustedSrc}
        className="w-full aspect-video cursor-pointer"
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
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
      
      {/* Loading Indicator */}
      <VideoLoadingState isLoading={isLoading} />
      
      {/* Video Controls Overlay */}
      {!isLoading && videoLoaded && (
        <VideoOverlay 
          isPlaying={isPlaying}
          showControls={showControls}
          onTogglePlay={togglePlay}
        />
      )}
      
      {/* Bottom Controls */}
      {!isLoading && videoLoaded && (
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
      <VideoMobileHint
        isLoading={isLoading}
        videoLoaded={videoLoaded}
        isPlaying={isPlaying}
        isMobile={isMobile}
      />
    </div>
  );
};

export default VideoPlayer;
