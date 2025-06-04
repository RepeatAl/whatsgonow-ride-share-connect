
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';
import type { 
  EnhancedSuspendUserOptions, 
  SuspensionReasonCode,
  SuspensionType,
  UserSuspension,
  SuspendedUserInfo
} from '@/types/suspension';

export const useSuspension = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suspendUser = async (options: EnhancedSuspendUserOptions): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      console.log('🚫 Starting user suspension:', options.user_id);

      // Update user profile directly (no more SECURITY DEFINER view)
      const { error: suspendError } = await supabase
        .from('profiles')
        .update({
          is_suspended: true,
          suspended_until: options.duration ? new Date(Date.now() + parseDuration(options.duration)).toISOString() : null,
          suspension_reason: options.reason
        })
        .eq('user_id', options.user_id);

      if (suspendError) {
        throw new Error(`Suspension failed: ${suspendError.message}`);
      }

      // Create audit entry with enhanced data
      const { error: auditError } = await supabase
        .from('user_flag_audit')
        .insert({
          user_id: options.user_id,
          flagged: true,
          reason: `${options.reasonCode}: ${options.reason}`,
          actor_id: (await supabase.auth.getUser()).data.user?.id,
          role: 'admin'
        });

      if (auditError) {
        console.warn('⚠️ Audit logging failed:', auditError);
      }

      console.log('✅ User suspension completed');
      
      toast({
        title: "User gesperrt",
        description: `User wurde erfolgreich gesperrt: ${options.reasonCode}`,
        duration: 5000
      });

      return true;
    } catch (err: any) {
      console.error('❌ Suspension failed:', err);
      setError(err.message);
      
      toast({
        title: "Sperrung fehlgeschlagen",
        description: err.message,
        variant: "destructive"
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  const unsuspendUser = async (userId: string, reason?: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      console.log('✅ Starting user unsuspension:', userId);

      // Update profile directly (RLS-protected)
      const { error: unsuspendError } = await supabase
        .from('profiles')
        .update({
          is_suspended: false,
          suspended_until: null,
          suspension_reason: null
        })
        .eq('user_id', userId);

      if (unsuspendError) {
        throw new Error(`Unsuspension failed: ${unsuspendError.message}`);
      }

      // Create audit entry
      const { error: auditError } = await supabase
        .from('user_flag_audit')
        .insert({
          user_id: userId,
          flagged: false,
          reason: reason || 'Manual unsuspension by admin',
          actor_id: (await supabase.auth.getUser()).data.user?.id,
          role: 'admin'
        });

      if (auditError) {
        console.warn('⚠️ Audit logging failed:', auditError);
      }

      console.log('✅ User unsuspension completed');
      
      toast({
        title: "Sperrung aufgehoben",
        description: "User wurde erfolgreich entsperrt.",
        duration: 5000
      });

      return true;
    } catch (err: any) {
      console.error('❌ Unsuspension failed:', err);
      setError(err.message);
      
      toast({
        title: "Entsperrung fehlgeschlagen",
        description: err.message,
        variant: "destructive"
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  const reactivateUser = async (userId: string, reason?: string): Promise<boolean> => {
    return unsuspendUser(userId, reason);
  };

  const fetchUserSuspensionStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_suspended, suspended_until, suspension_reason')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      
      return data || { is_suspended: false, suspended_until: null, suspension_reason: null };
    } catch (err: any) {
      console.error('❌ Failed to fetch suspension status:', err);
      return { is_suspended: false, suspended_until: null, suspension_reason: null };
    }
  };

  const fetchSuspendedUsers = async (filters?: { status?: string; type?: string }): Promise<SuspendedUserInfo[]> => {
    try {
      let query = supabase
        .from('profiles')
        .select(`
          user_id,
          first_name,
          last_name,
          email,
          is_suspended,
          suspended_until,
          suspension_reason,
          role,
          created_at
        `)
        .eq('is_suspended', true)
        .order('first_name');

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(user => ({
        user_id: user.user_id,
        name: `${user.first_name} ${user.last_name}`,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        suspended_at: user.created_at,
        suspended_until: user.suspended_until,
        suspension_reason: user.suspension_reason || '',
        reason: user.suspension_reason || '',
        suspended_by: 'system',
        suspended_by_name: 'System',
        suspension_type: 'temporary' as SuspensionType,
        is_active: true
      }));
    } catch (err: any) {
      console.error('❌ Failed to fetch suspended users:', err);
      return [];
    }
  };

  const fetchUserSuspensionHistory = async (userId: string): Promise<UserSuspension[]> => {
    try {
      const { data, error } = await supabase
        .from('user_flag_audit')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(entry => ({
        id: entry.id,
        user_id: entry.user_id,
        suspended_at: entry.created_at,
        suspended_until: null,
        reason: entry.reason || 'No reason provided',
        suspension_reason: entry.reason || 'No reason provided',
        suspended_by: entry.actor_id,
        suspended_by_name: 'Admin',
        suspension_type: 'temporary' as SuspensionType,
        duration: null,
        is_active: entry.flagged,
        unblocked_at: entry.flagged ? null : entry.created_at,
        notes: null
      }));
    } catch (err: any) {
      console.error('❌ Failed to load suspension history:', err);
      return [];
    }
  };

  const getSuspensionHistory = async (userId: string): Promise<UserSuspension[]> => {
    return fetchUserSuspensionHistory(userId);
  };

  return {
    suspendUser,
    unsuspendUser,
    reactivateUser,
    fetchUserSuspensionStatus,
    fetchSuspendedUsers,
    fetchUserSuspensionHistory,
    getSuspensionHistory,
    loading,
    error
  };
};

// Helper functions
function parseDuration(duration: string): number {
  const match = duration.match(/(\d+)([dhm])/);
  if (!match) return 24 * 60 * 60 * 1000; // Default 24h

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    case 'm': return value * 60 * 1000;
    default: return 24 * 60 * 60 * 1000;
  }
}

function extractReasonCode(reason: string | null): SuspensionReasonCode {
  if (!reason) return 'OTHER';
  
  const codes: SuspensionReasonCode[] = ['SPAM', 'ABUSE', 'FRAUD', 'TOS_VIOLATION', 'TRUST_SCORE_LOW', 'MULTIPLE_FLAGS', 'MANUAL_REVIEW'];
  
  for (const code of codes) {
    if (reason.toUpperCase().includes(code)) {
      return code;
    }
  }
  
  return 'OTHER';
}
