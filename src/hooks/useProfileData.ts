import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import type { UserProfile } from '@/types/auth';

export const useProfileData = (userId?: string) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useOptimizedAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const targetUserId = userId || user?.id;
        if (!targetUserId) {
          console.warn("No user ID provided and no authenticated user found.");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', targetUserId)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
        }

        setProfile(data || null);
      } catch (error) {
        console.error("Unexpected error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, user?.id]);

  return { profile, loading };
};

