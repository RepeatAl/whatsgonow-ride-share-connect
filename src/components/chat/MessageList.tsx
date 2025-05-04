
import React, { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageGroup } from "./MessageGroup";
import { ChatMessage } from "@/hooks/use-chat-messages";

interface MessageListProps {
  messageGroups: Record<string, ChatMessage[]>;
  loading: boolean;
  formatMessageTime: (timestamp: string) => string;
}

export const MessageList = ({ messageGroups, loading, formatMessageTime }: MessageListProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messageGroups]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (Object.keys(messageGroups).length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Keine Nachrichten. Starte die Konversation!
      </div>
    );
  }

  return (
    <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
      <div className="space-y-6">
        {Object.entries(messageGroups).map(([date, msgs]) => (
          <MessageGroup
            key={date}
            date={date}
            messages={msgs}
            formatMessageTime={formatMessageTime}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
