
import React from "react";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatBox } from "./ChatBox";
import { Conversation } from "@/features/chat/hooks/use-chat-conversations";

interface ChatContainerProps {
  selectedConversation: string | null;
  conversations: Conversation[];
  onBackToList: () => void;
}

export const ChatContainer = ({
  selectedConversation,
  conversations,
  onBackToList
}: ChatContainerProps) => {
  const conversation = conversations.find(c => c.order_id === selectedConversation);
  
  return (
    <div className={`md:col-span-2 ${selectedConversation ? "" : "hidden md:block"}`}>
      {selectedConversation ? (
        <div className="flex flex-col h-full border rounded-lg shadow-sm">
          <div className="md:hidden border-b p-2 sticky top-0 bg-background z-10">
            <Button variant="ghost" size="sm" onClick={onBackToList} className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zur Übersicht
            </Button>
          </div>
          <div className="flex-grow">
            {conversation && (
              <ChatBox
                orderId={conversation.order_id}
                recipientId={conversation.participant_id}
                userName={conversation.participant_name}
                orderDescription={conversation.order_description}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-col items-center justify-center h-full border rounded-lg p-6 text-center">
          <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">Wähle eine Konversation</h2>
          <p className="text-muted-foreground">
            Wähle eine Konversation aus der Liste aus, um mit dem Chatten zu beginnen
          </p>
        </div>
      )}
    </div>
  );
};
