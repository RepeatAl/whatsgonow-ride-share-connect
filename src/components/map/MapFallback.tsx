
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Map, RefreshCcw, ExternalLink, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation(['common', 'map']);

  // Fehlerinhalt basierend auf Fehlertyp und Sprache
  const getErrorContent = () => {
    switch (errorType) {
      case 'api_key':
        return {
          title: t('map:error_api_key_title', 'Kartendienst nicht verfügbar'),
          message: t('map:error_api_key_message', 'Die Karte kann aufgrund eines Konfigurationsproblems nicht geladen werden.'),
          instructions: t('map:error_api_key_instructions', 'Bitte versuchen Sie es später erneut oder kontaktieren Sie den Support.')
        };
      case 'network':
        return {
          title: t('map:error_network_title', 'Verbindungsproblem'),
          message: t('map:error_network_message', 'Die Kartendienste konnten nicht erreicht werden.'),
          instructions: t('map:error_network_instructions', 'Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut.')
        };
      case 'cors':
        return {
          title: t('map:error_cors_title', 'Sicherheitsrichtlinien-Fehler'),
          message: t('map:error_cors_message', 'Das Laden der Karte wird durch Sicherheitseinstellungen blockiert.'),
          instructions: t('map:error_cors_instructions', 'Bitte kontaktieren Sie den technischen Support.')
        };
      default:
        return {
          title: t('map:error_unknown_title', 'Karte nicht verfügbar'),
          message: t('map:error_unknown_message', 'Die Karte konnte nicht geladen werden.'),
          instructions: t('map:error_unknown_instructions', 'Bitte versuchen Sie es später erneut.')
        };
    }
  };

  const errorContent = getErrorContent();

  // Vereinfachte Mock-Ansicht für Demo-Zwecke
  if (showMockData) {
    return (
      <div 
        className="w-full bg-muted/30 rounded-lg border border-border overflow-hidden flex flex-col items-center justify-center"
        style={{ height }}
      >
        <div className="p-4 max-w-md text-center">
          <Map className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {t('map:fallback_title', 'Kartenvorschau')}
          </h3>
          <p className="text-muted-foreground mb-3">
            {t('map:fallback_message', 'Die interaktive Karte wird geladen...')}
          </p>
          
          {onRetry && (
            <Button 
              variant="outline" 
              onClick={onRetry} 
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              {t('common:retry', 'Erneut versuchen')}
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Vollständige Fehlerkarte
  return (
    <Card className="w-full" style={{ minHeight: height }}>
      <CardHeader className="bg-destructive/10 border-b border-destructive/20">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <CardTitle className="text-destructive text-lg">
            {errorContent.title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <p className="text-foreground">
          {errorContent.message}
        </p>
        
        <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-md border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-200">
                {t('map:diagnosis_title', 'Information')}
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                {errorContent.instructions}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-muted-foreground text-sm">
          {t('map:try_again_later', 'Bitte versuchen Sie es später erneut.')}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="link" 
            size="sm" 
            className="text-muted-foreground"
            onClick={() => window.open('https://developer.here.com/documentation', '_blank')}
          >
            <span className="mr-1">{t('map:documentation', 'Dokumentation')}</span>
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
              {t('common:retry', 'Erneut versuchen')}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default MapFallback;
