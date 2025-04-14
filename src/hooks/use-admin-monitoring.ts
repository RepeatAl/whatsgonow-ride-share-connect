
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAdminMonitoring = (user: { id: string; role: string } | null) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Only initialize for admin users
    if (!user || user.role !== 'admin') {
      return;
    }

    setIsActive(true);
    
    // Set up transaction monitoring channel
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
          console.log('New transaction:', transaction);
          
          toast({
            title: 'Neue Transaktion',
            description: `Transaktion über €${transaction.amount} wurde durchgeführt.`,
            variant: 'default'
          });
        }
      )
      .subscribe();
      
    // Set up delivery logs monitoring channel
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
          console.log('New delivery log:', log);
          
          toast({
            title: 'Neuer Logeintrag',
            description: `Aktion "${log.action}" wurde protokolliert.`,
            variant: 'default'
          });
        }
      )
      .subscribe();
      
    console.log('Admin monitoring activated');
    
    // Cleanup function
    return () => {
      if (transactionsChannel) supabase.removeChannel(transactionsChannel);
      if (logsChannel) supabase.removeChannel(logsChannel);
      console.log('Admin monitoring deactivated');
    };
  }, [user]);
  
  return { isActive };
};
