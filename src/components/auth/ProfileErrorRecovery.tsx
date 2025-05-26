
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertCircle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';

interface ProfileErrorRecoveryProps {
  error?: string;
  hasTimedOut?: boolean;
  onRetry?: (() => Promise<void>) | null;
}

export const ProfileErrorRecovery: React.FC<ProfileErrorRecoveryProps> = ({
  error,
  hasTimedOut,
  onRetry
}) => {
  const navigate = useNavigate();
  const { getLocalizedUrl } = useLanguageMCP();
  
  const handleGoHome = () => {
    navigate(getLocalizedUrl('/'), { replace: true });
  };

  const handleRetry = async () => {
    if (onRetry) {
      try {
        await onRetry();
      } catch (err) {
        console.error('Retry failed:', err);
      }
    }
  };

  return (
    <div className="container max-w-md mx-auto py-20">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Profil-Ladeprobleme
          </CardTitle>
          <CardDescription>
            Es gab ein Problem beim Laden deines Profils
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {hasTimedOut 
                ? "Das Laden des Profils dauert ungewöhnlich lange. Dies kann an einer langsamen Internetverbindung oder einem temporären Serverproblem liegen."
                : error || "Ein unbekannter Fehler ist aufgetreten beim Laden deines Profils."
              }
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            {onRetry && (
              <Button 
                onClick={handleRetry}
                className="w-full"
                variant="default"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Erneut versuchen
              </Button>
            )}
            
            <Button 
              onClick={handleGoHome}
              className="w-full"
              variant="outline"
            >
              <Home className="h-4 w-4 mr-2" />
              Zur Startseite
            </Button>
          </div>

          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>Mögliche Lösungen:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Seite neu laden (F5)</li>
              <li>Browser-Cache leeren</li>
              <li>Internetverbindung prüfen</li>
              <li>Falls das Problem weiterhin besteht, wende dich an den Support</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileErrorRecovery;
