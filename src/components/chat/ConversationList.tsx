
import React, { useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { MessageSquare, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Conversation } from "@/hooks/use-chat-conversations";

interface ConversationListProps {
  conversations: Conversation[];
  loading: boolean;
  selectedConversation: string | null;
  onConversationSelect: (conversationId: string) => void;
}

export const ConversationList = ({
  conversations,
  loading,
  selectedConversation,
  onConversationSelect
}: ConversationListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.participant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.order_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.last_message.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className="md:col-span-1 border rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Konversationen durchsuchen..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100%-69px)]">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg mb-1">Keine Nachrichten</h3>
              <p className="text-muted-foreground text-sm">
                Starte einen Chat mit einem Transporteur oder Versender
              </p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={`${conv.order_id}-${conv.participant_id}`}
                className={`p-4 border-b hover:bg-accent cursor-pointer transition-colors ${
                  selectedConversation === conv.order_id ? "bg-accent" : ""
                }`}
                onClick={() => onConversationSelect(conv.order_id)}
              >
                <div className="flex gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium flex-shrink-0">
                    {conv.participant_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-medium truncate">
                        {conv.participant_name}
                      </h4>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {formatMessageTime(conv.last_message_time)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {truncateText(conv.last_message, 40)}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-muted-foreground">
                        {truncateText(conv.order_description, 25)}
                      </span>
                      {conv.unread_count > 0 && (
                        <Badge variant="default" className="ml-1">
                          {conv.unread_count}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      )}
    </div>
  );
};
