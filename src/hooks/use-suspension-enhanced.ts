
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';
import type { EnhancedSuspendUserOptions } from '@/types/suspension-enhanced';

export const useSuspensionEnhanced = () => {
  const [loading, setLoading] = useState(false);

  const suspendUser = async (options: EnhancedSuspendUserOptions): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('suspend-user-enhanced', {
        body: options
      });
      
      if (error) throw error;
      
      toast({
        title: 'Nutzer suspendiert',
        description: `Der Nutzer wurde erfolgreich suspendiert.`,
      });
      
      return true;
    } catch (error) {
      console.error('Enhanced suspension error:', error);
      toast({
        title: 'Fehler',
        description: 'Die Suspendierung konnte nicht durchgeführt werden.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unsuspendUser = async (userId: string, notes?: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('unsuspend-user-enhanced', {
        body: { user_id: userId, notes }
      });
      
      if (error) throw error;
      
      toast({
        title: 'Nutzer entsperrt',
        description: `Der Nutzer wurde erfolgreich entsperrt.`,
      });
      
      return true;
    } catch (error) {
      console.error('Enhanced unsuspension error:', error);
      toast({
        title: 'Fehler',
        description: 'Die Entsperrung konnte nicht durchgeführt werden.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    suspendUser,
    unsuspendUser,
    loading
  };
};
