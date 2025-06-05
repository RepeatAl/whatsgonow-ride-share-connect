
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockTransports, mockRequests } from '@/data/mockData';

interface MapFallbackProps {
  height?: string;
  onRetry?: () => void;
  errorType?: 'api_key' | 'network' | 'cors' | 'unknown';
  showMockData?: boolean;
}

const MapFallback: React.FC<MapFallbackProps> = ({ 
  height = '400px', 
  onRetry,
  errorType = 'unknown',
  showMockData = true 
}) => {
  const getErrorMessage = () => {
    switch (errorType) {
      case 'api_key':
        return 'HERE Maps API-Schlüssel fehlt oder ist ungültig';
      case 'network':
        return 'Netzwerkverbindung zu HERE Maps fehlgeschlagen';
      case 'cors':
        return 'HTTPS oder CORS-Konfiguration blockiert HERE Maps';
      default:
        return 'HERE Maps konnte nicht geladen werden';
    }
  };

  const getErrorDetails = () => {
    switch (errorType) {
      case 'api_key':
        return 'Prüfen Sie die API-Schlüssel-Konfiguration in den Projekteinstellungen';
      case 'network':
        return 'Überprüfen Sie Ihre Internetverbindung oder Firewall-Einstellungen';
      case 'cors':
        return 'Stellen Sie sicher, dass die Seite über HTTPS geladen wird';
      default:
        return 'Weitere Details finden Sie in der Browser-Konsole';
    }
  };

  return (
    <div className="w-full" style={{ height }}>
      <Card className="h-full">
        <CardContent className="p-0 h-full relative">
          {/* Mock Map Background */}
          <div 
            className="w-full h-full bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 relative overflow-hidden"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)
              `
            }}
          >
            {/* Mock Germany Outline */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                width="200"
                height="240"
                viewBox="0 0 200 240"
                className="opacity-20 text-gray-400"
                fill="currentColor"
              >
                <path d="M100 20 L120 40 L140 30 L160 50 L170 80 L160 120 L140 140 L130 160 L120 180 L100 200 L80 180 L70 160 L60 140 L40 120 L30 80 L40 50 L60 30 L80 40 Z" />
              </svg>
            </div>

            {/* Mock Data Pins */}
            {showMockData && (
              <>
                {/* Transport Pins */}
                {mockTransports.slice(0, 8).map((transport, index) => (
                  <div
                    key={`transport-${index}`}
                    className="absolute"
                    style={{
                      left: `${20 + (index * 10) % 60}%`,
                      top: `${30 + (index * 15) % 40}%`,
                    }}
                  >
                    <div className="relative">
                      <div 
                        className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                          transport.price < 15 ? 'bg-green-500' :
                          transport.price <= 25 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                      />
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                        {transport.from} → {transport.to}
                        <br />
                        {transport.price}€
                      </div>
                    </div>
                  </div>
                ))}

                {/* Request Pins */}
                {mockRequests.slice(0, 6).map((request, index) => (
                  <div
                    key={`request-${index}`}
                    className="absolute"
                    style={{
                      left: `${25 + (index * 12) % 50}%`,
                      top: `${40 + (index * 18) % 35}%`,
                    }}
                  >
                    <div className="relative">
                      <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                        {request.title}
                        <br />
                        Budget: {request.budget}€
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Error Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Alert className="max-w-md mx-4 bg-white">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="space-y-3">
                  <div>
                    <div className="font-medium text-red-700">{getErrorMessage()}</div>
                    <div className="text-sm text-gray-600 mt-1">{getErrorDetails()}</div>
                  </div>
                  
                  {onRetry && (
                    <Button onClick={onRetry} variant="outline" size="sm" className="w-full">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Erneut versuchen
                    </Button>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    Mock-Daten werden angezeigt. Echte Karte wird nach Behebung des Problems verfügbar sein.
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Legend */}
          {showMockData && (
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>&lt; 15€</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span>15-25€</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>&gt; 25€</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Anfragen</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MapFallback;
