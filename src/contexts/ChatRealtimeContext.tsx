
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  // Check if we're in a chat or inbox route
  const isInChatRoute = location.pathname.includes("/inbox");
  const currentOrderIdFromPath = isInChatRoute 
    ? location.pathname.split("/").filter(Boolean)[1] 
    : null;

  // Update active order ID when route changes
  useEffect(() => {
    if (currentOrderIdFromPath) {
      setActiveOrderId(currentOrderIdFromPath);
    } else if (isInChatRoute) {
      // Just in /inbox without specific order
      setActiveOrderId(null);
    }
  }, [location.pathname, currentOrderIdFromPath, isInChatRoute]);

  // Fetch unread count on load
  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        const { count, error } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("recipient_id", user.id)
          .eq("read", false);

        if (error) throw error;
        setUnreadCount(count || 0);
      } catch (error) {
        console.error("Error fetching unread messages count:", error);
      }
    };

    fetchUnreadCount();
  }, [user]);

  // Set up realtime subscription for new messages
  useEffect(() => {
    if (!user) return;

    const handleNewMessage = async (payload: any) => {
      // Get message details
      const message = payload.new;
      
      // Only process if this user is the recipient
      if (message.recipient_id !== user.id) return;
      
      // Check if we're currently in the chat for this message
      const isViewingThisChat = activeOrderId === message.order_id;
      
      if (isViewingThisChat) {
        // Mark as read immediately
        const { error } = await supabase
          .from("messages")
          .update({ read: true })
          .eq("id", message.id);
          
        if (error) console.error("Error marking message as read:", error);
      } else {
        // Update unread count
        setUnreadCount(prev => prev + 1);
        
        // Show toast notification
        try {
          // Fetch sender name
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("name")
            .eq("user_id", message.sender_id)
            .single();
            
          if (userError) throw userError;
          
          const senderName = userData?.name || "Someone";
          
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
        } catch (error) {
          console.error("Error showing message notification:", error);
        }
      }
    };

    // Subscribe to all message inserts
    const channel = supabase
      .channel("chat-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `recipient_id=eq.${user.id}`,
        },
        handleNewMessage
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, activeOrderId, toast]);

  // Mark messages as read when user enters a chat
  useEffect(() => {
    if (!user || !activeOrderId) return;

    const markMessagesAsRead = async () => {
      try {
        const { error } = await supabase
          .from("messages")
          .update({ read: true })
          .eq("recipient_id", user.id)
          .eq("order_id", activeOrderId)
          .eq("read", false);

        if (error) throw error;
        
        // Refresh unread count after marking messages as read
        const { count, error: countError } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("recipient_id", user.id)
          .eq("read", false);

        if (countError) throw countError;
        setUnreadCount(count || 0);
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    };

    markMessagesAsRead();
  }, [user, activeOrderId]);

  // Function to manually reset unread count
  const resetUnreadCount = async () => {
    if (!user) return;
    
    try {
      // Mark all messages as read
      const { error } = await supabase
        .from("messages")
        .update({ read: true })
        .eq("recipient_id", user.id)
        .eq("read", false);

      if (error) throw error;
      
      // Reset count
      setUnreadCount(0);
    } catch (error) {
      console.error("Error resetting unread count:", error);
    }
  };

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
