
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Map, RefreshCcw, ExternalLink, Info } from 'lucide-react';
import { FallbackLocalizedText } from '@/components/common/FallbackLocalizedText';

interface MapFallbackProps {
  height?: string;
  errorType?: 'api_key' | 'network' | 'cors' | 'unknown';
  onRetry?: () => void;
  showMockData?: boolean;
}

const MapFallback: React.FC<MapFallbackProps> = ({
  height = '400px',
  errorType = 'unknown',
  onRetry,
  showMockData = false
}) => {
  // Error message and instructions based on error type
  const getErrorContent = () => {
    switch (errorType) {
      case 'api_key':
        return {
          title: 'API-Key Fehler',
          message: 'Die Karte konnte aufgrund eines Problems mit dem API-Schlüssel nicht geladen werden.',
          instructions: 'Bitte überprüfen Sie, ob der HERE Maps API-Key korrekt konfiguriert ist.'
        };
      case 'network':
        return {
          title: 'Netzwerkfehler',
          message: 'Die HERE Maps-Dienste konnten nicht erreicht werden.',
          instructions: 'Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut.'
        };
      case 'cors':
        return {
          title: 'Content Security Policy (CSP) Fehler',
          message: 'Das Laden des HERE Maps SDK wird durch Ihre Sicherheitseinstellungen blockiert.',
          instructions: 'Bitte überprüfen Sie die Content-Security-Policy in vercel.json und stellen Sie sicher, dass HERE-Domains und unsafe-eval erlaubt sind.'
        };
      default:
        return {
          title: 'Kartenladevorgang fehlgeschlagen',
          message: 'Die Karte konnte nicht geladen werden.',
          instructions: 'Bitte versuchen Sie es später erneut oder kontaktieren Sie den Support.'
        };
    }
  };

  const errorContent = getErrorContent();

  // Render mock data or error message
  if (showMockData) {
    // Show a simplified mock map view
    return (
      <div 
        className="w-full bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex flex-col items-center justify-center"
        style={{ height }}
      >
        <div className="p-4 max-w-md text-center">
          <Map className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            {errorContent.title}
          </h3>
          <p className="text-gray-600 mb-3">
            {errorContent.message}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            {errorContent.instructions}
          </p>
          
          {onRetry && (
            <Button 
              variant="outline" 
              onClick={onRetry} 
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Erneut versuchen
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Show full error card
  return (
    <Card className="w-full" style={{ minHeight: height }}>
      <CardHeader className="bg-red-50 border-b border-red-100">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <CardTitle className="text-red-700 text-lg">
            {errorContent.title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <p className="text-gray-700">
          {errorContent.message}
        </p>
        
        <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">Diagnose & Lösung</h4>
              <p className="text-sm text-amber-700">
                {errorContent.instructions}
              </p>
            </div>
          </div>
        </div>
        
        {errorType === 'cors' && (
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200 font-mono text-xs overflow-auto">
            <pre className="text-gray-700">
{`// vercel.json CSP Configuration
{
  "headers": [{
    "source": "/(.*)",
    "headers": [{
      "key": "Content-Security-Policy",
      "value": "... script-src 'self' https://js.api.here.com https://*.here.com 'unsafe-inline' 'unsafe-eval'; ..."
    }]
  }]
}`}
            </pre>
          </div>
        )}
        
      </CardContent>
      <CardFooter className="flex justify-between">
        <FallbackLocalizedText 
          tKey="common:try_again_later"
          fallback="Bitte versuchen Sie es später erneut."
          className="text-gray-500"
        />
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="link" 
            size="sm" 
            className="text-gray-500"
            onClick={() => window.open('https://developer.here.com/documentation/maps/3.1.38.0/dev_guide/index.html', '_blank')}
          >
            <span className="mr-1">Dokumentation</span>
            <ExternalLink className="h-3 w-3" />
          </Button>
          
          {onRetry && (
            <Button 
              variant="default" 
              size="sm"
              onClick={onRetry} 
              className="flex items-center gap-1"
            >
              <RefreshCcw className="h-4 w-4" />
              Erneut versuchen
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default MapFallback;
