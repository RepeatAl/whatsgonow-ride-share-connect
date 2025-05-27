import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';

export interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  order_id: string;
  sent_at: string;
  read: boolean;
  sender_name?: string;
  message_id?: string; // Added for compatibility with ChatBox
  isCurrentUser?: boolean; // Added for compatibility with ChatBox
}

export function useChatMessages(orderId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useSimpleAuth();

  useEffect(() => {
    if (!user || !orderId) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        
        // Fetch messages for this order
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select(`
            *,
            users!sender_id(name)
          `)
          .eq('order_id', orderId)
          .order('sent_at', { ascending: true });
        
        if (messagesError) throw messagesError;
        
        // Mark messages as read if they were sent to current user
        const unreadMessages = messagesData?.filter(
          msg => msg.recipient_id === user.id && !msg.read
        ) || [];
        
        if (unreadMessages.length > 0) {
          const { error: updateError } = await supabase
            .from('messages')
            .update({ read: true })
            .in('id', unreadMessages.map(msg => msg.id));
          
          if (updateError) console.error("Error marking messages as read:", updateError);
        }
        
        // Format messages with sender name and additional properties for ChatBox
        const formattedMessages = messagesData?.map(msg => {
          // Safely access the sender name from the joined users table
          const senderObj = msg.users || {};
          const senderName = senderObj && typeof senderObj === 'object' 
            ? (senderObj as any).name || 'Unknown User'
            : 'Unknown User';
          
          return {
            ...msg,
            sender_name: senderName,
            message_id: msg.message_id || msg.id, // Ensure message_id is available
            isCurrentUser: msg.sender_id === user.id // Add isCurrentUser flag for ChatBox
          };
        }) || [];
        
        setMessages(formattedMessages);
      } catch (err) {
        setError(err as Error);
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Set up real-time subscription for new messages
    const channel = supabase
      .channel(`order-messages-${orderId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `order_id=eq.${orderId}`,
      }, 
      async (payload) => {
        // If the new message is for the current user, mark it as read immediately
        const newMessage = payload.new;
        if (newMessage.recipient_id === user.id) {
          const { error } = await supabase
            .from('messages')
            .update({ read: true })
            .eq('id', newMessage.id);
          
          if (error) {
            console.error("Error marking message as read:", error);
          }
        }
        
        // Refresh messages
        fetchMessages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, orderId]);

  // Function to send a new message
  const sendMessage = async (content: string, recipientId: string) => {
    if (!user || !content.trim() || !recipientId || !orderId) {
      return { error: new Error("Missing required information to send message") };
    }

    try {
      const newMessage = {
        order_id: orderId,
        sender_id: user.id,
        recipient_id: recipientId,
        content: content.trim(),
        read: false,
      };

      const { data, error } = await supabase
        .from('messages')
        .insert(newMessage)
        .select('*')
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (err) {
      console.error("Error sending message:", err);
      return { data: null, error: err as Error };
    }
  };

  // Function to manually mark messages as read
  const markAsRead = async () => {
    if (!user || !orderId) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('recipient_id', user.id)
        .eq('order_id', orderId)
        .eq('read', false);
      
      if (error) throw error;
      
      // Update local messages state to reflect the change
      setMessages(prev => 
        prev.map(msg => 
          msg.recipient_id === user.id ? { ...msg, read: true } : msg
        )
      );
      
      return { success: true, error: null };
    } catch (err) {
      console.error("Error marking messages as read:", err);
      return { success: false, error: err as Error };
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    markAsRead,
  };
}
