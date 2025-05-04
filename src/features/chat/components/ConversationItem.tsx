
import React from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Conversation } from "@/features/chat/hooks/use-chat-conversations";

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: (conversationId: string) => void;
}

export const ConversationItem = ({
  conversation,
  isSelected,
  onSelect
}: ConversationItemProps) => {
  const formatMessageTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(parseISO(timestamp), {
        addSuffix: true,
        locale: de,
      });
    } catch (error) {
      return "";
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <div
      className={`p-4 border-b hover:bg-accent cursor-pointer transition-colors ${
        isSelected ? "bg-accent" : ""
      }`}
      onClick={() => onSelect(conversation.order_id)}
    >
      <div className="flex gap-3">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium flex-shrink-0">
          {conversation.participant_name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-baseline">
            <h4 className="font-medium truncate">
              {conversation.participant_name}
            </h4>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {formatMessageTime(conversation.last_message_time)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground truncate mt-1">
            {truncateText(conversation.last_message, 40)}
          </p>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-muted-foreground">
              {truncateText(conversation.order_description, 25)}
            </span>
            {conversation.unread_count > 0 && (
              <Badge variant="default" className="ml-1">
                {conversation.unread_count}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
