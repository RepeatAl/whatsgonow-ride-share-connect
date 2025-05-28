
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
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

  // Centralized redirect logic
  useEffect(() => {
    // Don't redirect while loading
    if (loading || isProfileLoading) {
      console.log("🔄 Auth redirect waiting for loading to complete...", { loading, isProfileLoading });
      return;
    }

    const currentPath = location.pathname;
    const isAuthPage = currentPath.includes('/login') || 
                      currentPath.includes('/register') || 
                      currentPath.includes('/pre-register');

    // If user is authenticated and on auth page, redirect to role-specific dashboard
    if (user && profile && isAuthPage) {
      console.log("✅ User authenticated with profile, redirecting from auth page", { 
        role: profile.role,
        currentPath 
      });
      
      // Rollenbasierte Weiterleitung
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
      
      console.log("🎯 Redirecting to:", dashboardPath);
      navigate(dashboardPath, { replace: true });
      return;
    }

    // If user is authenticated but no profile, redirect to complete profile
    if (user && !profile && !isAuthPage) {
      console.log("⚠️ User authenticated but no profile, redirecting to profile");
      const profilePath = `/${currentLanguage}/profile`;
      navigate(profilePath, { replace: true });
      return;
    }

    // If not authenticated and trying to access protected route
    if (!user && !isAuthPage && !currentPath.includes('/about') && !currentPath.includes('/faq') && currentPath !== `/${currentLanguage}`) {
      console.log("🔒 Not authenticated, redirecting to login");
      const loginPath = `/${currentLanguage}/login`;
      navigate(loginPath, { replace: true });
      return;
    }

  }, [user, profile, loading, isProfileLoading, location.pathname, navigate, currentLanguage]);

  // Sign in with email and password - with enhanced error handling
  const signIn = async (email: string, password: string) => {
    try {
      console.log("🔐 Attempting sign in for:", email);
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

      console.log("✅ Sign in successful:", data.user?.email);
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
  };

  // Sign up with email, password and metadata
  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      console.log("📝 Attempting sign up for:", email);
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

      console.log("✅ Sign up successful:", data);
      
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
  };

  // Local logout function - no more global sign out!
  const signOut = async () => {
    try {
      console.log("🚪 Signing out locally...");
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

      console.log("✅ Local sign out successful");
      
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
  };

  // Local auth state cleanup function (no global cleanup)
  const cleanupLocalAuthState = () => {
    if (typeof window === 'undefined') return;

    try {
      // Environment-specific storage key isolation
      const environment = process.env.NODE_ENV || 'development';
      const storagePrefix = `supabase.auth-${environment}`;
      
      console.log("🧹 Cleaning up local auth state for environment:", environment);
      
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
  };

  // Initialize auth state and listeners
  useEffect(() => {
    console.log("🚀 Initializing SimpleAuthContext...");
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("🔄 Auth state changed:", event);
        console.log("🔄 Session:", currentSession ? "Active" : "None");
        
        if (!mounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === 'SIGNED_OUT') {
          console.log("👋 User signed out locally");
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

      console.log("📋 Initial session:", session ? "Found" : "None");
      
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

  const value = {
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
  };

  return (
    <SimpleAuthContext.Provider value={value}>
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
