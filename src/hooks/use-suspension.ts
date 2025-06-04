
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';
import type { 
  EnhancedSuspendUserOptions, 
  SuspensionAuditEntry,
  SuspensionType,
  SuspensionReasonCode 
} from '@/types/suspension-enhanced';

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

  const getSuspensionHistory = async (userId: string): Promise<SuspensionAuditEntry[]> => {
    try {
      const { data, error } = await supabase
        .from('user_flag_audit')
        .select(`
          id,
          user_id,
          flagged,
          reason,
          created_at,
          actor_id,
          role
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform to SuspensionAuditEntry format
      return (data || []).map(entry => ({
        id: entry.id,
        user_id: entry.user_id,
        action: entry.flagged ? 'suspended' : 'unsuspended',
        reason: entry.reason || 'No reason provided',
        reason_code: extractReasonCode(entry.reason),
        suspension_type: 'temporary' as SuspensionType,
        duration: null,
        suspended_by: entry.actor_id,
        suspended_by_name: 'Admin',
        audit_notes: null,
        created_at: entry.created_at
      }));
    } catch (err: any) {
      console.error('❌ Failed to load suspension history:', err);
      return [];
    }
  };

  return {
    suspendUser,
    unsuspendUser,
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
