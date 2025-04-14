
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Conversation {
  order_id: string;
  order_description: string;
  participant_id: string;
  participant_name: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export function useChatConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        setLoading(true);

        // Query to get the most recent message for each order the user is involved in
        const { data: ordersData, error: ordersError } = await supabase.rpc(
          'get_user_conversations', 
          { user_id_param: user.id }
        );

        if (ordersError) {
          // If the function doesn't exist, we'll use a more manual approach
          console.warn('RPC function not found, using alternative method:', ordersError);
          
          // Get all orders where the user is either sender or receiver of messages
          const { data: messagesData, error: messagesError } = await supabase
            .from('messages')
            .select(`
              order_id,
              sender_id,
              recipient_id,
              content,
              sent_at,
              read,
              orders:order_id(description)
            `)
            .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
            .order('sent_at', { ascending: false });
          
          if (messagesError) throw messagesError;
          
          // Group by order_id to get conversations
          const ordersMap = new Map<string, any>();
          
          for (const msg of messagesData) {
            if (!ordersMap.has(msg.order_id)) {
              const partnerId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
              
              // Get partner user info
              const { data: partnerData } = await supabase
                .from('users')
                .select('name')
                .eq('user_id', partnerId)
                .single();
              
              // Count unread messages
              const unreadCount = messagesData.filter(
                m => m.order_id === msg.order_id && 
                     m.recipient_id === user.id && 
                     !m.read
              ).length;
              
              ordersMap.set(msg.order_id, {
                order_id: msg.order_id,
                order_description: msg.orders?.description || 'No description',
                participant_id: partnerId,
                participant_name: partnerData?.name || 'Unknown User',
                last_message: msg.content,
                last_message_time: msg.sent_at,
                unread_count: unreadCount
              });
            }
          }
          
          setConversations(Array.from(ordersMap.values()));
        } else {
          // Use the result from the RPC function
          setConversations(ordersData);
        }
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching conversations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // Subscribe to new messages for realtime updates
    const channel = supabase
      .channel('user-inbox')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `recipient_id=eq.${user.id}`,
      }, () => {
        // When a new message arrives, refresh conversations
        fetchConversations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    conversations,
    loading,
    error,
    refresh: () => setLoading(true) // Trigger a refresh
  };
}
