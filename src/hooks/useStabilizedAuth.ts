
import { useState, useEffect, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import type { UserProfile } from '@/types/auth';

interface StabilizedAuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useStabilizedAuth() {
  const [state, setState] = useState<StabilizedAuthState>({
    user: null,
    session: null,
    profile: null,
    isReady: false,
    isLoading: true,
    error: null
  });

  // Debounce auth state changes to prevent flapping
  const [authChangeTimeout, setAuthChangeTimeout] = useState<NodeJS.Timeout | null>(null);

  const updateAuthState = (user: User | null, session: Session | null) => {
    if (authChangeTimeout) {
      clearTimeout(authChangeTimeout);
    }

    const timeout = setTimeout(() => {
      setState(prev => ({
        ...prev,
        user,
        session,
        isLoading: false
      }));
    }, 50); // Small debounce to prevent rapid changes

    setAuthChangeTimeout(timeout);
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      setState(prev => ({
        ...prev,
        profile: data ? {
          ...data,
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'User'
        } : null,
        isReady: true
      }));
    } catch (error) {
      console.error('Profile fetch error:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to load profile',
        isReady: true
      }));
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        console.log('🔄 Auth event (stabilized):', event);
        updateAuthState(session?.user || null, session);

        // Fetch profile if user is signed in
        if (session?.user && event === 'SIGNED_IN') {
          setTimeout(() => {
            if (mounted) {
              fetchProfile(session.user.id);
            }
          }, 100);
        } else if (event === 'SIGNED_OUT') {
          setState(prev => ({
            ...prev,
            profile: null,
            isReady: true
          }));
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      updateAuthState(session?.user || null, session);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setState(prev => ({
          ...prev,
          isReady: true
        }));
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
      if (authChangeTimeout) {
        clearTimeout(authChangeTimeout);
      }
    };
  }, []);

  // Memoized auth actions
  const authActions = useMemo(() => ({
    signIn: async (email: string, password: string) => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        return data;
      } catch (error: any) {
        setState(prev => ({
          ...prev,
          error: error.message,
          isLoading: false
        }));
        throw error;
      }
    },

    signOut: async () => {
      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
        setState({
          user: null,
          session: null,
          profile: null,
          isReady: true,
          isLoading: false,
          error: null
        });
      } catch (error: any) {
        console.error('Sign out error:', error);
        // Still clear state even if sign out fails
        setState({
          user: null,
          session: null,
          profile: null,
          isReady: true,
          isLoading: false,
          error: null
        });
      }
    },

    refreshProfile: () => {
      if (state.user) {
        fetchProfile(state.user.id);
      }
    }
  }), [state.user]);

  return {
    ...state,
    ...authActions
  };
}
