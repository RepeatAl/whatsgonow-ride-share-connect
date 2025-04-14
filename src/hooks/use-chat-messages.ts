
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessage {
  message_id: string;
  order_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  sent_at: string;
  read: boolean;
  isCurrentUser: boolean;
  senderName?: string;
}

export function useChatMessages(orderId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  // Function to fetch messages
  const fetchMessages = async () => {
    if (!user || !orderId) return;

    try {
      setLoading(true);
      
      // Query messages for this order
      const { data, error: messagesError } = await supabase
        .from('messages')
        .select(`
          message_id,
          order_id,
          sender_id,
          recipient_id,
          content,
          sent_at,
          read,
          sender:sender_id(name)
        `)
        .eq('order_id', orderId)
        .order('sent_at', { ascending: true });
      
      if (messagesError) throw messagesError;
      
      // Mark unread messages as read if user is recipient
      const unreadMessages = (data || []).filter(
        msg => msg.recipient_id === user.id && !msg.read
      );
      
      if (unreadMessages.length > 0) {
        await Promise.all(
          unreadMessages.map(msg => 
            supabase
              .from('messages')
              .update({ read: true })
              .eq('message_id', msg.message_id)
          )
        );
      }
      
      // Process messages with sender info
      const processedMessages = (data || []).map(msg => ({
        ...msg,
        isCurrentUser: msg.sender_id === user.id,
        senderName: msg.sender?.name || 'Unknown User',
      }));
      
      setMessages(processedMessages);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to send a new message
  const sendMessage = async (content: string, recipientId: string) => {
    if (!user || !orderId || !content.trim() || !recipientId) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          order_id: orderId,
          sender_id: user.id,
          recipient_id: recipientId,
          content: content.trim(),
        });
      
      if (error) throw error;
      
      // No need to manually refresh - realtime will handle it
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  };

  // Initial fetch and subscribe to updates
  useEffect(() => {
    if (!user || !orderId) {
      setLoading(false);
      return;
    }
    
    // Initial fetch
    fetchMessages();
    
    // Subscribe to new messages
    const channel = supabase
      .channel(`order-chat-${orderId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `order_id=eq.${orderId}`,
      }, () => {
        fetchMessages();
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `order_id=eq.${orderId}`,
      }, () => {
        fetchMessages();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, orderId]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    refresh: fetchMessages
  };
}
