
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNotifications } from './use-notifications';
import { useAuth } from '@/contexts/AuthContext';

export const useNotificationRealtime = () => {
  const { user } = useAuth();
  const { fetchNotifications, unreadCount } = useNotifications();
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  // Subscribe to notification changes
  useEffect(() => {
    if (!user?.id) {
      setIsSubscribed(false);
      return;
    }
    
    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Neue Benachrichtigung erhalten:', payload);
          
          // Refresh notifications list
          fetchNotifications();
          
          // Show toast notification
          const notification = payload.new;
          toast({
            title: notification.title,
            description: notification.message,
            variant: notification.priority === 'high' ? 'destructive' : 'default',
          });
        }
      )
      .subscribe((status) => {
        console.log('Benachrichtigungen-Subscription-Status:', status);
        setIsSubscribed(status === 'SUBSCRIBED');
      });
    
    return () => {
      setIsSubscribed(false);
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchNotifications]);
  
  return {
    isSubscribed,
    unreadCount
  };
};

export default useNotificationRealtime;
