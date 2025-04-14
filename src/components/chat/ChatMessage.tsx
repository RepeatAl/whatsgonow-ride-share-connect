
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    timestamp: string;
    isCurrentUser: boolean;
    sender: string;
    read: boolean;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { isCurrentUser, content, timestamp, read } = message;

  return (
    <div className={cn(
      "flex items-end gap-2",
      isCurrentUser ? "justify-end" : "justify-start"
    )}>
      {!isCurrentUser && (
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          {message.sender.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="max-w-[80%]">
        {!isCurrentUser && (
          <p className="text-xs text-muted-foreground mb-1">{message.sender}</p>
        )}
        <div className={cn(
          "rounded-lg p-3 shadow-sm",
          isCurrentUser
            ? "bg-primary text-primary-foreground"
            : "bg-secondary"
        )}>
          <div className="whitespace-pre-wrap break-words">{content}</div>
          <div className="flex items-center justify-end gap-1 mt-1">
            <span className="text-xs opacity-70">{timestamp}</span>
            {isCurrentUser && (
              <Check 
                className={cn(
                  "h-3 w-3", 
                  read ? "text-green-500" : "opacity-70"
                )} 
              />
            )}
          </div>
        </div>
      </div>
      {isCurrentUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0">
          {message.sender.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}
