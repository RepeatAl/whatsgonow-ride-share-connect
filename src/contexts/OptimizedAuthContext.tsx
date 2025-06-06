
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import type { UserProfile } from "@/types/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import { isPublicRoute } from "@/routes/publicRoutes";
import { useAuthCleanup } from "@/hooks/useAuthCleanup";

interface OptimizedAuthContextProps {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
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
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLanguage } = useLanguageMCP();
  const { emergencyCleanup, softCleanup } = useAuthCleanup();

  // Optimierte Profile-Abfrage OHNE rekursive RLS-Checks
  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('👤 Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('❌ Profile fetch error:', error);
        
        // Bei "no rows" Error, versuche Profil zu erstellen
        if (error.code === 'PGRST116') {
          console.log('🔧 No profile found, creating...');
          return null; // Lass den Nutzer ein Profil erstellen
        }
        
        throw error;
      }

      console.log('✅ Profile loaded:', data);
      return data as UserProfile;
    } catch (err) {
      console.error('❌ Profile fetch failed:', err);
      setError(err instanceof Error ? err.message : 'Profile fetch failed');
      return null;
    }
  }, []);

  // Optimierter Sign In OHNE pre-cleanup
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      console.log('🔐 Signing in:', email);
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Sign in error:', error);
        throw error;
      }

      console.log('✅ Sign in successful');
      
      // Profile wird automatisch über onAuthStateChange geladen
      toast({
        title: "Anmeldung erfolgreich",
        description: "Willkommen zurück!",
      });
      
    } catch (error: any) {
      console.error('❌ Sign in failed:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Optimierter Sign Up
  const signUp = useCallback(async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      console.log('📝 Signing up:', email);
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
        console.error('❌ Sign up error:', error);
        throw error;
      }

      console.log('✅ Sign up successful');
      
      toast({
        title: "Registrierung erfolgreich",
        description: data.user && !data.session ? 
          "Bitte bestätigen Sie Ihre E-Mail-Adresse." : 
          "Willkommen bei Whatsgonow!"
      });
      
    } catch (error: any) {
      console.error('❌ Sign up failed:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Optimierter Sign Out
  const signOut = useCallback(async () => {
    try {
      console.log('🚪 Signing out...');
      setLoading(true);

      // Soft cleanup first
      await softCleanup();

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Sign out error:', error);
      }

      // State sofort clearen
      setUser(null);
      setSession(null);
      setProfile(null);
      setError(null);
      
      console.log('✅ Sign out completed');
      
      toast({
        title: "Abmeldung erfolgreich",
        description: "Auf Wiedersehen!"
      });

      // Navigation zur Startseite
      navigate(`/${currentLanguage}`, { replace: true });
      
    } catch (error: any) {
      console.error('❌ Sign out failed:', error);
      // Auch bei Fehler State clearen
      setUser(null);
      setSession(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [navigate, currentLanguage, softCleanup]);

  // Emergency Reset Funktion
  const emergencyReset = useCallback(async () => {
    console.log('🚨 Emergency reset triggered');
    await emergencyCleanup();
  }, [emergencyCleanup]);

  // Profile refresh
  const refreshProfile = useCallback(async () => {
    if (!user) return;
    
    const newProfile = await fetchProfile(user.id);
    setProfile(newProfile);
  }, [user, fetchProfile]);

  // Auth State Change Handler - VEREINFACHT
  useEffect(() => {
    console.log('🚀 Setting up optimized auth listener...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('🔄 Auth event:', event);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === 'SIGNED_IN' && currentSession?.user) {
          console.log('✅ User signed in, loading profile...');
          
          // Profile laden mit Delay um race conditions zu vermeiden
          setTimeout(async () => {
            const userProfile = await fetchProfile(currentSession.user.id);
            setProfile(userProfile);
          }, 100);
        }

        if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
          setProfile(null);
        }

        setLoading(false);
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📋 Initial session check:', session ? 'Found' : 'None');
      
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
    if (loading) return;

    const currentPath = location.pathname;
    
    // Öffentliche Routen überspringen
    if (isPublicRoute(currentPath)) {
      return;
    }

    const isAuthPage = currentPath.includes('/login') || 
                      currentPath.includes('/register');

    // Authentifiziert + auf Auth-Seite → Dashboard
    if (user && profile && isAuthPage) {
      console.log('✅ Redirecting authenticated user to dashboard');
      navigate(`/${currentLanguage}/dashboard`, { replace: true });
      return;
    }

    // Nicht authentifiziert + geschützte Route → Login
    if (!user && !isAuthPage) {
      console.log('🔒 Redirecting unauthenticated user to login');
      navigate(`/${currentLanguage}/login`, { replace: true });
      return;
    }

  }, [user, profile, loading, location.pathname, navigate, currentLanguage]);

  const contextValue = useMemo(() => ({
    user,
    session,
    profile,
    loading,
    error,
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
    error,
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
