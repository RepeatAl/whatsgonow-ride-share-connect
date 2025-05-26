
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import type { UserProfile } from "@/types/auth";
import { useSimpleAuthRedirect } from "@/hooks/useSimpleAuthRedirect";
import { cleanupAuthState, isValidProfile, handleAuthError } from "@/utils/auth-utils";

interface SimpleAuthContextProps {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
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

  // Verwende den vereinfachten Auth-Redirect Hook
  useSimpleAuthRedirect(user, profile, loading);

  // Fetch user profile from profiles table - improved error handling
  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log("🔍 Fetching profile for user:", userId);
      
      // Add retry logic for temporary issues
      let retries = 3;
      let lastError: any = null;
      
      while (retries > 0) {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", userId)
            .maybeSingle();

          if (error) {
            lastError = error;
            if (error.message.includes("infinite recursion")) {
              console.warn("⚠️ RLS recursion detected, cleaning auth state...");
              cleanupAuthState();
              retries--;
              await new Promise(resolve => setTimeout(resolve, 1000));
              continue;
            }
            throw error;
          }

          if (!data) {
            console.warn("⚠️ No profile found for user:", userId);
            return null;
          }

          if (!isValidProfile(data)) {
            console.warn("⚠️ Invalid profile data:", data);
            return null;
          }

          console.log("✅ Profile loaded:", data);
          return data;
        } catch (error) {
          lastError = error;
          retries--;
          if (retries > 0) {
            console.log(`🔄 Retrying profile fetch... ${retries} attempts left`);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
      throw lastError;
    } catch (error) {
      console.error("❌ Profile fetch failed:", error);
      handleAuthError(error as Error, "Profil laden");
      return null;
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (!user) {
      console.log("📝 No user to refresh profile for");
      return;
    }
    
    console.log("🔄 Refreshing profile...");
    const profileData = await fetchProfile(user.id);
    setProfile(profileData);
  };

  // Sign in with email and password - improved error handling
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
      console.log("📝 With metadata:", metadata);
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
      setProfile(null);
      
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
      setProfile(null);
      
      setTimeout(() => {
        window.location.href = '/de';
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  // Initialize auth state and listeners - improved
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

        // Fetch profile when user signs in - with improved error handling
        if (currentSession?.user && event === 'SIGNED_IN') {
          console.log("👤 User signed in, fetching profile...");
          // Use setTimeout to prevent potential deadlocks
          setTimeout(async () => {
            if (mounted) {
              try {
                const profileData = await fetchProfile(currentSession.user.id);
                if (mounted) {
                  setProfile(profileData);
                }
              } catch (error) {
                console.error("❌ Error fetching profile after sign in:", error);
                // Don't block the UI if profile fetch fails
                if (mounted) {
                  setProfile(null);
                }
              }
            }
          }, 100);
        } else if (event === 'SIGNED_OUT') {
          console.log("👋 User signed out, clearing profile");
          setProfile(null);
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

        // Fetch profile for existing session
        if (session?.user) {
          fetchProfile(session.user.id).then(profileData => {
            if (mounted) {
              setProfile(profileData);
              setLoading(false);
            }
          }).catch(error => {
            console.error("❌ Error fetching initial profile:", error);
            if (mounted) {
              setProfile(null);
              setLoading(false);
            }
          });
        } else {
          setLoading(false);
        }
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
