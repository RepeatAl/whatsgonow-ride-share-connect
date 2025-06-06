import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';

export const useProfileVisibility = () => {
  const { user } = useOptimizedAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PrivacyError | null>(null);

  // Prüft, ob User Zugriff auf bestimmte Profildaten hat
  const checkAccess = useCallback(async (
    targetUserId: string, 
    accessType: VisibilityLevel,
    orderId?: string
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      setLoading(true);
      setError(null);

      // Bei public access - immer erlaubt
      if (accessType === 'public') return true;

      // Bei private access - nur eigener Account
      if (accessType === 'private') {
        return user.id === targetUserId;
      }

      // Bei transaction access - prüfe Geschäftsbeziehung
      if (accessType === 'transaction') {
        if (!orderId) return false;
        
        const { data: relationship } = await supabase
          .from('transaction_participants')
          .select('*')
          .eq('order_id', orderId)
          .eq('status', 'active')
          .or(`user_id.eq.${user.id},counterparty_id.eq.${user.id}`)
          .or(`user_id.eq.${targetUserId},counterparty_id.eq.${targetUserId}`)
          .single();

        return !!relationship;
      }

      // Bei admin access - prüfe Admin/CM-Rolle
      if (accessType === 'admin') {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        return profile?.role && ['admin', 'super_admin', 'cm'].includes(profile.role);
      }

      return false;
    } catch (err) {
      console.error('Access check failed:', err);
      setError({
        code: 'INSUFFICIENT_PERMISSIONS',
        message: 'Failed to verify access permissions'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Holt Visibility-Einstellungen für einen User
  const getVisibilitySettings = useCallback(async (
    userId?: string
  ): Promise<ProfileVisibilitySettings[]> => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) return [];

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profile_visibility_settings')
        .select('*')
        .eq('user_id', targetUserId);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Failed to load visibility settings:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Aktualisiert Visibility-Einstellung für ein Feld
  const updateFieldVisibility = useCallback(async (
    fieldName: string, 
    visibilityLevel: VisibilityLevel,
    optIn: boolean = true
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('profile_visibility_settings')
        .upsert({
          user_id: user.id,
          field_name: fieldName,
          visibility_level: visibilityLevel,
          opt_in: optIn
        });

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Failed to update field visibility:', err);
      setError({
        code: 'PRIVACY_SETTINGS_RESTRICT',
        message: 'Failed to update privacy settings'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Prüft Sichtbarkeitslevel für ein spezifisches Feld
  const getFieldVisibility = useCallback(async (
    targetUserId: string, 
    fieldName: string
  ): Promise<VisibilityLevel> => {
    try {
      // Verwende die DB-Funktion für optimierte Abfrage
      const { data, error } = await supabase.rpc('get_user_visibility_level', {
        target_user_id: targetUserId,
        field_name: fieldName
      });

      if (error) throw error;
      return data || 'public';
    } catch (err) {
      console.error('Failed to get field visibility:', err);
      return 'public'; // Fallback
    }
  }, []);

  // Protokolliert Profilzugriff (für DSGVO-Compliance)
  const logProfileAccess = useCallback(async (
    accessedUserId: string,
    accessType: VisibilityLevel,
    accessedFields?: string[],
    orderId?: string
  ): Promise<void> => {
    if (!user) return;

    try {
      await supabase
        .from('profile_access_audit')
        .insert({
          accessed_by: user.id,
          accessed_user_id: accessedUserId,
          access_type: accessType,
          order_id: orderId,
          accessed_fields: accessedFields
        });
    } catch (err) {
      console.error('Failed to log profile access:', err);
      // Nicht kritisch - weiter ausführen
    }
  }, [user]);

  // Prüft, ob aktive Transaktion zwischen zwei Usern besteht
  const hasActiveTransaction = useCallback(async (
    userA: string, 
    userB: string
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('has_transaction_relationship', {
        user_a: userA,
        user_b: userB
      });

      if (error) throw error;
      return data || false;
    } catch (err) {
      console.error('Failed to check transaction relationship:', err);
      return false;
    }
  }, []);

  return {
    loading,
    error,
    checkAccess,
    getVisibilitySettings,
    updateFieldVisibility,
    getFieldVisibility,
    logProfileAccess,
    hasActiveTransaction
  };
};
