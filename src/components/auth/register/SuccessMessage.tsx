import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const SuccessMessage: React.FC = () => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Registrierung erfolgreich</CardTitle>
        <CardDescription>
          Dein Konto wurde erfolgreich erstellt
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertDescription>
            Hinweis: In der Testphase kann es vorkommen, dass keine Bestätigungs-E-Mail versendet wird.
            Du kannst dich trotzdem direkt mit deinen Anmeldedaten einloggen.
          </AlertDescription>
        </Alert>
        <Button 
          asChild 
          className="w-full"
          variant="brand"
        >
          <Link to="/login">Zum Login</Link>
        </Button>
      </CardContent>
    </Card>
  );
};
