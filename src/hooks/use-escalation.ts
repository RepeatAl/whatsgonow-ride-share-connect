
import { useState } from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useEscalation() {
  const [loading, setLoading] = useState(false);
  const { profile } = useSimpleAuth();
  
  // Check if current user has permission to escalate
  const canPreSuspend = profile?.role && ['cm', 'admin', 'super_admin'].includes(profile.role);
  
  const preSuspendUser = async (userId: string, reason: string) => {
    if (!canPreSuspend) {
      toast({
        title: "Zugriff verweigert",
        description: "Nur Community Manager und Admins können Nutzer eskalieren",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('pre_suspend_user', {
        target_user_id: userId,
        suspend_reason: reason
      });
      
      if (error) throw error;
      
      toast({
        title: "Nutzer eskaliert",
        description: "Der Nutzer wurde erfolgreich zur Prüfung eskaliert.",
      });
      
      return true;
    } catch (err) {
      console.error('Error pre-suspending user:', err);
      toast({
        title: "Fehler",
        description: `Nutzer konnte nicht eskaliert werden: ${(err as Error).message}`,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const resolveEscalation = async (escalationId: string, notes: string) => {
    if (!canPreSuspend) {
      toast({
        title: "Zugriff verweigert",
        description: "Nur Community Manager und Admins können Eskalationen auflösen",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('resolve_escalation', {
        escalation_id: escalationId,
        resolution_notes: notes
      });
      
      if (error) throw error;
      
      toast({
        title: "Eskalation aufgelöst",
        description: "Die Eskalation wurde erfolgreich aufgelöst.",
      });
      
      return true;
    } catch (err) {
      console.error('Error resolving escalation:', err);
      toast({
        title: "Fehler",
        description: `Eskalation konnte nicht aufgelöst werden: ${(err as Error).message}`,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    preSuspendUser,
    resolveEscalation,
    loading,
    canPreSuspend
  };
}
