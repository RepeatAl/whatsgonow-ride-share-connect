import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';
import { OrderFormData } from '@/types/order';

export const useCreateOrderSubmit = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useSimpleAuth();

  const handleSubmit = async (data: OrderFormData) => {
    if (!user) {
      toast({
        title: 'Nicht angemeldet',
        description: 'Bitte melde dich an, um eine Bestellung aufzugeben.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('orders').insert([
        {
          ...data,
          user_id: user.id,
          status: 'pending',
        },
      ]);

      if (error) {
        console.error('Fehler beim Erstellen der Bestellung:', error);
        toast({
          title: 'Fehler',
          description: 'Beim Erstellen der Bestellung ist ein Fehler aufgetreten.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Bestellung aufgegeben',
          description: 'Deine Bestellung wurde erfolgreich aufgegeben!',
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Unerwarteter Fehler beim Erstellen der Bestellung:', error);
      toast({
        title: 'Unerwarteter Fehler',
        description: 'Es ist ein unerwarteter Fehler aufgetreten.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading };
};
