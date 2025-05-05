
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { useSystemAudit } from '@/hooks/use-system-audit';
import { AuditEventType, AuditEntityType, AuditSeverity } from '@/constants/auditEvents';
import { supabase } from '@/integrations/supabase/client';

interface OrderCountdownProps {
  orderId: string;
  startTime: Date;
  expirationDays?: number;
  onExpire: () => void;
}

export function OrderCountdown({
  orderId,
  startTime,
  expirationDays = 3,
  onExpire
}: OrderCountdownProps) {
  const [remainingTime, setRemainingTime] = useState<{ days: number; hours: number; minutes: number } | null>(null);
  const [isWarning, setIsWarning] = useState(false);
  const { logEvent } = useSystemAudit();
  
  const calculateRemainingTime = useCallback(() => {
    const now = new Date();
    const expirationTime = new Date(startTime);
    expirationTime.setDate(expirationTime.getDate() + expirationDays);
    
    const diffMs = expirationTime.getTime() - now.getTime();
    
    if (diffMs <= 0) {
      return { days: 0, hours: 0, minutes: 0 };
    }
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes };
  }, [startTime, expirationDays]);
  
  useEffect(() => {
    // Initial calculation
    setRemainingTime(calculateRemainingTime());
    
    // Set up timer
    const intervalId = setInterval(() => {
      const remaining = calculateRemainingTime();
      setRemainingTime(remaining);
      
      // Show warning when 12 hours or less remaining
      const totalHours = remaining.days * 24 + remaining.hours;
      if (totalHours <= 12 && totalHours > 0 && !isWarning) {
        setIsWarning(true);
        toast({
          title: "Auftrag läuft bald ab!",
          description: "Dieser Auftrag läuft in weniger als 12 Stunden ab.",
          variant: "warning",
        });
      }
      
      // When timer expires
      if (remaining.days === 0 && remaining.hours === 0 && remaining.minutes === 0) {
        clearInterval(intervalId);
        
        // Log expiration event
        logEvent({
          eventType: AuditEventType.ORDER_EXPIRED,
          entityType: AuditEntityType.ORDER,
          entityId: orderId,
          actorId: 'system',
          metadata: {
            start_time: startTime.toISOString(),
            expiration_days: expirationDays
          },
          severity: AuditSeverity.WARN
        });
        
        // Send automatic message about expiration
        supabase
          .from('messages')
          .insert({
            sender_id: 'system',
            order_id: orderId,
            content: 'Der Auftrag ist abgelaufen, da keine Angebote innerhalb der Frist angenommen wurden.',
            system_message: true
          })
          .then(() => {
            toast({
              title: "Auftrag abgelaufen",
              description: "Dieser Auftrag ist abgelaufen, da keine Angebote innerhalb der Frist angenommen wurden.",
              variant: "destructive",
            });
            
            onExpire();
          })
          .catch((error) => {
            console.error('Fehler beim Senden der Ablaufnachricht:', error);
            onExpire();
          });
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [calculateRemainingTime, isWarning, logEvent, orderId, startTime, expirationDays, onExpire]);
  
  if (remainingTime === null) return null;
  
  return (
    <div className={`text-center p-2 rounded-md ${
      isWarning ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
    }`}>
      <div className="text-sm font-medium">Verbleibende Zeit bis zum Ablauf</div>
      <div className={`text-xl font-bold ${isWarning ? 'text-red-600' : ''}`}>
        {remainingTime.days}d {remainingTime.hours}h {remainingTime.minutes}m
      </div>
    </div>
  );
}

export default OrderCountdown;
