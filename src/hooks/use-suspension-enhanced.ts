
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import type { SuspendUserOptions, UserSuspension, SuspendedUserInfo, SuspensionStatus } from '@/types/suspension';

// Enhanced suspension hook with audit logging and better status checking
export function useSuspensionEnhanced() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { profile } = useSimpleAuth();
  
  // Role-based permissions
  const canViewSuspensions = profile?.role && ['cm', 'admin', 'super_admin'].includes(profile.role);
  const canSuspendUsers = profile?.role && ['admin', 'super_admin'].includes(profile.role);
  const canReactivateUsers = profile?.role && ['admin', 'super_admin'].includes(profile.role);

  // Enhanced status check that considers current suspension state
  const fetchUserSuspensionStatus = async (userId: string): Promise<SuspensionStatus & { isCurrentlySuspended: boolean }> => {
    try {
      setLoading(true);
      setError(null);
      
      // Get current profile suspension status
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('is_suspended, suspended_until, suspension_reason')
        .eq('user_id', userId)
        .single();
      
      if (profileError) throw profileError;
      
      // Check for active suspension records
      const { data: suspensionData, error: suspensionError } = await supabase
        .from('user_suspensions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('suspended_at', { ascending: false })
        .limit(1);
      
      if (suspensionError && suspensionError.code !== 'PGRST116') {
        throw suspensionError;
      }
      
      const activeSuspension = suspensionData?.[0];
      const now = new Date();
      
      // Determine if user is currently suspended
      let isCurrentlySuspended = false;
      
      if (activeSuspension) {
        if (!activeSuspension.suspended_until) {
          // Permanent suspension
          isCurrentlySuspended = true;
        } else {
          // Temporary suspension - check if still active
          const suspendedUntil = new Date(activeSuspension.suspended_until);
          isCurrentlySuspended = suspendedUntil > now;
        }
      }
      
      return {
        is_suspended: profileData.is_suspended || false,
        suspended_until: profileData.suspended_until || null,
        suspension_reason: profileData.suspension_reason || null,
        isCurrentlySuspended
      };
    } catch (err) {
      console.error('Error fetching user suspension status:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return {
        is_suspended: false,
        suspended_until: null,
        suspension_reason: null,
        isCurrentlySuspended: false
      };
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

  const suspendUser = async (options: SuspendUserOptions & { 
    reasonCode?: string; 
    auditNotes?: string;
  }): Promise<boolean> => {
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
      
      // Convert duration string to PostgreSQL interval if provided
      let durationInterval = null;
      if (options.duration) {
        durationInterval = options.duration;
      }
      
      const { data, error } = await supabase.rpc('suspend_user', {
        target_user_id: options.user_id,
        reason: options.reason,
        duration: durationInterval,
        suspension_type: options.suspension_type || 'hard'
      });
      
      if (error) throw error;
      
      // Log audit entry
      await logSuspensionAudit({
        action: 'suspend',
        targetUserId: options.user_id,
        reason: options.reason,
        reasonCode: options.reasonCode,
        suspensionType: options.suspension_type || 'hard',
        duration: options.duration,
        notes: options.auditNotes
      });
      
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
      
      // Log audit entry
      await logSuspensionAudit({
        action: 'reactivate',
        targetUserId: userId,
        notes
      });
      
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

  // Audit logging function
  const logSuspensionAudit = async (auditData: {
    action: 'suspend' | 'reactivate';
    targetUserId: string;
    reason?: string;
    reasonCode?: string;
    suspensionType?: string;
    duration?: string;
    notes?: string;
  }) => {
    try {
      await supabase
        .from('system_logs')
        .insert({
          entity_type: 'user',
          entity_id: auditData.targetUserId,
          event_type: `user_${auditData.action}`,
          actor_id: profile?.user_id || 'unknown',
          severity: 'INFO',
          metadata: {
            action: auditData.action,
            reason: auditData.reason,
            reason_code: auditData.reasonCode,
            suspension_type: auditData.suspensionType,
            duration: auditData.duration,
            notes: auditData.notes,
            timestamp: new Date().toISOString()
          },
          visible_to: ['admin', 'super_admin']
        });
    } catch (auditError) {
      console.error('Failed to log suspension audit:', auditError);
      // Don't fail the main operation if audit logging fails
    }
  };
  
  return {
    fetchUserSuspensionStatus,
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
