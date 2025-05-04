
import { useState } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useChatMessages, ChatMessage as ChatMessageType } from '@/hooks/use-chat-messages';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

export interface ChatBoxProps {
  orderId: string;
  recipientId: string;
  userName?: string;
  orderDescription?: string;
}

export function ChatBox({ orderId, recipientId, userName, orderDescription }: ChatBoxProps) {
  const [message, setMessage] = useState('');
  const { messages, loading, sendMessage } = useChatMessages(orderId);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    await sendMessage(message, recipientId);
    setMessage('');
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
    const groups: { [key: string]: ChatMessageType[] } = {};
    
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
        <MessageList 
          messageGroups={messageGroups}
          loading={loading}
          formatMessageTime={formatMessageTime}
        />
      </CardContent>
      <CardFooter className="p-3 border-t">
        <MessageInput 
          message={message}
          setMessage={setMessage}
          onSendMessage={handleSendMessage}
          isLoading={loading}
        />
      </CardFooter>
    </Card>
  );
}
