
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

/**
 * Notfall-Reset Button für Auth-Probleme
 * Führt komplette Session- und Storage-Bereinigung durch
 */
const EmergencyResetButton: React.FC = () => {
  const [isResetting, setIsResetting] = useState(false);
  const { emergencyReset } = useOptimizedAuth();

  const handleEmergencyReset = async () => {
    setIsResetting(true);
    try {
      await emergencyReset();
    } catch (error) {
      console.error('Emergency reset failed:', error);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="sm" 
          className="text-xs"
          disabled={isResetting}
        >
          {isResetting ? (
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
          ) : (
            <AlertTriangle className="h-3 w-3 mr-1" />
          )}
          {isResetting ? 'Resetting...' : 'Emergency Reset'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Notfall-System-Reset
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <div className="font-medium">
              Dieser Reset behebt Login-Probleme durch:
            </div>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>Vollständige Session-Bereinigung</li>
              <li>Lokale Storage-Daten löschen</li>
              <li>Auth-State zurücksetzen</li>
              <li>Browser-Neuladen</li>
            </ul>
            <div className="text-sm text-red-600 mt-3">
              ⚠️ Sie werden automatisch ausgeloggt und die Seite wird neu geladen.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleEmergencyReset}
            className="bg-red-600 hover:bg-red-700"
          >
            Reset durchführen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EmergencyResetButton;
