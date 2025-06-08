
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Lock, Unlock, Shield, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AuthFreezeToggle = () => {
  const [isAuthFrozen, setIsAuthFrozen] = useState(false);
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const { toast } = useToast();

  const handleAuthFreeze = () => {
    setIsAuthFrozen(!isAuthFrozen);
    
    // In a real implementation, this would call an API to set environment variables
    localStorage.setItem('AUTH_LOCKED_FOR_DEV', isAuthFrozen ? 'false' : 'true');
    
    toast({
      title: isAuthFrozen ? "Auth-System entsperrt" : "Auth-System gesperrt",
      description: isAuthFrozen 
        ? "Entwickler können wieder Änderungen vornehmen" 
        : "Auth-Code ist jetzt vor Änderungen geschützt",
      variant: isAuthFrozen ? "default" : "destructive",
    });
  };

  const handleRegistrationToggle = () => {
    setRegistrationEnabled(!registrationEnabled);
    localStorage.setItem('ENABLE_REGISTRATION', registrationEnabled ? 'false' : 'true');
    
    toast({
      title: registrationEnabled ? "Registrierung deaktiviert" : "Registrierung aktiviert",
      description: registrationEnabled 
        ? "Neue Nutzer können sich nicht mehr registrieren" 
        : "Neue Registrierungen sind wieder möglich",
    });
  };

  const handleMaintenanceToggle = () => {
    setMaintenanceMode(!maintenanceMode);
    localStorage.setItem('MAINTENANCE_MODE', maintenanceMode ? 'false' : 'true');
    
    toast({
      title: maintenanceMode ? "Wartungsmodus beendet" : "Wartungsmodus aktiviert",
      description: maintenanceMode 
        ? "System ist wieder normal erreichbar" 
        : "System zeigt Wartungshinweis an",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Auth-System Kontrolle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Auth Freeze Control */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {isAuthFrozen ? <Lock className="h-4 w-4 text-red-500" /> : <Unlock className="h-4 w-4 text-green-500" />}
                <Label className="font-medium">Auth-Code Freeze</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Sperrt den Auth-Code vor weiteren Entwickleränderungen
              </p>
            </div>
            <Switch
              checked={isAuthFrozen}
              onCheckedChange={handleAuthFreeze}
            />
          </div>

          {/* Registration Control */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label className="font-medium">Registrierung</Label>
              <p className="text-sm text-muted-foreground">
                Ermöglicht oder blockiert neue Nutzerregistrierungen
              </p>
            </div>
            <Switch
              checked={registrationEnabled}
              onCheckedChange={handleRegistrationToggle}
            />
          </div>

          {/* Maintenance Mode */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label className="font-medium">Wartungsmodus</Label>
              <p className="text-sm text-muted-foreground">
                Zeigt allen Nutzern eine Wartungsseite an
              </p>
            </div>
            <Switch
              checked={maintenanceMode}
              onCheckedChange={handleMaintenanceToggle}
            />
          </div>

          {(isAuthFrozen || !registrationEnabled || maintenanceMode) && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Aktive Einschränkungen:</strong>
                <ul className="mt-2 space-y-1">
                  {isAuthFrozen && <li>• Auth-Code ist gesperrt</li>}
                  {!registrationEnabled && <li>• Registrierung deaktiviert</li>}
                  {maintenanceMode && <li>• Wartungsmodus aktiv</li>}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="pt-4 border-t">
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>Empfohlenes Vorgehen nach GoLive:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>System Audit mit 90%+ Score abschließen</li>
                <li>RESEND_API_KEY in Supabase setzen</li>
                <li>Live-Test mit echtem E-Mail-Account</li>
                <li>Auth-Code einfrieren (AUTH_LOCKED_FOR_DEV = true)</li>
                <li>Monitoring & Feedback-Loop aktivieren</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthFreezeToggle;
