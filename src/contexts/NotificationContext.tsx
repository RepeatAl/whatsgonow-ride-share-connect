
import { createContext, useContext, ReactNode } from 'react';
import { useNotifications, Notification } from '@/hooks/use-notifications';
import { useNotificationRealtime } from '@/hooks/use-notification-realtime';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  isSubscribed: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  } = useNotifications();
  
  const { isSubscribed } = useNotificationRealtime();
  
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        isSubscribed,
        markAsRead,
        markAllAsRead,
        refreshNotifications: fetchNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext muss innerhalb eines NotificationProvider verwendet werden');
  }
  return context;
};
