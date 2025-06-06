
import React from "react";
import { Play, RefreshCw, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VideoErrorDisplayProps {
  error?: string;
  src?: string;
  onRefresh: () => void;
  onTestDirectAccess: () => void;
}

const VideoErrorDisplay = ({ error, src, onRefresh, onTestDirectAccess }: VideoErrorDisplayProps) => {
  const isSupabaseUrl = src?.includes('supabase.co');
  const hasVideoExtension = src ? ['.mp4', '.webm', '.ogg'].some(ext => src.includes(ext)) : false;
  const isEmpty = error?.includes('Empty src attribute');

  return (
    <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-8 grid-rows-6 h-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border border-gray-300"></div>
          ))}
        </div>
      </div>
      
      <div className="text-center text-gray-600 p-6 max-w-md bg-white/90 backdrop-blur-sm rounded-lg shadow-sm relative z-10">
        <div className="flex items-center justify-center mb-4">
          <Play className="h-12 w-12 text-gray-400" />
        </div>
        
        <h3 className="text-lg font-medium mb-2 text-gray-800">
          {isEmpty ? 'Video wird geladen...' : 'Video wird bald verfügbar sein'}
        </h3>
        
        {isEmpty ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Das Video wird gerade verarbeitet und steht in Kürze zur Verfügung.
            </p>
            <Alert className="text-left">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Falls das Problem bestehen bleibt, überprüfen Sie die Video-URL in den Admin-Einstellungen.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <p className="text-sm text-gray-600 mb-4">
            Hier wird das Erklärvideo zu Whatsgonow eingebettet
          </p>
        )}
        
        <p className="text-xs text-gray-500 mb-6">
          {isEmpty ? 'Video-Quelle wird aktualisiert...' : 'Coming Soon – Wir arbeiten dran!'}
        </p>
        
        {error && !isEmpty && (
          <details className="text-xs text-gray-400 bg-gray-50 p-2 rounded cursor-pointer mb-4 opacity-60">
            <summary className="font-mono mb-1">Technische Details</summary>
            <div className="text-left space-y-1">
              <p className="break-words">{error}</p>
              {src && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p><strong>URL-Status:</strong></p>
                  <p>• Supabase: {isSupabaseUrl ? '✅' : '❌'}</p>
                  <p>• Video-Format: {hasVideoExtension ? '✅' : '❌'}</p>
                  <p className="break-all text-xs mt-1">• URL: {src}</p>
                </div>
              )}
            </div>
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
          
          {src && !isEmpty && (
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
