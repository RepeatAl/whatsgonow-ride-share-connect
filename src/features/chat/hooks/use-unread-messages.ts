
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";

export function useUnreadMessages() {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useSimpleAuth();

  const fetchUnreadCount = async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

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

  const markMessagesAsRead = async (orderId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("messages")
        .update({ read: true })
        .eq("recipient_id", user.id)
        .eq("order_id", orderId)
        .eq("read", false);

      if (error) throw error;
      
      // Refresh unread count after marking messages as read
      await fetchUnreadCount();
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  return {
    unreadCount,
    fetchUnreadCount,
    resetUnreadCount,
    markMessagesAsRead,
    setUnreadCount
  };
}
