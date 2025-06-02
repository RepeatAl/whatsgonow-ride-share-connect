
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
    <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-brand-primary to-brand-orange rounded-lg">
      <div className="text-center text-white p-6 max-w-md">
        <div className="flex items-center justify-center mb-4">
          {error ? (
            <AlertCircle className="h-16 w-16 text-red-200" />
          ) : (
            <Play className="h-16 w-16" />
          )}
        </div>
        
        <p className="text-lg font-medium mb-2">
          {error ? 'Video-Fehler' : 'Video wird bald verfügbar sein'}
        </p>
        
        <p className="text-sm opacity-80 mb-4">
          {error 
            ? 'Das Video konnte nicht geladen werden. Versuchen Sie es erneut oder testen Sie den direkten Zugriff.'
            : 'Hier wird das Erklärvideo zu whatsgonow eingebettet'
          }
        </p>
        
        {error && (
          <div className="mb-4">
            <details className="text-xs opacity-75 bg-black bg-opacity-20 p-2 rounded cursor-pointer">
              <summary className="font-mono mb-1">Fehler-Details</summary>
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
          </div>
        )}
        
        <div className="flex gap-2 justify-center flex-wrap">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onRefresh}
            className="text-white border-white hover:bg-white hover:text-brand-orange"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Neu laden
          </Button>
          
          {src && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onTestDirectAccess}
              className="text-white border-white hover:bg-white hover:text-brand-orange"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              URL testen
            </Button>
          )}
        </div>
        
        {!error && (
          <p className="text-xs opacity-60 mt-4">
            Demo-Modus: Videos werden nach der Integration verfügbar sein
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoErrorDisplay;
