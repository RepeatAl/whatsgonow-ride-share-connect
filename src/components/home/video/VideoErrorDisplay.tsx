
import React from "react";
import { Play, RefreshCw, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoErrorDisplayProps {
  error?: string;
  src?: string;
  onRefresh: () => void;
  onTestDirectAccess: () => void;
}

const VideoErrorDisplay = ({ error, src, onRefresh, onTestDirectAccess }: VideoErrorDisplayProps) => {
  const isSupabaseUrl = src?.includes('supabase.co');
  const hasVideoExtension = src ? ['.mp4', '.webm', '.ogg'].some(ext => src.includes(ext)) : false;

  return (
    <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border border-gray-300">
      <div className="text-center text-gray-600 p-6 max-w-md">
        <div className="flex items-center justify-center mb-4">
          <Play className="h-12 w-12 text-gray-400" />
        </div>
        
        <p className="text-base font-medium mb-2">
          Video wird bald verfügbar sein
        </p>
        
        <p className="text-sm opacity-75 mb-4">
          Hier wird das Erklärvideo zu Whatsgonow eingebettet
        </p>
        
        {error && (
          <details className="text-xs opacity-50 bg-gray-200 p-2 rounded cursor-pointer mb-4">
            <summary className="font-mono mb-1">Technische Details</summary>
            <p className="text-left">{error}</p>
            {src && (
              <div className="mt-2">
                <p>URL-Status:</p>
                <p>• Supabase: {isSupabaseUrl ? '✅' : '❌'}</p>
                <p>• Video-Format: {hasVideoExtension ? '✅' : '❌'}</p>
                <p className="break-all">• URL: {src}</p>
              </div>
            )}
          </details>
        )}
        
        <div className="flex gap-2 justify-center flex-wrap">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onRefresh}
            className="text-gray-600 border-gray-400 hover:bg-gray-100"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Neu laden
          </Button>
          
          {src && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onTestDirectAccess}
              className="text-gray-600 border-gray-400 hover:bg-gray-100"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              URL testen
            </Button>
          )}
        </div>
        
        <p className="text-xs opacity-50 mt-4">
          Demo-Modus aktiv
        </p>
      </div>
    </div>
  );
};

export default VideoErrorDisplay;
