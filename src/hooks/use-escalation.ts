import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import { toast } from '@/hooks/use-toast';
import { EscalationStatus, Escalation, EscalationFilter } from '@/types/escalation';

export type { EscalationStatus, Escalation, EscalationFilter };

export function useEscalation() {
  const [loading, setLoading] = useState(false);
  const { profile } = useOptimizedAuth();
  
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

  const fetchUserEscalationStatus = async (userId: string): Promise<EscalationStatus> => {
    try {
      const { data, error } = await supabase
        .from('escalation_log')
        .select('*')
        .eq('user_id', userId)
        .is('resolved_at', null)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching escalation status:', error);
      }

      const status: EscalationStatus = {
        hasActiveEscalation: !!data,
        isPreSuspended: data?.escalation_type === 'pre_suspend',
        preSuspendReason: data?.trigger_reason || null,
        preSuspendAt: data?.triggered_at || null
      };

      return status;
    } catch (err) {
      console.error('Error fetching escalation status:', err);
      return {
        hasActiveEscalation: false,
        isPreSuspended: false,
        preSuspendReason: null,
        preSuspendAt: null
      };
    }
  };

  const evaluateUser = async (userId: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('evaluate_user_for_escalation', {
        target_user_id: userId
      });
      
      if (error) throw error;
      
      toast({
        title: "Nutzer evaluiert",
        description: "Die automatische Prüfung wurde durchgeführt.",
      });
      
      return data;
    } catch (err) {
      console.error('Error evaluating user:', err);
      toast({
        title: "Fehler",
        description: "Fehler bei der Nutzer-Evaluation",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchEscalations = async (filter?: EscalationFilter): Promise<Escalation[]> => {
    try {
      let query = supabase
        .from('escalation_log')
        .select('*')
        .order('triggered_at', { ascending: false });

      if (filter?.status === 'pending' || filter?.status === 'active') {
        query = query.is('resolved_at', null);
      } else if (filter?.status === 'resolved') {
        query = query.not('resolved_at', 'is', null);
      }

      if (filter?.escalation_type || filter?.type) {
        query = query.eq('escalation_type', filter.escalation_type || filter.type);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data?.map(item => ({
        ...item,
        user_name: item.user_name || 'Unknown User'
      })) || [];
    } catch (err) {
      console.error('Error fetching escalations:', err);
      return [];
    }
  };

  const canResolve = canPreSuspend;
  
  return {
    preSuspendUser,
    resolveEscalation,
    fetchUserEscalationStatus,
    evaluateUser,
    fetchEscalations,
    loading,
    canPreSuspend,
    canResolve
  };
}
