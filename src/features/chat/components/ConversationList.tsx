
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Conversation } from "@/features/chat/hooks/use-chat-conversations";
import { ConversationItem } from "./ConversationItem";
import { ConversationEmptyState } from "./ConversationEmptyState";

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
            <ConversationEmptyState />
          ) : (
            filteredConversations.map((conv) => (
              <ConversationItem
                key={`${conv.order_id}-${conv.participant_id}`}
                conversation={conv}
                isSelected={selectedConversation === conv.order_id}
                onSelect={onConversationSelect}
              />
            ))
          )}
        </ScrollArea>
      )}
    </div>
  );
};
