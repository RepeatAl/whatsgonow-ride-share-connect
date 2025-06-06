
import React from "react";
import { Play, RefreshCw, ExternalLink } from "lucide-react";
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
    <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
      <div className="text-center text-gray-600 p-6 max-w-md bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
        <div className="flex items-center justify-center mb-4">
          <Play className="h-10 w-10 text-gray-400" />
        </div>
        
        <h3 className="text-lg font-medium mb-2 text-gray-800">
          Video wird bald verfügbar sein
        </h3>
        
        <p className="text-sm text-gray-600 mb-4">
          Hier wird das Erklärvideo zu Whatsgonow eingebettet
        </p>
        
        <p className="text-xs text-gray-500 mb-6">
          Coming Soon – Wir arbeiten dran!
        </p>
        
        {error && (
          <details className="text-xs text-gray-400 bg-gray-50 p-2 rounded cursor-pointer mb-4 opacity-60">
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
            className="text-gray-500 border-gray-300 hover:bg-gray-50"
          >
            <RefreshCw className="h-3 w-3 mr-2" />
            Neu laden
          </Button>
          
          {src && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onTestDirectAccess}
              className="text-gray-500 border-gray-300 hover:bg-gray-50"
            >
              <ExternalLink className="h-3 w-3 mr-2" />
              URL testen
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoErrorDisplay;
