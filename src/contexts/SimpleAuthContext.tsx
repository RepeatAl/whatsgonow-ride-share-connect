
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import type { UserProfile } from "@/types/auth";

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

  // Fetch user profile from profiles table
  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log("🔍 Fetching profile for user:", userId);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("❌ Profile fetch error:", error);
        throw error;
      }

      if (!data) {
        console.warn("⚠️ No profile found for user:", userId);
        return null;
      }

      console.log("✅ Profile loaded:", data);
      return data;
    } catch (error) {
      console.error("❌ Profile fetch failed:", error);
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

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      console.log("🔐 Attempting sign in for:", email);
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("❌ Sign in error:", error);
        throw error;
      }

      console.log("✅ Sign in successful:", data.user?.email);
      toast({
        title: "Anmeldung erfolgreich",
        description: "Willkommen zurück!",
      });
    } catch (error: any) {
      console.error("❌ Sign in failed:", error);
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: error.message || "Bitte überprüfe deine Anmeldedaten.",
        variant: "destructive",
      });
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
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        console.error("❌ Sign up error:", error);
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
      toast({
        title: "Registrierung fehlgeschlagen",
        description: error.message || "Bitte versuche es später erneut.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      console.log("🚪 Signing out...");
      setLoading(true);

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("❌ Sign out error:", error);
        throw error;
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
    } catch (error: any) {
      console.error("❌ Sign out failed:", error);
      toast({
        title: "Fehler beim Abmelden",
        description: error.message || "Bitte versuche es später erneut.",
        variant: "destructive",
      });
      throw error;
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

        // Fetch profile when user signs in
        if (currentSession?.user && event === 'SIGNED_IN') {
          console.log("👤 User signed in, fetching profile...");
          const profileData = await fetchProfile(currentSession.user.id);
          if (mounted) {
            setProfile(profileData);
          }
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
