
import { useState } from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { SuspensionStatus, UserSuspension, SuspendedUserInfo, SuspendUserOptions } from '@/types/suspension';

export function useSuspension() {
  const [loading, setLoading] = useState(false);
  const { profile } = useSimpleAuth();
  
  const canSuspend = profile?.role && ['admin', 'super_admin'].includes(profile.role);

  const fetchUserSuspensionStatus = async (userId: string): Promise<SuspensionStatus> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_suspended, suspended_until, suspension_reason')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      return {
        is_suspended: data.is_suspended || false,
        suspended_until: data.suspended_until,
        suspension_reason: data.suspension_reason
      };
    } catch (err) {
      console.error('Error fetching suspension status:', err);
      return {
        is_suspended: false,
        suspended_until: null,
        suspension_reason: null
      };
    }
  };

  const fetchUserSuspensions = async (userId: string): Promise<UserSuspension[]> => {
    try {
      // This would need a proper suspensions table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      return data || [];
    } catch (err) {
      console.error('Error fetching user suspensions:', err);
      return [];
    }
  };

  const fetchAllSuspensions = async (): Promise<UserSuspension[]> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_suspended', true);

      if (error) throw error;

      return data || [];
    } catch (err) {
      console.error('Error fetching all suspensions:', err);
      return [];
    }
  };

  const fetchSuspendedUsers = async (): Promise<SuspendedUserInfo[]> => {
    try {
      const { data, error } = await supabase
        .from('active_profiles')
        .select('*')
        .eq('is_suspended', true);

      if (error) throw error;

      return data?.map(user => ({
        user_id: user.user_id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        suspended_at: user.created_at,
        suspended_until: user.suspended_until,
        suspension_reason: user.suspension_reason || '',
        suspended_by: 'admin'
      })) || [];
    } catch (err) {
      console.error('Error fetching suspended users:', err);
      return [];
    }
  };

  const suspendUser = async (userId: string, options: SuspendUserOptions) => {
    if (!canSuspend) {
      toast({
        title: "Zugriff verweigert",
        description: "Nur Admins können Nutzer suspendieren",
        variant: "destructive"
      });
      return false;
    }

    try {
      setLoading(true);

      const suspendedUntil = options.duration_hours 
        ? new Date(Date.now() + options.duration_hours * 60 * 60 * 1000).toISOString()
        : null;

      const { error } = await supabase
        .from('profiles')
        .update({
          is_suspended: true,
          suspended_until: suspendedUntil,
          suspension_reason: options.reason
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Nutzer suspendiert",
        description: "Der Nutzer wurde erfolgreich suspendiert.",
      });

      return true;
    } catch (err) {
      console.error('Error suspending user:', err);
      toast({
        title: "Fehler",
        description: "Nutzer konnte nicht suspendiert werden",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchUserSuspensionStatus,
    fetchUserSuspensions,
    fetchAllSuspensions,
    fetchSuspendedUsers,
    suspendUser,
    loading,
    canSuspend
  };
}
