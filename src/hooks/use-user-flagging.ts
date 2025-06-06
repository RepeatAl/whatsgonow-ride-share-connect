import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';

interface FlaggingOptions {
  reason: string;
}

export function useUserFlagging() {
  const [loading, setLoading] = useState(false);
  const { profile } = useOptimizedAuth();
  
  // Check if current user has permission to flag
  const canFlag = profile?.role && ['cm', 'admin', 'super_admin'].includes(profile.role);
  
  const flagUser = async (userId: string, options: FlaggingOptions) => {
    if (!canFlag) {
      toast({
        title: "Zugriff verweigert",
        description: "Nur Community Manager und Admins können Nutzer markieren",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('flag_user', {
        target_user_id: userId,
        flag_reason: options.reason
      });
      
      if (error) throw error;
      
      toast({
        title: "Nutzer markiert",
        description: "Der Nutzer wurde erfolgreich als kritisch markiert.",
      });
      
      return true;
    } catch (err) {
      console.error('Error flagging user:', err);
      toast({
        title: "Fehler",
        description: `Nutzer konnte nicht markiert werden: ${(err as Error).message}`,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const unflagUser = async (userId: string) => {
    if (!canFlag) {
      toast({
        title: "Zugriff verweigert",
        description: "Nur Community Manager und Admins können Markierungen entfernen",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('unflag_user', {
        target_user_id: userId
      });
      
      if (error) throw error;
      
      toast({
        title: "Markierung entfernt",
        description: "Die Nutzer-Markierung wurde erfolgreich entfernt.",
      });
      
      return true;
    } catch (err) {
      console.error('Error unflagging user:', err);
      toast({
        title: "Fehler",
        description: `Markierung konnte nicht entfernt werden: ${(err as Error).message}`,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    flagUser,
    unflagUser,
    loading,
    canFlag
  };
}
