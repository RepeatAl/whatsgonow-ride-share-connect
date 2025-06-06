
import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import type { UserProfile } from '@/types/auth';

export const useAuthSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Profile fetch function
  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('✅ OptimizedAuth: Fetching profile for authenticated user:', userId);
      setIsProfileLoading(true);
      setProfileError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('❌ OptimizedAuth: Profile fetch error:', error);
        setProfileError(error.message);
        return null;
      }

      console.log('✅ OptimizedAuth: Profile loaded successfully:', data);
      return data as UserProfile;
    } catch (err: any) {
      console.error('❌ OptimizedAuth: Profile fetch failed:', err);
      setProfileError(err.message || 'Profile fetch failed');
      return null;
    } finally {
      setIsProfileLoading(false);
    }
  }, []);

  // Profile refresh function
  const refreshProfile = useCallback(async () => {
    if (!user) return;
    
    const newProfile = await fetchProfile(user.id);
    setProfile(newProfile);
  }, [user, fetchProfile]);

  // Auth State Change Handler
  useEffect(() => {
    console.log('🚀 OptimizedAuth: Setting up auth listener...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('🔄 OptimizedAuth: Auth event:', event);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === 'SIGNED_IN' && currentSession?.user) {
          console.log('✅ OptimizedAuth: User signed in, loading profile...');
          
          // Profile laden mit Delay um race conditions zu vermeiden
          setTimeout(async () => {
            const userProfile = await fetchProfile(currentSession.user.id);
            setProfile(userProfile);
          }, 100);
        }

        if (event === 'SIGNED_OUT') {
          console.log('👋 OptimizedAuth: User signed out');
          setProfile(null);
          setProfileError(null);
        }

        setLoading(false);
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📋 OptimizedAuth: Initial session check:', session ? 'Found' : 'None');
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id).then(setProfile);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Clear state function
  const clearAuthState = useCallback(() => {
    setUser(null);
    setSession(null);
    setProfile(null);
    setProfileError(null);
  }, []);

  return {
    user,
    session,
    profile,
    loading,
    isProfileLoading,
    profileError,
    refreshProfile,
    clearAuthState
  };
};
