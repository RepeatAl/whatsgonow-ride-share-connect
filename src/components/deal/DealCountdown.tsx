
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { useSystemAudit } from '@/hooks/use-system-audit';
import { AuditEventType, AuditEntityType, AuditSeverity } from '@/constants/auditEvents';
import { supabase } from '@/integrations/supabase/client';

interface DealCountdownProps {
  orderId: string;
  userId: string;
  targetUserId: string;
  startTime: Date;
  expirationMinutes?: number;
  onExpire: () => void;
}

export function DealCountdown({
  orderId,
  userId,
  targetUserId,
  startTime,
  expirationMinutes = 10,
  onExpire
}: DealCountdownProps) {
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [isWarning, setIsWarning] = useState(false);
  const { logEvent } = useSystemAudit();
  
  const calculateRemainingTime = useCallback(() => {
    const now = new Date();
    const expirationTime = new Date(startTime);
    expirationTime.setMinutes(expirationTime.getMinutes() + expirationMinutes);
    
    const diffSeconds = Math.floor((expirationTime.getTime() - now.getTime()) / 1000);
    return diffSeconds > 0 ? diffSeconds : 0;
  }, [startTime, expirationMinutes]);
  
  useEffect(() => {
    // Initial calculation
    setRemainingSeconds(calculateRemainingTime());
    
    // Set up timer
    const intervalId = setInterval(() => {
      const remaining = calculateRemainingTime();
      setRemainingSeconds(remaining);
      
      // Show warning when 2 minutes remaining
      if (remaining <= 120 && remaining > 0 && !isWarning) {
        setIsWarning(true);
        toast({
          title: "Fast abgelaufen!",
          description: "Diese Verhandlung läuft in 2 Minuten ab. Bitte schließen Sie sie ab.",
          // Fix: Change "warning" to "default" with appropriate styling
          variant: "default",
        });
      }
      
      // When timer expires
      if (remaining === 0) {
        clearInterval(intervalId);
        
        // Log expiration event
        logEvent({
          eventType: AuditEventType.DEAL_EXPIRED,
          entityType: AuditEntityType.ORDER,
          entityId: orderId,
          actorId: 'system',
          targetId: userId,
          metadata: {
            negotiation_partner: targetUserId,
            start_time: startTime.toISOString(),
            expiration_minutes: expirationMinutes
          },
          severity: AuditSeverity.WARN
        });
        
        // Send automatic message about expiration
        supabase
          .from('messages')
          .insert({
            sender_id: 'system',
            recipient_id: targetUserId,
            order_id: orderId,
            content: 'Die Verhandlungszeit ist abgelaufen. Diese Verhandlung wurde automatisch beendet.',
            system_message: true
          })
          .then(() => {
            // Notify the other user as well
            return supabase
              .from('messages')
              .insert({
                sender_id: 'system',
                recipient_id: userId,
                order_id: orderId,
                content: 'Die Verhandlungszeit ist abgelaufen. Diese Verhandlung wurde automatisch beendet.',
                system_message: true
              });
          })
          .then(() => {
            // Success case - nothing special to do
          })
          .catch(error => {
            console.error('Fehler beim Senden der Ablaufnachricht:', error);
          });
        
        toast({
          title: "Zeit abgelaufen",
          description: "Die Verhandlungszeit für diesen Auftrag ist abgelaufen.",
          variant: "destructive",
        });
        
        onExpire();
      }
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [calculateRemainingTime, isWarning, logEvent, orderId, userId, targetUserId, startTime, expirationMinutes, onExpire]);
  
  if (remainingSeconds === null) return null;
  
  // Format time as MM:SS
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  return (
    <div className={`text-center p-2 rounded-md ${
      isWarning ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
    }`}>
      <div className="text-sm font-medium">Verhandlungszeit verbleibend</div>
      <div className={`text-2xl font-bold ${isWarning ? 'text-red-600' : ''}`}>
        {formattedTime}
      </div>
    </div>
  );
}

export default DealCountdown;
