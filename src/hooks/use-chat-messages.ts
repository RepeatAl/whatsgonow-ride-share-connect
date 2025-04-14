
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Message {
  message_id: string;
  order_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  sent_at: string;
  read: boolean;
  senderName?: string;
  isCurrentUser: boolean;
}

export function useChatMessages(orderId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!orderId || !user) return;
    
    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        setLoading(true);
        
        // Get messages for this order
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select(`
            *,
            sender:sender_id(name)
          `)
          .eq('order_id', orderId)
          .order('sent_at', { ascending: true });
        
        if (messagesError) throw messagesError;
        
        // Mark received messages as read
        const messagesToUpdate = messagesData
          .filter(msg => msg.recipient_id === user.id && !msg.read)
          .map(msg => msg.message_id);
        
        if (messagesToUpdate.length > 0) {
          const { error: updateError } = await supabase
            .from('messages')
            .update({ read: true })
            .in('message_id', messagesToUpdate);
          
          if (updateError) console.error('Error marking messages as read:', updateError);
        }
        
        // Transform messages data
        const transformedMessages = messagesData.map(msg => ({
          ...msg,
          senderName: msg.sender?.name || 'Unknown User',
          isCurrentUser: msg.sender_id === user.id
        }));
        
        setMessages(transformedMessages);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching messages:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Set up realtime subscription
    const channel = supabase
      .channel(`order-${orderId}-messages`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `order_id=eq.${orderId}`,
      }, async (payload) => {
        const newMessage = payload.new as any;
        
        // Fetch sender name
        const { data: senderData } = await supabase
          .from('users')
          .select('name')
          .eq('user_id', newMessage.sender_id)
          .single();
        
        const messageWithSender = {
          ...newMessage,
          senderName: senderData?.name || 'Unknown User',
          isCurrentUser: newMessage.sender_id === user.id
        };
        
        setMessages(prev => [...prev, messageWithSender]);
        
        // Mark as read if recipient is current user
        if (newMessage.recipient_id === user.id) {
          const { error: updateError } = await supabase
            .from('messages')
            .update({ read: true })
            .eq('message_id', newMessage.message_id);
          
          if (updateError) console.error('Error marking message as read:', updateError);
          
          // Show a toast notification for new messages
          if (newMessage.sender_id !== user.id) {
            toast({
              title: `New message from ${messageWithSender.senderName}`,
              description: newMessage.content.substring(0, 50) + (newMessage.content.length > 50 ? '...' : ''),
            });
          }
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, user, toast]);
  
  const sendMessage = async (content: string, recipientId: string) => {
    if (!user || !orderId || !content.trim()) return null;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          order_id: orderId,
          sender_id: user.id,
          recipient_id: recipientId,
          content: content.trim(),
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err as Error);
      console.error('Error sending message:', err);
      return null;
    }
  };
  
  const markAsRead = async (messageId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('message_id', messageId)
        .eq('recipient_id', user.id);
      
      if (error) throw error;
      
      setMessages(prev => prev.map(msg => 
        msg.message_id === messageId ? { ...msg, read: true } : msg
      ));
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };
  
  return {
    messages,
    loading,
    error,
    sendMessage,
    markAsRead
  };
}
