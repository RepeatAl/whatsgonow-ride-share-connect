
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useProfileVisibility } from './useProfileVisibility';
import type { 
  PublicProfile, 
  PrivateProfile, 
  TransactionProfile, 
  AdminProfile,
  VisibilityLevel,
  ProfileApiResponse 
} from '@/types/profile-visibility';

export const useProfileData = () => {
  const { user, profile } = useSimpleAuth();
  const { checkAccess, logProfileAccess } = useProfileVisibility();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Holt öffentliche Profildaten
  const getPublicProfile = useCallback(async (
    userId: string
  ): Promise<PublicProfile | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from('profiles')
        .select(`
          user_id,
          first_name,
          region,
          role,
          avatar_url,
          verified,
          created_at,
          profile_complete
        `)
        .eq('user_id', userId)
        .single();

      if (queryError) throw queryError;

      // Protokolliere Zugriff
      await logProfileAccess(userId, 'public', [
        'first_name', 'region', 'role', 'avatar_url', 'verified'
      ]);

      return data as PublicProfile;
    } catch (err) {
      console.error('Failed to load public profile:', err);
      setError('Failed to load profile');
      return null;
    } finally {
      setLoading(false);
    }
  }, [logProfileAccess]);

  // Holt private Profildaten (nur eigener Account)
  const getPrivateProfile = useCallback(async (): Promise<PrivateProfile | null> => {
    if (!user) return null;

    try {
      setLoading(true);
      setError(null);

      const hasAccess = await checkAccess(user.id, 'private');
      if (!hasAccess) {
        throw new Error('Insufficient permissions for private profile');
      }

      const { data, error: queryError } = await supabase
        .from('profiles')
        .select(`
          user_id,
          first_name,
          last_name,
          email,
          phone,
          region,
          role,
          postal_code,
          city,
          street,
          house_number,
          address_extra,
          company_name,
          avatar_url,
          verified,
          profile_complete,
          onboarding_complete,
          dashboard_access_enabled,
          wants_to_upload_items,
          is_suspended,
          suspension_reason,
          flagged_by_cm,
          flag_reason,
          created_at
        `)
        .eq('user_id', user.id)
        .single();

      if (queryError) throw queryError;

      // Protokolliere eigenen Zugriff
      await logProfileAccess(user.id, 'private');

      return data as PrivateProfile;
    } catch (err) {
      console.error('Failed to load private profile:', err);
      setError('Failed to load private profile');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, checkAccess, logProfileAccess]);

  // Holt erweiterte Profildaten bei aktiver Transaktion
  const getTransactionProfile = useCallback(async (
    userId: string,
    orderId: string
  ): Promise<TransactionProfile | null> => {
    if (!user) return null;

    try {
      setLoading(true);
      setError(null);

      const hasAccess = await checkAccess(userId, 'transaction', orderId);
      if (!hasAccess) {
        throw new Error('No active transaction relationship');
      }

      // Hole Basis-Profildaten
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          user_id,
          first_name,
          last_name,
          email,
          phone,
          region,
          role,
          postal_code,
          city,
          street,
          house_number,
          address_extra,
          company_name,
          avatar_url,
          verified,
          profile_complete
        `)
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;

      // Hole Transaktions-Context
      const { data: transactionData, error: transactionError } = await supabase
        .from('transaction_participants')
        .select('*')
        .eq('order_id', orderId)
        .or(`user_id.eq.${userId},counterparty_id.eq.${userId}`)
        .single();

      if (transactionError) throw transactionError;

      // Protokolliere Transaktions-Zugriff
      await logProfileAccess(userId, 'transaction', [
        'first_name', 'last_name', 'email', 'phone', 'business_address'
      ], orderId);

      // Kombiniere Daten
      const transactionProfile: TransactionProfile = {
        ...profileData,
        business_address: profileData.company_name ? {
          street: profileData.street || '',
          house_number: profileData.house_number || '',
          postal_code: profileData.postal_code,
          city: profileData.city,
          address_extra: profileData.address_extra,
          company_name: profileData.company_name
        } : undefined,
        transaction_context: {
          order_id: orderId,
          counterparty_id: transactionData.user_id === userId ? 
            transactionData.counterparty_id : transactionData.user_id,
          transaction_status: transactionData.status,
          started_at: transactionData.started_at,
          relationship_type: 'sender_driver' // TODO: Determine from order context
        }
      };

      return transactionProfile;
    } catch (err) {
      console.error('Failed to load transaction profile:', err);
      setError('Failed to load transaction profile');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, checkAccess, logProfileAccess]);

  // Holt vollständige Admin-Profildaten
  const getAdminProfile = useCallback(async (
    userId: string
  ): Promise<AdminProfile | null> => {
    if (!user) return null;

    try {
      setLoading(true);
      setError(null);

      const hasAccess = await checkAccess(userId, 'admin');
      if (!hasAccess) {
        throw new Error('Insufficient admin permissions');
      }

      // Hole vollständige Profildaten
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;

      // Hole Audit-Logs (letzte 50)
      const { data: auditLogs } = await supabase
        .from('profile_access_audit')
        .select('*')
        .eq('accessed_user_id', userId)
        .order('accessed_at', { ascending: false })
        .limit(50);

      // Hole Flag-History
      const { data: flagHistory } = await supabase
        .from('user_flag_audit')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Protokolliere Admin-Zugriff
      await logProfileAccess(userId, 'admin');

      const adminProfile: AdminProfile = {
        ...profileData,
        audit_logs: auditLogs || [],
        flag_history: flagHistory || [],
        full_address: {
          street: profileData.street || '',
          house_number: profileData.house_number || '',
          postal_code: profileData.postal_code,
          city: profileData.city,
          region: profileData.region,
          address_extra: profileData.address_extra
        }
      };

      return adminProfile;
    } catch (err) {
      console.error('Failed to load admin profile:', err);
      setError('Failed to load admin profile');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, checkAccess, logProfileAccess]);

  return {
    loading,
    error,
    getPublicProfile,
    getPrivateProfile,
    getTransactionProfile,
    getAdminProfile
  };
};
