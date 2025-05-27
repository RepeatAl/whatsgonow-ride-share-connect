import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';

export interface Escalation {
  id: string;
  user_id: string;
  escalation_type: string;
  trigger_reason: string;
  triggered_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
  notes: string | null;
  metadata: Record<string, any>;
  user_name?: string;
}

export interface EscalationFilter {
  status?: 'active' | 'resolved' | 'all';
  type?: string;
  userId?: string;
}

export interface EscalationStatus {
  hasActiveEscalation: boolean;
  isPreSuspended: boolean;
  preSuspendReason: string | null;
  preSuspendAt: string | null;
}

export function useEscalation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { profile } = useSimpleAuth();
  
  // Role-based permissions
  const canViewEscalations = profile?.role && ['cm', 'admin', 'super_admin'].includes(profile.role);
  const canPreSuspend = profile?.role && ['cm', 'admin', 'super_admin'].includes(profile.role);
  const canResolve = profile?.role && ['admin', 'super_admin'].includes(profile.role);
  
  const fetchEscalations = async (filters: EscalationFilter = {}) => {
    if (!canViewEscalations) {
      toast({
        title: "Zugriff verweigert",
        description: "Sie haben keine Berechtigung, Eskalationen einzusehen",
        variant: "destructive"
      });
      return [];
    }
    
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('escalation_log')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name
          )
        `);
      
      // Apply filters
      if (filters.status === 'active') {
        query = query.is('resolved_at', null);
      } else if (filters.status === 'resolved') {
        query = query.not('resolved_at', 'is', null);
      }
      
      if (filters.type) {
        query = query.eq('escalation_type', filters.type);
      }
      
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      
      // Order by most recent first
      query = query.order('triggered_at', { ascending: false });
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      
      // Format user names
      const formattedData = data.map(item => ({
        ...item,
        user_name: item.profiles ? 
          `${item.profiles.first_name} ${item.profiles.last_name}` : 
          'Unbekannter Benutzer'
      }));
      
      return formattedData as Escalation[];
    } catch (err) {
      console.error('Error fetching escalations:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchUserEscalationStatus = async (userId: string): Promise<EscalationStatus> => {
    if (!canViewEscalations) {
      return { 
        hasActiveEscalation: false, 
        isPreSuspended: false,
        preSuspendReason: null,
        preSuspendAt: null
      };
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Get profile pre-suspend status
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('is_pre_suspended, pre_suspend_reason, pre_suspend_at')
        .eq('user_id', userId)
        .single();
      
      if (profileError) throw profileError;
      
      // Get active escalation count
      const { count, error: countError } = await supabase
        .from('escalation_log')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .is('resolved_at', null);
      
      if (countError) throw countError;
      
      return {
        hasActiveEscalation: (count || 0) > 0,
        isPreSuspended: profileData.is_pre_suspended || false,
        preSuspendReason: profileData.pre_suspend_reason || null,
        preSuspendAt: profileData.pre_suspend_at || null
      };
    } catch (err) {
      console.error('Error fetching user escalation status:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return { 
        hasActiveEscalation: false, 
        isPreSuspended: false,
        preSuspendReason: null,
        preSuspendAt: null 
      };
    } finally {
      setLoading(false);
    }
  };

  const preSuspendUser = async (userId: string, reason: string) => {
    if (!canPreSuspend) {
      toast({
        title: "Zugriff verweigert",
        description: "Sie haben keine Berechtigung, Benutzer zu suspendieren",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: rpcError } = await supabase.rpc('pre_suspend_user', {
        target_user_id: userId,
        reason: reason
      });
      
      if (rpcError) throw rpcError;
      
      toast({
        title: "Benutzer vorläufig suspendiert",
        description: "Der Benutzer wurde erfolgreich zur Prüfung markiert",
      });
      
      return true;
    } catch (err) {
      console.error('Error pre-suspending user:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      
      toast({
        title: "Fehler",
        description: `Benutzer konnte nicht suspendiert werden: ${(err as Error).message}`,
        variant: "destructive"
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resolveEscalation = async (escalationId: string, notes: string) => {
    if (!canResolve) {
      toast({
        title: "Zugriff verweigert",
        description: "Nur Administratoren können Eskalationen auflösen",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: rpcError } = await supabase.rpc('resolve_escalation', {
        escalation_id: escalationId,
        resolution_notes: notes
      });
      
      if (rpcError) throw rpcError;
      
      toast({
        title: "Eskalation aufgelöst",
        description: "Die Eskalation wurde erfolgreich abgeschlossen",
      });
      
      return true;
    } catch (err) {
      console.error('Error resolving escalation:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      
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

  const evaluateUser = async (userId: string) => {
    if (!canViewEscalations) {
      return false;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: rpcError } = await supabase.rpc('evaluate_escalation', {
        target_user_id: userId
      });
      
      if (rpcError) throw rpcError;
      
      return data;
    } catch (err) {
      console.error('Error evaluating user:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    fetchEscalations,
    fetchUserEscalationStatus,
    preSuspendUser,
    resolveEscalation,
    evaluateUser,
    loading,
    error,
    canViewEscalations,
    canPreSuspend,
    canResolve
  };
}
