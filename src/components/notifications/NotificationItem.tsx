
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { Notification } from '@/hooks/use-notifications';
import { Button } from '@/components/ui/button';
import { Check, AlertTriangle, Bell, Clock } from 'lucide-react';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const isRead = !!notification.read_at;
  
  // Format the time
  const formattedTime = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
    locale: de
  });
  
  // Determine the icon based on notification type
  const getIcon = () => {
    const type = notification.event_type;
    
    if (type.includes('expiry')) {
      return <Clock className="h-5 w-5 text-orange-500" />;
    } else if (type.includes('dispute')) {
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    } else if (type.includes('accepted')) {
      return <Check className="h-5 w-5 text-green-500" />;
    } else {
      return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };
  
  return (
    <div className={`p-3 border-b last:border-b-0 hover:bg-accent/5 transition-colors ${
      isRead ? 'opacity-70' : 'bg-accent/10'
    }`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {getIcon()}
        </div>
        
        <div className="flex-1">
          <h4 className="text-sm font-medium leading-none">
            {notification.title}
          </h4>
          
          <p className="mt-1 text-sm text-muted-foreground">
            {notification.message}
          </p>
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-muted-foreground">
              {formattedTime}
            </span>
            
            {!isRead && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onMarkAsRead(notification.id)}
                className="h-6 px-2 text-xs"
              >
                Als gelesen markieren
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
