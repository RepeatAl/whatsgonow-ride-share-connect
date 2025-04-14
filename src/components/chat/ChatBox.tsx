
import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ChatMessage from './ChatMessage';
import { useChatMessages } from '@/hooks/use-chat-messages';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

export interface ChatBoxProps {
  orderId: string;
  recipientId: string;
  userName?: string;
  orderDescription?: string;
}

export function ChatBox({ orderId, recipientId, userName, orderDescription }: ChatBoxProps) {
  const [message, setMessage] = useState('');
  const { messages, loading, sendMessage } = useChatMessages(orderId);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    await sendMessage(message, recipientId);
    setMessage('');
    
    // Focus textarea after sending
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (timestamp: string) => {
    try {
      const date = parseISO(timestamp);
      return formatDistanceToNow(date, { addSuffix: true, locale: de });
    } catch (error) {
      return 'Unknown time';
    }
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { [key: string]: typeof messages } = {};
    
    messages.forEach(msg => {
      const date = new Date(msg.sent_at).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="px-4 py-3 border-b">
        <CardTitle className="text-base font-medium">
          {userName || 'Chat'}{' '}
          {orderDescription && (
            <span className="text-sm font-normal text-muted-foreground">
              ({orderDescription})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0 h-[calc(100%-120px)]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Keine Nachrichten. Starte die Konversation!
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(messageGroups).map(([date, msgs]) => (
                  <div key={date} className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t"></span>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-card px-2 text-muted-foreground">
                          {date}
                        </span>
                      </div>
                    </div>
                    {msgs.map(msg => (
                      <ChatMessage
                        key={msg.message_id}
                        message={{
                          id: msg.message_id,
                          content: msg.content,
                          timestamp: formatMessageTime(msg.sent_at),
                          isCurrentUser: msg.isCurrentUser,
                          sender: msg.senderName || 'Unknown',
                          read: msg.read
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        )}
      </CardContent>
      <CardFooter className="p-3 border-t">
        <div className="flex w-full items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nachricht schreiben..."
            className="flex-grow resize-none min-h-[60px]"
            maxRows={4}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!message.trim() || loading}
            className="flex-shrink-0"
            size="icon"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
