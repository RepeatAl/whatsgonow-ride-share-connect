
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { useChatConversations } from "@/hooks/use-chat-conversations";
import { useAuth } from "@/contexts/AuthContext";
import { useChatRealtime } from "@/contexts/ChatRealtimeContext";
import { ConversationList } from "@/components/chat/ConversationList";
import { ChatContainer } from "@/components/chat/ChatContainer";

const Inbox = () => {
  const { conversations, loading, refresh } = useChatConversations();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const { resetUnreadCount, setActiveOrderId } = useChatRealtime();
  const orderIdFromUrl = params.orderId;

  useEffect(() => {
    // If there's an orderId in the URL, select that conversation
    if (orderIdFromUrl) {
      setSelectedConversation(orderIdFromUrl);
      setActiveOrderId(orderIdFromUrl);
    } else {
      setActiveOrderId(null);
    }

    // Reset unread count when entering the inbox
    resetUnreadCount();
  }, [orderIdFromUrl, resetUnreadCount, setActiveOrderId]);

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleConversationClick = (conversationId: string) => {
    setSelectedConversation(conversationId);
    setActiveOrderId(conversationId);
    navigate(`/inbox/${conversationId}`);
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
    navigate("/inbox");
  };

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-4 pt-8 pb-16">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold">Nachrichten</h1>
            <p className="text-muted-foreground mt-1">
              Kommuniziere mit Sendern und Fahrern zu deinen Aufträgen
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
            {/* Conversation List */}
            <div className={selectedConversation ? "hidden md:block" : ""}>
              <ConversationList
                conversations={conversations}
                loading={loading}
                selectedConversation={selectedConversation}
                onConversationSelect={handleConversationClick}
              />
            </div>

            {/* Chat Content */}
            <ChatContainer
              selectedConversation={selectedConversation}
              conversations={conversations}
              onBackToList={handleBackToList}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Inbox;
