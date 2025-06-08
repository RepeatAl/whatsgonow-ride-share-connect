
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
      console.debug('✅ OptimizedAuth: Fetching profile for authenticated user:', userId);
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

      console.debug('✅ OptimizedAuth: Profile loaded successfully:', data);
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
    console.debug('🚀 OptimizedAuth: Setting up auth listener...');
    
    // ENHANCED: Initial session check FIRST - synchronous
    const checkInitialSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ OptimizedAuth: Initial session error:', error);
        } else {
          console.debug('📋 OptimizedAuth: Initial session check:', initialSession ? 'Found' : 'None');
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          
          if (initialSession?.user) {
            // Defer profile loading slightly to avoid blocking
            setTimeout(async () => {
              const userProfile = await fetchProfile(initialSession.user.id);
              setProfile(userProfile);
            }, 50);
          }
        }
      } catch (err) {
        console.error('❌ OptimizedAuth: Initial session check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    // Run initial check
    checkInitialSession();

    // THEN set up listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.debug('🔄 OptimizedAuth: Auth event:', event);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === 'SIGNED_IN' && currentSession?.user) {
          console.debug('✅ OptimizedAuth: User signed in, loading profile...');
          
          // Profile laden mit Delay um race conditions zu vermeiden
          setTimeout(async () => {
            const userProfile = await fetchProfile(currentSession.user.id);
            setProfile(userProfile);
          }, 100);
        }

        if (event === 'SIGNED_OUT') {
          console.debug('👋 OptimizedAuth: User signed out');
          setProfile(null);
          setProfileError(null);
        }

        // Loading is already false from initial check
      }
    );

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
