
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { SuspendUserOptions, UserSuspension, SuspendedUserInfo, SuspensionStatus } from '@/types/suspension';

export function useSuspension() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { profile } = useAuth();
  
  // Role-based permissions
  const canViewSuspensions = profile?.role && ['cm', 'admin', 'super_admin'].includes(profile.role);
  const canSuspendUsers = profile?.role && ['admin', 'super_admin'].includes(profile.role);
  const canReactivateUsers = profile?.role && ['admin', 'super_admin'].includes(profile.role);

  const fetchUserSuspensionStatus = async (userId: string): Promise<SuspensionStatus> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('is_suspended, suspended_until, suspension_reason')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      
      return {
        is_suspended: data.is_suspended || false,
        suspended_until: data.suspended_until || null,
        suspension_reason: data.suspension_reason || null
      };
    } catch (err) {
      console.error('Error fetching user suspension status:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return {
        is_suspended: false,
        suspended_until: null,
        suspension_reason: null
      };
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSuspensionHistory = async (userId: string): Promise<UserSuspension[]> => {
    if (!canViewSuspensions) {
      toast({
        title: "Zugriff verweigert",
        description: "Sie haben keine Berechtigung, Suspendierungsverläufe anzusehen",
        variant: "destructive"
      });
      return [];
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('user_suspensions')
        .select('*')
        .eq('user_id', userId)
        .order('suspended_at', { ascending: false });
      
      if (error) throw error;
      
      return data as UserSuspension[];
    } catch (err) {
      console.error('Error fetching suspension history:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchSuspendedUsers = async (filters?: { status?: 'active' | 'expired' | 'all', type?: string }): Promise<SuspendedUserInfo[]> => {
    if (!canViewSuspensions) {
      toast({
        title: "Zugriff verweigert",
        description: "Sie haben keine Berechtigung, suspendierte Nutzer anzusehen",
        variant: "destructive"
      });
      return [];
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const filterJson = filters ? JSON.stringify(filters) : '{}';
      
      const { data, error } = await supabase
        .rpc('get_suspended_users', { filter_json: filterJson });
      
      if (error) throw error;
      
      return data as SuspendedUserInfo[];
    } catch (err) {
      console.error('Error fetching suspended users:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return [];
    } finally {
      setLoading(false);
    }
  };

  const suspendUser = async (options: SuspendUserOptions): Promise<boolean> => {
    if (!canSuspendUsers) {
      toast({
        title: "Zugriff verweigert",
        description: "Sie haben keine Berechtigung, Nutzer zu suspendieren",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.rpc('suspend_user', {
        target_user_id: options.user_id,
        reason: options.reason,
        duration: options.duration || null,
        suspension_type: options.suspension_type || 'hard'
      });
      
      if (error) throw error;
      
      toast({
        title: "Nutzer suspendiert",
        description: "Der Nutzer wurde erfolgreich suspendiert",
      });
      
      return true;
    } catch (err) {
      console.error('Error suspending user:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      
      toast({
        title: "Fehler",
        description: `Nutzer konnte nicht suspendiert werden: ${(err as Error).message}`,
        variant: "destructive"
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reactivateUser = async (userId: string, notes?: string): Promise<boolean> => {
    if (!canReactivateUsers) {
      toast({
        title: "Zugriff verweigert",
        description: "Sie haben keine Berechtigung, Nutzer zu reaktivieren",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.rpc('reactivate_user', {
        target_user_id: userId,
        notes: notes || null
      });
      
      if (error) throw error;
      
      toast({
        title: "Nutzer reaktiviert",
        description: "Der Nutzer wurde erfolgreich reaktiviert",
      });
      
      return true;
    } catch (err) {
      console.error('Error reactivating user:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      
      toast({
        title: "Fehler",
        description: `Nutzer konnte nicht reaktiviert werden: ${(err as Error).message}`,
        variant: "destructive"
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    fetchUserSuspensionStatus,
    fetchUserSuspensionHistory,
    fetchSuspendedUsers,
    suspendUser,
    reactivateUser,
    loading,
    error,
    canViewSuspensions,
    canSuspendUsers,
    canReactivateUsers
  };
}
