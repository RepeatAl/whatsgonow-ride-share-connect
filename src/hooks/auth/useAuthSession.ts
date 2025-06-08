
import { useState, useEffect, useCallback, useRef } from 'react';
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
  
  // PERFORMANCE: Prevent memory leaks and unnecessary re-renders
  const fetchInProgressRef = useRef(false);
  const mountedRef = useRef(true);

  // Profile fetch function with debouncing and error handling
  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    // Prevent concurrent fetches
    if (fetchInProgressRef.current) {
      console.debug('🔄 OptimizedAuth: Profile fetch already in progress, skipping');
      return null;
    }
    
    fetchInProgressRef.current = true;
    
    try {
      console.debug('✅ OptimizedAuth: Fetching profile for user:', userId);
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

      if (!mountedRef.current) {
        console.debug('🔄 OptimizedAuth: Component unmounted, skipping profile update');
        return null;
      }

      console.debug('✅ OptimizedAuth: Profile loaded successfully:', data);
      return data as UserProfile;
    } catch (err: any) {
      console.error('❌ OptimizedAuth: Profile fetch failed:', err);
      if (mountedRef.current) {
        setProfileError(err.message || 'Profile fetch failed');
      }
      return null;
    } finally {
      fetchInProgressRef.current = false;
      if (mountedRef.current) {
        setIsProfileLoading(false);
      }
    }
  }, []);

  // Profile refresh function
  const refreshProfile = useCallback(async () => {
    if (!user?.id) {
      console.debug('🔄 OptimizedAuth: No user for profile refresh');
      return;
    }
    
    const newProfile = await fetchProfile(user.id);
    if (mountedRef.current && newProfile) {
      setProfile(newProfile);
    }
  }, [user?.id, fetchProfile]);

  // STABILIZED: Auth State Change Handler with proper cleanup
  useEffect(() => {
    console.debug('🚀 OptimizedAuth: Setting up auth listener...');
    
    let initialCheckCompleted = false;
    
    // Initial session check
    const checkInitialSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ OptimizedAuth: Initial session error:', error);
        } else {
          console.debug('📋 OptimizedAuth: Initial session:', initialSession ? 'Found' : 'None');
          
          if (mountedRef.current) {
            setSession(initialSession);
            setUser(initialSession?.user ?? null);
            
            if (initialSession?.user) {
              // Defer profile loading to prevent blocking
              setTimeout(async () => {
                if (mountedRef.current) {
                  const userProfile = await fetchProfile(initialSession.user.id);
                  if (mountedRef.current) {
                    setProfile(userProfile);
                  }
                }
              }, 50);
            }
          }
        }
      } catch (err) {
        console.error('❌ OptimizedAuth: Initial session check failed:', err);
      } finally {
        initialCheckCompleted = true;
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.debug('🔄 OptimizedAuth: Auth event:', event);
        
        if (!mountedRef.current) return;
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === 'SIGNED_IN' && currentSession?.user) {
          console.debug('✅ OptimizedAuth: User signed in, loading profile...');
          
          // Defer profile loading to prevent race conditions
          setTimeout(async () => {
            if (mountedRef.current) {
              const userProfile = await fetchProfile(currentSession.user.id);
              if (mountedRef.current) {
                setProfile(userProfile);
              }
            }
          }, 100);
        }

        if (event === 'SIGNED_OUT') {
          console.debug('👋 OptimizedAuth: User signed out');
          if (mountedRef.current) {
            setProfile(null);
            setProfileError(null);
          }
        }

        // Set loading to false only after initial check is done
        if (initialCheckCompleted && mountedRef.current) {
          setLoading(false);
        }
      }
    );

    // Run initial check
    checkInitialSession();

    // Cleanup function
    return () => {
      console.debug('🧹 OptimizedAuth: Cleaning up auth subscription');
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Clear state function
  const clearAuthState = useCallback(() => {
    if (mountedRef.current) {
      setUser(null);
      setSession(null);
      setProfile(null);
      setProfileError(null);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
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
