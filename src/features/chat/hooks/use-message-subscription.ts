
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUnreadMessages } from "./use-unread-messages";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";

interface UseMessageSubscriptionProps {
  activeOrderId: string | null;
  showToast: (message: any) => void;
}

export function useMessageSubscription({ 
  activeOrderId, 
  showToast 
}: UseMessageSubscriptionProps) {
  const { user } = useSimpleAuth();
  const { setUnreadCount } = useUnreadMessages();

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
          
          showToast({
            message,
            senderName
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
  }, [user, activeOrderId, showToast, setUnreadCount]);
}
