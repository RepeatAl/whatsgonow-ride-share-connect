
import React from "react";
import ChatMessage from "./ChatMessage";
import { ChatMessage as ChatMessageType } from "@/features/chat/hooks/use-chat-messages";

interface MessageGroupProps {
  date: string;
  messages: ChatMessageType[];
  formatMessageTime: (timestamp: string) => string;
}

export const MessageGroup = ({ date, messages, formatMessageTime }: MessageGroupProps) => {
  return (
    <div className="space-y-4">
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
      {messages.map(msg => (
        <ChatMessage
          key={msg.id}
          message={{
            id: msg.id,
            content: msg.content,
            timestamp: formatMessageTime(msg.sent_at),
            isCurrentUser: msg.isCurrentUser || false,
            sender: msg.sender_name || 'Unknown',
            read: msg.read
          }}
        />
      ))}
    </div>
  );
};
