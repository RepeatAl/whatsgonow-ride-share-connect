
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { useSystemAudit } from '@/hooks/use-system-audit';
import { AuditEventType, AuditEntityType, AuditSeverity } from '@/constants/auditEvents';
import { supabase } from '@/integrations/supabase/client';
import { NotificationType } from '@/constants/notificationTypes';

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
  const [hasNotified, setHasNotified] = useState(false);
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
  
  // Function to send notification about expiration warning
  const sendExpirationWarningNotification = useCallback(async (senderId: string) => {
    try {
      await supabase.functions.invoke('notify-user', {
        body: {
          userId: senderId,
          eventType: NotificationType.ORDER_EXPIRY_WARNING,
          entityId: orderId,
          title: 'Auftrag läuft bald ab!',
          message: 'Dein Auftrag läuft in weniger als 12 Stunden ab.',
          metadata: {
            order_id: orderId,
            expires_at: new Date(startTime.getTime() + expirationDays * 24 * 60 * 60 * 1000).toISOString()
          },
          priority: 'high'
        }
      });
    } catch (error) {
      console.error('Fehler beim Senden der Benachrichtigung über Ablauf:', error);
    }
  }, [orderId, startTime, expirationDays]);

  // Function to send notification about expiration
  const sendExpirationNotification = useCallback(async (senderId: string) => {
    try {
      await supabase.functions.invoke('notify-user', {
        body: {
          userId: senderId,
          eventType: NotificationType.ORDER_EXPIRED,
          entityId: orderId,
          title: 'Auftrag abgelaufen',
          message: 'Dein Auftrag ist abgelaufen, da keine Angebote innerhalb der Frist angenommen wurden.',
          metadata: {
            order_id: orderId
          },
          priority: 'medium'
        }
      });
    } catch (error) {
      console.error('Fehler beim Senden der Benachrichtigung über Ablauf:', error);
    }
  }, [orderId]);
  
  useEffect(() => {
    // Fetch the order owner first
    const fetchOrderOwner = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("sender_id")
          .eq("order_id", orderId)
          .single();
        
        if (error) throw error;
        return data.sender_id;
      } catch (error) {
        console.error('Fehler beim Abrufen des Auftragsbesitzers:', error);
        return null;
      }
    };

    // Initial calculation
    setRemainingTime(calculateRemainingTime());
    
    // Set up timer
    const intervalId = setInterval(async () => {
      const remaining = calculateRemainingTime();
      setRemainingTime(remaining);
      
      // Show warning when 12 hours or less remaining
      const totalHours = remaining.days * 24 + remaining.hours;
      if (totalHours <= 12 && totalHours > 0 && !isWarning) {
        setIsWarning(true);
        
        // Show toast notification
        toast({
          title: "Auftrag läuft bald ab!",
          description: "Dieser Auftrag läuft in weniger als 12 Stunden ab.",
          variant: "default",
        });
        
        // Send notification to order owner
        if (!hasNotified) {
          const senderId = await fetchOrderOwner();
          if (senderId) {
            await sendExpirationWarningNotification(senderId);
            setHasNotified(true);
          }
        }
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
        try {
          // Use async/await pattern instead of promise chains to handle errors properly
          const sendMessage = async () => {
            try {
              // Send notification to order owner about expiration
              const senderId = await fetchOrderOwner();
              if (senderId) {
                await sendExpirationNotification(senderId);
              }
              
              const { error } = await supabase
                .from('messages')
                .insert({
                  sender_id: 'system',
                  order_id: orderId,
                  content: 'Der Auftrag ist abgelaufen, da keine Angebote innerhalb der Frist angenommen wurden.',
                  system_message: true
                });
                
              if (error) throw error;
              
              toast({
                title: "Auftrag abgelaufen",
                description: "Dieser Auftrag ist abgelaufen, da keine Angebote innerhalb der Frist angenommen wurden.",
                variant: "destructive",
              });
            } catch (error) {
              console.error('Fehler beim Senden der Ablaufnachricht:', error);
            } finally {
              onExpire();
            }
          };
          
          // Execute the async function
          sendMessage();
        } catch (error) {
          console.error('Fehler beim Senden der Ablaufnachricht:', error);
          onExpire();
        }
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [calculateRemainingTime, isWarning, hasNotified, logEvent, orderId, startTime, expirationDays, onExpire, sendExpirationWarningNotification, sendExpirationNotification]);
  
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
