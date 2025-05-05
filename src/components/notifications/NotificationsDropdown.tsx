
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { NotificationItem } from './NotificationItem';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NotificationsDropdownProps {
  children: React.ReactNode;
}

export function NotificationsDropdown({ children }: NotificationsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotificationContext();
  
  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 md:w-96" align="end">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Benachrichtigungen</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              className="h-7 text-xs"
            >
              Alle als gelesen markieren
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <ScrollArea className="h-80">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Benachrichtigungen werden geladen...
            </div>
          ) : notifications.length > 0 ? (
            notifications.map(notification => (
              <NotificationItem 
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
              />
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Keine Benachrichtigungen vorhanden
            </div>
          )}
        </ScrollArea>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/notifications" className="cursor-pointer justify-center text-center">
            Alle Benachrichtigungen anzeigen
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
