
import React from "react";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

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
  // Show debug info more strategically
  const shouldShowDebug = !videoLoaded || isLoading || loadAttempts > 0;
  
  if (!shouldShowDebug) return null;

  const getStatusIcon = () => {
    if (isLoading) return <Loader2 className="h-3 w-3 animate-spin" />;
    if (videoLoaded) return <CheckCircle className="h-3 w-3 text-green-400" />;
    return <AlertCircle className="h-3 w-3 text-yellow-400" />;
  };

  const getStatusColor = () => {
    if (videoLoaded) return 'bg-green-900 bg-opacity-75';
    if (isLoading) return 'bg-blue-900 bg-opacity-75';
    return 'bg-black bg-opacity-75';
  };

  return (
    <div className={`absolute top-2 left-2 right-2 z-50 text-xs text-white ${getStatusColor()} p-2 rounded-md border border-white border-opacity-20`}>
      <div className="flex items-center gap-2 mb-1">
        {getStatusIcon()}
        <span className="font-medium">
          {isLoading ? 'Lädt...' : videoLoaded ? 'Video bereit' : 'Warten auf Video'}
        </span>
      </div>
      
      <div className="space-y-1 text-xs opacity-90">
        <div className="flex justify-between">
          <span>Gerät:</span>
          <span>{isMobile ? 'Mobile' : 'Desktop'}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Versuche:</span>
          <span>{loadAttempts + 1}</span>
        </div>
        
        <div className="flex justify-between">
          <span>URL:</span>
          <span>{cacheBustedSrc ? '✅' : '❌'}</span>
        </div>
        
        {debugInfo && (
          <div className="mt-1 pt-1 border-t border-white border-opacity-20">
            <div className="text-xs opacity-75 break-words">{debugInfo}</div>
          </div>
        )}
        
        {cacheBustedSrc && (
          <details className="mt-1 text-xs opacity-60">
            <summary className="cursor-pointer">URL-Details</summary>
            <div className="mt-1 break-all text-xs">{cacheBustedSrc}</div>
          </details>
        )}
      </div>
    </div>
  );
};

export default VideoDebugInfo;
