import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  role: string;
}

export const useAdminMonitoring = (user: AdminUser | null) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Nur für Admins aktivieren
    if (!user || user.role !== 'admin') {
      setIsActive(false);
      return;
    }

    setIsActive(true);

    // Channel für neue Transaktionen
    const transactionsChannel = supabase
      .channel('admin_transactions_monitor')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions'
        },
        (payload) => {
          const transaction = payload.new;
          console.log('Neue Transaktion:', transaction);

          toast({
            title: 'Neue Transaktion',
            description: `Transaktion über €${transaction.amount} wurde durchgeführt.`,
            variant: 'default'
          });
        }
      )
      .subscribe();

    // Channel für neue Logeinträge
    const logsChannel = supabase
      .channel('admin_logs_monitor')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'delivery_logs'
        },
        (payload) => {
          const log = payload.new;
          console.log('Neuer Logeintrag:', log);

          toast({
            title: 'Neuer Logeintrag',
            description: `Aktion "${log.action}" wurde protokolliert.`,
            variant: 'default'
          });
        }
      )
      .subscribe();

    console.log('✅ Admin monitoring aktiviert');

    // Cleanup – Channels bei Unmount entfernen
    return () => {
      if (transactionsChannel) supabase.removeChannel(transactionsChannel);
      if (logsChannel) supabase.removeChannel(logsChannel);
      setIsActive(false);
      console.log('🛑 Admin monitoring deaktiviert');
    };
  }, [user]);

  return { isActive };
};
