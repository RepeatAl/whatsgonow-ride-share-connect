
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotificationContext } from '@/contexts/NotificationContext';

interface NotificationBadgeProps {
  onClick: () => void;
}

export function NotificationBadge({ onClick }: NotificationBadgeProps) {
  const { unreadCount } = useNotificationContext();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={onClick}
      aria-label={`Benachrichtigungen${unreadCount > 0 ? ` (${unreadCount} ungelesen)` : ''}`}
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Button>
  );
}
