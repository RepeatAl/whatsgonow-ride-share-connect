
import React from "react";
import { Play, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoErrorDisplayProps {
  error?: string;
  src?: string;
  onRefresh: () => void;
  onTestDirectAccess: () => void;
}

const VideoErrorDisplay = ({ error, src, onRefresh, onTestDirectAccess }: VideoErrorDisplayProps) => {
  return (
    <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-brand-primary to-brand-orange rounded-lg">
      <div className="text-center text-white p-6">
        <Play className="h-16 w-16 mx-auto mb-4" />
        <p className="text-lg font-medium mb-2">Video wird bald verfügbar sein</p>
        <p className="text-sm opacity-80 mb-4">
          Hier wird das Erklärvideo zu whatsgonow eingebettet
        </p>
        {error && (
          <>
            <p className="text-xs opacity-75 mb-3 font-mono bg-black bg-opacity-20 p-2 rounded">
              Error: {error}
            </p>
            <div className="flex gap-2 justify-center">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onRefresh}
                className="text-white border-white hover:bg-white hover:text-brand-orange"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
              {src && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={onTestDirectAccess}
                  className="text-white border-white hover:bg-white hover:text-brand-orange"
                >
                  Test URL
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoErrorDisplay;
