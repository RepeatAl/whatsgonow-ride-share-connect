
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import type { UserProfile } from "@/types/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import { isPublicRoute } from "@/routes/publicRoutes";

interface OptimizedAuthContextProps {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isProfileLoading: boolean;
  profileError: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  emergencyReset: () => Promise<void>;
}

const OptimizedAuthContext = createContext<OptimizedAuthContextProps>({} as OptimizedAuthContextProps);

export const OptimizedAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLanguage } = useLanguageMCP();

  // PHASE 3: Sichere Profile-Abfrage (nur nach Login)
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

  // PHASE 3: Optimierter Sign In (keine Profile-Checks vor Auth!)
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      console.log('🔐 OptimizedAuth: Starting sign in for:', email);
      setLoading(true);
      setProfileError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ OptimizedAuth: Sign in error:', error);
        throw error;
      }

      console.log('✅ OptimizedAuth: Sign in successful');
      
      toast({
        title: "Anmeldung erfolgreich",
        description: "Willkommen zurück!",
      });
      
    } catch (error: any) {
      console.error('❌ OptimizedAuth: Sign in failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign Up
  const signUp = useCallback(async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      console.log('📝 OptimizedAuth: Starting sign up for:', email);
      setLoading(true);
      setProfileError(null);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/de/dashboard`
        }
      });

      if (error) {
        console.error('❌ OptimizedAuth: Sign up error:', error);
        throw error;
      }

      console.log('✅ OptimizedAuth: Sign up successful');
      
      toast({
        title: "Registrierung erfolgreich",
        description: data.user && !data.session ? 
          "Bitte bestätigen Sie Ihre E-Mail-Adresse." : 
          "Willkommen bei Whatsgonow!"
      });
      
    } catch (error: any) {
      console.error('❌ OptimizedAuth: Sign up failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign Out
  const signOut = useCallback(async () => {
    try {
      console.log('🚪 OptimizedAuth: Signing out...');
      setLoading(true);

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ OptimizedAuth: Sign out error:', error);
      }

      // State sofort clearen
      setUser(null);
      setSession(null);
      setProfile(null);
      setProfileError(null);
      
      console.log('✅ OptimizedAuth: Sign out completed');
      
      toast({
        title: "Abmeldung erfolgreich",
        description: "Auf Wiedersehen!"
      });

      // Navigation zur Startseite
      navigate(`/${currentLanguage}`, { replace: true });
      
    } catch (error: any) {
      console.error('❌ OptimizedAuth: Sign out failed:', error);
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

  // Emergency Reset für schwere Auth-Probleme
  const emergencyReset = useCallback(async () => {
    console.log('🚨 OptimizedAuth: Emergency reset initiated...');
    
    try {
      // Alle lokalen Storage-Daten löschen
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.includes('supabase') || 
        key.includes('sb-') || 
        key.includes('auth') ||
        key.includes('whatsgonow')
      );
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log(`🧹 Removed localStorage key: ${key}`);
      });

      // SessionStorage auch leeren
      const sessionKeys = Object.keys(sessionStorage).filter(key => 
        key.includes('supabase') || 
        key.includes('sb-') || 
        key.includes('auth')
      );
      
      sessionKeys.forEach(key => {
        sessionStorage.removeItem(key);
        console.log(`🧹 Removed sessionStorage key: ${key}`);
      });

      // Supabase Session force reset
      try {
        await supabase.auth.signOut({ scope: 'global' });
        console.log('🔐 Global signout completed');
      } catch (error) {
        console.log('⚠️ Global signout failed, continuing...', error);
      }

      // Force reload für clean state
      setTimeout(() => {
        window.location.href = window.location.origin;
      }, 1000);

      return true;
    } catch (error) {
      console.error('❌ Emergency reset failed:', error);
      return false;
    }
  }, []);

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
      console.log('✅ OptimizedAuth: Redirecting authenticated user to dashboard');
      navigate(`/${currentLanguage}/dashboard`, { replace: true });
      return;
    }

    // Nicht authentifiziert + geschützte Route → Login
    if (!user && !isAuthPage) {
      console.log('🔒 OptimizedAuth: Redirecting unauthenticated user to login');
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
    signIn,
    signUp,
    signOut,
    refreshProfile,
    emergencyReset
  }), [
    user,
    session,
    profile,
    loading,
    isProfileLoading,
    profileError,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    emergencyReset
  ]);

  return (
    <OptimizedAuthContext.Provider value={contextValue}>
      {children}
    </OptimizedAuthContext.Provider>
  );
};

export const useOptimizedAuth = () => {
  const context = useContext(OptimizedAuthContext);
  if (!context) {
    throw new Error("useOptimizedAuth must be used within OptimizedAuthProvider");
  }
  return context;
};
