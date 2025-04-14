
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

export interface Offer {
  offer_id: string;
  order_id: string;
  driver_id: string;
  price: number;
  status: 'eingereicht' | 'angenommen' | 'abgelehnt';
  created_at: string;
}

export const useDealOffers = (order_id: string, user: User | null) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOffers = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('order_id', order_id);

      if (error) throw error;
      setOffers(data as Offer[] || []);
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Angebote konnten nicht geladen werden',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const submitOffer = async (price: number) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('offers')
        .insert({
          order_id,
          driver_id: user.id,
          price,
          status: 'eingereicht'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Angebot eingereicht',
        description: `Dein Angebot für €${price} wurde übermittelt`,
      });

      return data as Offer;
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Angebot konnte nicht eingereicht werden',
        variant: 'destructive'
      });
      return null;
    }
  };

  const updateOfferStatus = async (offerId: string, status: 'angenommen' | 'abgelehnt') => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .update({ status })
        .eq('offer_id', offerId)
        .select()
        .single();

      if (error) throw error;

      // Update order status if offer is accepted
      if (status === 'angenommen') {
        await supabase
          .from('orders')
          .update({ status: 'matched' })
          .eq('order_id', order_id);
      }

      toast({
        title: status === 'angenommen' ? 'Angebot angenommen' : 'Angebot abgelehnt',
        description: `Der Status des Angebots wurde aktualisiert`,
      });

      return data as Offer;
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Angebotsstatus konnte nicht aktualisiert werden',
        variant: 'destructive'
      });
      return null;
    }
  };

  useEffect(() => {
    fetchOffers();

    // Real-time subscription for offer updates
    const channel = supabase
      .channel('offers')
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'offers',
          filter: `order_id=eq.${order_id}`
        },
        (payload) => {
          fetchOffers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [order_id, user]);

  return { 
    offers, 
    loading, 
    submitOffer, 
    updateOfferStatus 
  };
};
