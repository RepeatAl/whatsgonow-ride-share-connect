
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import type { UserProfile } from "@/types/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import { isPublicRoute } from "@/routes/publicRoutes";

interface SimpleAuthContextProps {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isProfileLoading: boolean;
  profileError: string | null;
  hasProfileTimedOut: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const SimpleAuthContext = createContext<SimpleAuthContextProps>({} as SimpleAuthContextProps);

export const SimpleAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [hasProfileTimedOut, setHasProfileTimedOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLanguage } = useLanguageMCP();

  // Profile fetch mit verbesserter Fehlerbehandlung
  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('👤 SimpleAuth: Fetching profile for user:', userId);
      setIsProfileLoading(true);
      setProfileError(null);
      setHasProfileTimedOut(false);
      
      // Timeout für Profile-Abfrage
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000);
      });
      
      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

      if (error) {
        console.error('❌ SimpleAuth: Profile fetch error:', error);
        
        if (error.code === 'PGRST116') {
          console.log('🔧 SimpleAuth: No profile found, user needs to complete registration');
          setProfileError('Profile not found - registration incomplete');
          return null;
        }
        
        if (error.message?.includes('timeout')) {
          setHasProfileTimedOut(true);
          setProfileError('Profile loading timed out');
          return null;
        }
        
        setProfileError(error.message || 'Unknown profile error');
        return null;
      }

      console.log('✅ SimpleAuth: Profile loaded successfully:', data);
      return data as UserProfile;
    } catch (err: any) {
      console.error('❌ SimpleAuth: Profile fetch failed:', err);
      
      if (err.message?.includes('timeout')) {
        setHasProfileTimedOut(true);
        setProfileError('Profile loading timed out');
      } else {
        setProfileError(err.message || 'Profile fetch failed');
      }
      
      return null;
    } finally {
      setIsProfileLoading(false);
    }
  }, []);

  // Sign In mit verbesserter Fehlerbehandlung
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      console.log('🔐 SimpleAuth: Signing in:', email);
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ SimpleAuth: Sign in error:', error);
        throw error;
      }

      console.log('✅ SimpleAuth: Sign in successful');
      
      toast({
        title: "Anmeldung erfolgreich",
        description: "Willkommen zurück!",
      });
      
    } catch (error: any) {
      console.error('❌ SimpleAuth: Sign in failed:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign Up
  const signUp = useCallback(async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      console.log('📝 SimpleAuth: Signing up:', email);
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) {
        console.error('❌ SimpleAuth: Sign up error:', error);
        throw error;
      }

      console.log('✅ SimpleAuth: Sign up successful');
      
      toast({
        title: "Registrierung erfolgreich",
        description: data.user && !data.session ? 
          "Bitte bestätigen Sie Ihre E-Mail-Adresse." : 
          "Willkommen bei Whatsgonow!"
      });
      
    } catch (error: any) {
      console.error('❌ SimpleAuth: Sign up failed:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign Out
  const signOut = useCallback(async () => {
    try {
      console.log('🚪 SimpleAuth: Signing out...');
      setLoading(true);

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ SimpleAuth: Sign out error:', error);
      }

      // State sofort clearen
      setUser(null);
      setSession(null);
      setProfile(null);
      setError(null);
      setProfileError(null);
      setHasProfileTimedOut(false);
      
      console.log('✅ SimpleAuth: Sign out completed');
      
      toast({
        title: "Abmeldung erfolgreich",
        description: "Auf Wiedersehen!"
      });

      // Navigation zur Startseite
      navigate(`/${currentLanguage}`, { replace: true });
      
    } catch (error: any) {
      console.error('❌ SimpleAuth: Sign out failed:', error);
      // Auch bei Fehler State clearen
      setUser(null);
      setSession(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [navigate, currentLanguage]);

  // Profile refresh
  const refreshProfile = useCallback(async () => {
    if (!user) return;
    
    const newProfile = await fetchProfile(user.id);
    setProfile(newProfile);
  }, [user, fetchProfile]);

  // Auth State Change Handler
  useEffect(() => {
    console.log('🚀 SimpleAuth: Setting up auth listener...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('🔄 SimpleAuth: Auth event:', event);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === 'SIGNED_IN' && currentSession?.user) {
          console.log('✅ SimpleAuth: User signed in, loading profile...');
          
          // Profile laden mit Delay um race conditions zu vermeiden
          setTimeout(async () => {
            const userProfile = await fetchProfile(currentSession.user.id);
            setProfile(userProfile);
          }, 100);
        }

        if (event === 'SIGNED_OUT') {
          console.log('👋 SimpleAuth: User signed out');
          setProfile(null);
          setProfileError(null);
          setHasProfileTimedOut(false);
        }

        setLoading(false);
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📋 SimpleAuth: Initial session check:', session ? 'Found' : 'None');
      
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

  // Vereinfachte Redirect-Logik
  useEffect(() => {
    if (loading || isProfileLoading) return;

    const currentPath = location.pathname;
    
    // Öffentliche Routen überspringen
    if (isPublicRoute(currentPath)) {
      return;
    }

    const isAuthPage = currentPath.includes('/login') || 
                      currentPath.includes('/register');

    // Authentifiziert + auf Auth-Seite → Dashboard
    if (user && profile && isAuthPage) {
      console.log('✅ SimpleAuth: Redirecting authenticated user to dashboard');
      navigate(`/${currentLanguage}/dashboard`, { replace: true });
      return;
    }

    // Nicht authentifiziert + geschützte Route → Login
    if (!user && !isAuthPage) {
      console.log('🔒 SimpleAuth: Redirecting unauthenticated user to login');
      navigate(`/${currentLanguage}/login`, { replace: true });
      return;
    }

  }, [user, profile, loading, isProfileLoading, location.pathname, navigate, currentLanguage]);

  const contextValue = useMemo(() => ({
    user,
    session,
    profile,
    loading,
    isProfileLoading,
    profileError,
    hasProfileTimedOut,
    error,
    signIn,
    signUp,
    signOut,
    refreshProfile
  }), [
    user,
    session,
    profile,
    loading,
    isProfileLoading,
    profileError,
    hasProfileTimedOut,
    error,
    signIn,
    signUp,
    signOut,
    refreshProfile
  ]);

  return (
    <SimpleAuthContext.Provider value={contextValue}>
      {children}
    </SimpleAuthContext.Provider>
  );
};

export const useSimpleAuth = () => {
  const context = useContext(SimpleAuthContext);
  if (!context) {
    throw new Error("useSimpleAuth must be used within SimpleAuthProvider");
  }
  return context;
};
