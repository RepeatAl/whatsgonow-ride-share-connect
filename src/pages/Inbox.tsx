
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { Search, MessageSquare, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useChatConversations } from "@/hooks/use-chat-conversations";
import { ChatBox } from "@/components/chat/ChatBox";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatRealtime } from "@/contexts/ChatRealtimeContext";

const Inbox = () => {
  const { conversations, loading, refresh } = useChatConversations();
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleBackToList = () => {
    setSelectedConversation(null);
    navigate("/inbox");
  };

  const handleConversationClick = (conversationId: string) => {
    setSelectedConversation(conversationId);
    setActiveOrderId(conversationId);
    navigate(`/inbox/${conversationId}`);
  };

  if (!user) {
    navigate("/login");
    return null;
  }

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
            <div className={`md:col-span-1 border rounded-lg shadow-sm ${
              selectedConversation ? "hidden md:block" : ""
            }`}>
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
                        onClick={() => handleConversationClick(conv.order_id)}
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

            {/* Chat Content */}
            <div className={`md:col-span-2 ${selectedConversation ? "" : "hidden md:block"}`}>
              {selectedConversation ? (
                <div className="flex flex-col h-full border rounded-lg shadow-sm">
                  <div className="md:hidden border-b p-2 sticky top-0 bg-background z-10">
                    <Button variant="ghost" size="sm" onClick={handleBackToList} className="flex items-center">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Zurück zur Übersicht
                    </Button>
                  </div>
                  <div className="flex-grow">
                    {(() => {
                      const conversation = conversations.find(
                        (c) => c.order_id === selectedConversation
                      );
                      if (!conversation) return null;
                      
                      return (
                        <ChatBox
                          orderId={conversation.order_id}
                          recipientId={conversation.participant_id}
                          userName={conversation.participant_name}
                          orderDescription={conversation.order_description}
                        />
                      );
                    })()}
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Inbox;
