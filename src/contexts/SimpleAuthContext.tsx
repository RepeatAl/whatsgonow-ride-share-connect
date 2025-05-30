import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import type { UserProfile } from "@/types/auth";
import { cleanupAuthState, isValidProfile, handleAuthError } from "@/utils/auth-utils";
import { useProfileWithTimeout } from "@/hooks/auth/useProfileWithTimeout";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

interface SimpleAuthContextProps {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isProfileLoading: boolean;
  profileError: string | null;
  hasProfileTimedOut: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const SimpleAuthContext = createContext<SimpleAuthContextProps>({} as SimpleAuthContextProps);

export const SimpleAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLanguage } = useLanguageMCP();

  // Use the new profile hook with timeout
  const { 
    profile, 
    isProfileLoading, 
    profileError, 
    refreshProfile,
    hasTimedOut: hasProfileTimedOut 
  } = useProfileWithTimeout(user);

  // FIX: Vereinfachte Redirect-Logik ohne hasInitialRedirectRun Flag
  useEffect(() => {
    // Warte bis Authentifizierung und Profil geladen sind
    if (loading || isProfileLoading) {
      console.debug("🔄 Auth still loading...", { loading, isProfileLoading });
      return;
    }

    const currentPath = location.pathname;
    const isAuthPage = currentPath.includes('/login') || 
                      currentPath.includes('/register') || 
                      currentPath.includes('/pre-register') ||
                      currentPath.includes('/forgot-password') ||
                      currentPath.includes('/reset-password');

    console.debug("🎯 Redirect logic:", { 
      user: !!user, 
      profile: !!profile, 
      isAuthPage,
      currentPath 
    });

    // FIX: Benutzer ist authentifiziert und auf Auth-Seite → zu Dashboard weiterleiten
    if (user && profile && isAuthPage) {
      console.debug("✅ User authenticated with profile, redirecting from auth page");
      
      let dashboardPath = `/${currentLanguage}/dashboard`;
      
      switch (profile.role) {
        case "sender_private":
        case "sender_business":
          dashboardPath = `/${currentLanguage}/dashboard/sender`;
          break;
        case "driver":
          dashboardPath = `/${currentLanguage}/dashboard/driver`;
          break;
        case "cm":
          dashboardPath = `/${currentLanguage}/dashboard/cm`;
          break;
        case "admin":
        case "super_admin":
          dashboardPath = `/${currentLanguage}/dashboard/admin`;
          break;
        default:
          dashboardPath = `/${currentLanguage}/dashboard`;
      }
      
      console.debug("🎯 Redirecting to:", dashboardPath);
      navigate(dashboardPath, { replace: true });
      return;
    }

    // FIX: Benutzer ist authentifiziert aber kein Profil → zu Profil-Seite
    if (user && !profile && !isAuthPage) {
      console.debug("⚠️ User authenticated but no profile, redirecting to profile");
      navigate(`/${currentLanguage}/profile`, { replace: true });
      return;
    }

    // FIX: Nicht authentifiziert und versucht geschützte Route zu besuchen
    const isPublicPath = currentPath === `/${currentLanguage}` || 
                        currentPath.includes('/about') || 
                        currentPath.includes('/faq') ||
                        currentPath === '/' ||
                        currentPath === '';

    if (!user && !isAuthPage && !isPublicPath) {
      console.debug("🔒 Not authenticated, redirecting to login");
      navigate(`/${currentLanguage}/login`, { replace: true });
      return;
    }

  }, [user, profile, loading, isProfileLoading, location.pathname, navigate, currentLanguage]);

  // FIX: Optimized sign in with better error handling
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      console.debug("🔐 Attempting sign in for:", email);
      setLoading(true);

      // Clean up any existing auth state - but only locally
      cleanupLocalAuthState();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("❌ Sign in error:", error);
        
        // Enhanced error handling for specific cases
        if (error.message.includes("Email not confirmed")) {
          throw new Error("Email not confirmed");
        } else if (error.message.includes("Invalid login credentials")) {
          throw new Error("Invalid login credentials");
        }
        
        handleAuthError(error, "Anmeldung");
        throw error;
      }

      console.debug("✅ Sign in successful:", data.user?.email);
      toast({
        title: "Anmeldung erfolgreich",
        description: "Willkommen zurück!",
      });
    } catch (error: any) {
      console.error("❌ Sign in failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // PHASE 2 FIX: Optimized sign up with better error handling
  const signUp = useCallback(async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      console.debug("📝 Attempting sign up for:", email);
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/de/dashboard`
        }
      });

      if (error) {
        console.error("❌ Sign up error:", error);
        handleAuthError(error, "Registrierung");
        throw error;
      }

      console.debug("✅ Sign up successful:", data);
      
      if (data.user && !data.session) {
        toast({
          title: "Registrierung erfolgreich",
          description: "Bitte bestätige deine E-Mail-Adresse, um fortzufahren.",
        });
      } else {
        toast({
          title: "Registrierung erfolgreich",
          description: "Willkommen bei Whatsgonow!",
        });
      }
    } catch (error: any) {
      console.error("❌ Sign up failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // FIX: Local logout function - no more global sign out!
  const signOut = useCallback(async () => {
    try {
      console.debug("🚪 Signing out locally...");
      setLoading(true);

      // Clean up local auth state first
      cleanupLocalAuthState();

      // PHASE 1 FIX: Only local session logout - no global scope!
      // This prevents logging out users on other devices/tabs
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("❌ Sign out error:", error);
        // Don't throw error for sign out - still proceed with cleanup
      }

      console.debug("✅ Local sign out successful");
      
      // Clear state
      setUser(null);
      setSession(null);
      
      toast({
        title: "Abmeldung erfolgreich",
        description: "Auf Wiedersehen!",
      });

      // Navigate to home page
      setTimeout(() => {
        navigate(`/${currentLanguage}`, { replace: true });
      }, 100);
      
    } catch (error: any) {
      console.error("❌ Sign out failed:", error);
      // Still try to clear state even if sign out failed
      setUser(null);
      setSession(null);
      
      setTimeout(() => {
        navigate(`/${currentLanguage}`, { replace: true });
      }, 100);
    } finally {
      setLoading(false);
    }
  }, [navigate, currentLanguage]);

  // FIX: Local auth state cleanup function (no global cleanup)
  const cleanupLocalAuthState = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      // Environment-specific storage key isolation
      const environment = process.env.NODE_ENV || 'development';
      const storagePrefix = `supabase.auth-${environment}`;
      
      console.debug("🧹 Cleaning up local auth state for environment:", environment);
      
      // Remove environment-specific auth tokens
      localStorage.removeItem(`${storagePrefix}.token`);
      
      // Remove all Supabase auth keys from localStorage (but only current environment)
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(storagePrefix) || key.includes(`sb-${environment}`)) {
          localStorage.removeItem(key);
        }
      });
      
      // Clean sessionStorage if used
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith(storagePrefix) || key.includes(`sb-${environment}`)) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.error("Error cleaning up local auth state:", e);
      // Non-critical error, continue execution
    }
  }, []);

  // FIX: Initialize auth state and listeners - optimized with better error handling
  useEffect(() => {
    console.debug("🚀 Initializing SimpleAuthContext...");
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.debug("🔄 Auth state changed:", event);
        console.debug("🔄 Session:", currentSession ? "Active" : "None");
        
        if (!mounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === 'SIGNED_OUT') {
          console.debug("👋 User signed out locally");
        }

        if (mounted) {
          setLoading(false);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("❌ Error getting initial session:", error);
        if (mounted) setLoading(false);
        return;
      }

      console.debug("📋 Initial session:", session ? "Found" : "None");
      
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // FIX: Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    session,
    profile,
    loading,
    isProfileLoading,
    profileError,
    hasProfileTimedOut,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  }), [
    user,
    session,
    profile,
    loading,
    isProfileLoading,
    profileError,
    hasProfileTimedOut,
    signIn,
    signUp,
    signOut,
    refreshProfile,
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
    throw new Error("useSimpleAuth must be used within a SimpleAuthProvider");
  }
  return context;
};
