
import React, { createContext, useContext, useEffect } from "react";
import { useOptimizedAuth } from "@/contexts/OptimizedAuthContext";
import { useToast } from "@/hooks/use-toast";
import { useUnreadMessages } from "@/features/chat/hooks/use-unread-messages";
import { useMessageSubscription } from "@/features/chat/hooks/use-message-subscription";
import { useChatContextState } from "@/features/chat/hooks/use-chat-context-state";

type ChatRealtimeContextType = {
  unreadCount: number;
  resetUnreadCount: () => Promise<void>;
  activeOrderId: string | null;
  setActiveOrderId: (orderId: string | null) => void;
};

const ChatRealtimeContext = createContext<ChatRealtimeContextType>({
  unreadCount: 0,
  resetUnreadCount: async () => {},
  activeOrderId: null,
  setActiveOrderId: () => {},
});

export const useChatRealtime = () => useContext(ChatRealtimeContext);

export const ChatRealtimeProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useOptimizedAuth();
  const { toast } = useToast();
  const { unreadCount, fetchUnreadCount, resetUnreadCount, markMessagesAsRead } = useUnreadMessages();
  const { activeOrderId, setActiveOrderId } = useChatContextState();

  // Display toast notification for new messages
  const showMessageToast = ({ message, senderName }: { message: any, senderName: string }) => {
    toast({
      title: `New message from ${senderName}`,
      description: message.content.length > 50 
        ? `${message.content.substring(0, 50)}...` 
        : message.content,
      duration: 5000,
      action: (
        <button 
          onClick={() => window.location.href = `/inbox/${message.order_id}`}
          className="p-2 rounded-md bg-primary text-primary-foreground text-xs"
        >
          View
        </button>
      ),
    });
  };

  // Set up real-time message subscription
  useMessageSubscription({ 
    activeOrderId, 
    showToast: showMessageToast 
  });

  // Fetch unread count on load
  useEffect(() => {
    if (user) {
      fetchUnreadCount();
    }
  }, [user]);

  // Mark messages as read when user enters a chat
  useEffect(() => {
    if (user && activeOrderId) {
      markMessagesAsRead(activeOrderId);
    }
  }, [user, activeOrderId]);

  const value = {
    unreadCount,
    resetUnreadCount,
    activeOrderId,
    setActiveOrderId,
  };

  return (
    <ChatRealtimeContext.Provider value={value}>
      {children}
    </ChatRealtimeContext.Provider>
  );
};
