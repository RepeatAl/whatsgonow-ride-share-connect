
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface QRBackupCodeProps {
  orderId: string;
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
  onFailure?: (error: string) => void;
  useBackupCode: (orderId: string, backupCode: string, userId: string) => Promise<{ 
    success: boolean; 
    error?: string 
  }>;
}

export function QRBackupCode({
  orderId,
  userId,
  onSuccess,
  onCancel,
  onFailure,
  useBackupCode
}: QRBackupCodeProps) {
  const [backupCode, setBackupCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (backupCode.length !== 6) {
      toast({
        title: "Ungültiger Code",
        description: "Der Backup-Code muss 6 Ziffern enthalten.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await useBackupCode(orderId, backupCode, userId);
      
      if (result.success) {
        toast({
          title: "Erfolgreich",
          description: "Der Backup-Code wurde erfolgreich verwendet.",
        });
        onSuccess();
      } else {
        setAttempts(prev => prev + 1);
        toast({
          title: "Fehler",
          description: result.error || "Der Backup-Code konnte nicht verifiziert werden.",
          variant: "destructive",
        });
        
        if (onFailure) {
          onFailure(result.error || "Ungültiger Code");
        }
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive",
      });
      
      if (onFailure) {
        onFailure("Unerwarteter Fehler");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  useEffect(() => {
    // Wenn zu viele Versuche fehlschlagen, Eskalation anbieten
    if (attempts >= 3) {
      toast({
        title: "Zu viele Versuche",
        description: "Bitte kontaktieren Sie den Support für Hilfe.",
        variant: "destructive",
      });
    }
  }, [attempts]);

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h3 className="font-semibold text-lg mb-4">Backup-Code eingeben</h3>
      <p className="text-sm text-gray-600 mb-4">
        Wenn der QR-Code nicht gescannt werden kann, geben Sie bitte den 6-stelligen Backup-Code ein,
        den der Auftraggeber Ihnen mitteilen kann.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            inputMode="numeric"
            placeholder="6-stelligen Code eingeben"
            value={backupCode}
            onChange={(e) => setBackupCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="text-center text-xl letter-spacing-wide"
            maxLength={6}
            autoFocus
          />
          {attempts > 0 && (
            <p className="text-xs text-red-500 mt-1">
              Ungültiger Code. Versuche: {attempts}/3
            </p>
          )}
        </div>
        
        <div className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Abbrechen
          </Button>
          <Button 
            type="submit"
            disabled={backupCode.length !== 6 || isSubmitting}
          >
            {isSubmitting ? 'Wird geprüft...' : 'Code prüfen'}
          </Button>
        </div>
        
        {attempts >= 3 && (
          <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              Zu viele fehlgeschlagene Versuche. Bitte rufen Sie den Support unter der Nummer 
              +49 123 4567890 an oder erstellen Sie einen Support-Fall im System.
            </p>
            <Button 
              variant="link" 
              className="text-yellow-800 p-0 h-auto text-sm" 
              onClick={() => window.location.href = '/support'}
            >
              Support kontaktieren
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

export default QRBackupCode;
