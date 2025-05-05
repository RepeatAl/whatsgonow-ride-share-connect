
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { NotificationType, NotificationPriority } from '@/constants/notificationTypes';
import { useAuth } from '@/contexts/AuthContext';

export interface Notification {
  id: string;
  user_id: string;
  event_type: string;
  entity_id: string;
  title: string;
  message: string;
  read_at: string | null;
  created_at: string;
  metadata: Record<string, any>;
  priority: string;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      
      setNotifications(data || []);
      setUnreadCount(data?.filter(n => n.read_at === null).length || 0);
    } catch (err) {
      console.error('Fehler beim Laden der Benachrichtigungen:', err);
      setError(err instanceof Error ? err : new Error('Unbekannter Fehler'));
      toast({
        title: 'Fehler',
        description: 'Benachrichtigungen konnten nicht geladen werden.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id]);
  
  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, read_at: new Date().toISOString() } 
            : n
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      
    } catch (err) {
      console.error('Fehler beim Markieren als gelesen:', err);
      toast({
        title: 'Fehler',
        description: 'Benachrichtigung konnte nicht als gelesen markiert werden.',
        variant: 'destructive',
      });
    }
  }, [user?.id]);
  
  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .is('read_at', null);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n.read_at === null 
            ? { ...n, read_at: new Date().toISOString() } 
            : n
        )
      );
      
      // Update unread count
      setUnreadCount(0);
      
    } catch (err) {
      console.error('Fehler beim Markieren aller als gelesen:', err);
      toast({
        title: 'Fehler',
        description: 'Benachrichtigungen konnten nicht als gelesen markiert werden.',
        variant: 'destructive',
      });
    }
  }, [user?.id]);
  
  // Send a notification (utility function)
  const sendNotification = useCallback(async ({
    userId,
    userIds,
    eventType,
    entityId,
    title,
    message,
    metadata,
    priority
  }: {
    userId?: string;
    userIds?: string[];
    eventType: NotificationType;
    entityId: string;
    title?: string;
    message: string;
    metadata?: Record<string, any>;
    priority?: NotificationPriority;
  }) => {
    try {
      const { data, error } = await supabase.functions.invoke('notify-user', {
        body: {
          userId,
          userIds,
          eventType,
          entityId,
          title,
          message,
          metadata,
          priority
        }
      });
      
      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      console.error('Fehler beim Senden einer Benachrichtigung:', err);
      return { success: false, error: err };
    }
  }, []);
  
  // Load notifications on initial mount and when user changes
  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user?.id, fetchNotifications]);
  
  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    sendNotification
  };
};

export default useNotifications;
