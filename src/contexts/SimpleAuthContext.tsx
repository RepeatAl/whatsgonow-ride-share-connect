
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import type { UserProfile } from "@/types/auth";
import { useSimpleAuthRedirect } from "@/hooks/useSimpleAuthRedirect";
import { cleanupAuthState, isValidProfile, handleAuthError } from "@/utils/auth-utils";
import { useProfileWithTimeout } from "@/hooks/auth/useProfileWithTimeout";

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

  // Use the new profile hook with timeout
  const { 
    profile, 
    isProfileLoading, 
    profileError, 
    refreshProfile,
    hasTimedOut: hasProfileTimedOut 
  } = useProfileWithTimeout(user);

  // Verwende den vereinfachten Auth-Redirect Hook
  useSimpleAuthRedirect(user, profile, loading, isProfileLoading);

  // Sign in with email and password - with enhanced error handling
  const signIn = async (email: string, password: string) => {
    try {
      console.log("🔐 Attempting sign in for:", email);
      setLoading(true);

      // Clean up any existing auth state
      cleanupAuthState();

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

  // Sign out - improved
  const signOut = async () => {
    try {
      console.log("🚪 Signing out...");
      setLoading(true);

      // Clean up auth state first
      cleanupAuthState();

      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error("❌ Sign out error:", error);
        // Don't throw error for sign out - still proceed with cleanup
      }

      console.log("✅ Sign out successful");
      
      // Clear state
      setUser(null);
      setSession(null);
      
      toast({
        title: "Abmeldung erfolgreich",
        description: "Auf Wiedersehen!",
      });

      // Force page reload for clean state
      setTimeout(() => {
        window.location.href = '/de';
      }, 100);
      
    } catch (error: any) {
      console.error("❌ Sign out failed:", error);
      // Still try to clear state even if sign out failed
      setUser(null);
      setSession(null);
      
      setTimeout(() => {
        window.location.href = '/de';
      }, 100);
    } finally {
      setLoading(false);
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
          console.log("👋 User signed out");
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
