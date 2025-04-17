
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";
import type { AuthContextProps } from "@/types/auth";
import type { Session, User } from "@supabase/supabase-js";
import { useProfile } from "@/hooks/auth/useProfile";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const {
    profile,
    profileLoading,
    profileError,
    setProfile,
    retryProfileLoad,
  } = useProfile(user, loading);

  useEffect(() => {
    console.log("🔄 AuthContext initialized");
    
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("❌ Error fetching initial session:", error);
          setError(error);
        } else {
          console.log("🔑 Initial session loaded:", !!data.session);
          setSession(data.session);
          setUser(data.session?.user ?? null);
        }
      } catch (err) {
        console.error("❌ Unexpected error during session init:", err);
        setError(err instanceof Error ? err : new Error("Unknown session error"));
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("📡 Auth state change event:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === "SIGNED_OUT") {
          setProfile(null);
          toast({ title: "Abgemeldet", description: "Auf Wiedersehen!" });
        } else if (event === "SIGNED_IN") {
          toast({ title: "Erfolgreich angemeldet", description: "Willkommen zurück!" });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("🔑 SignIn requested for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error("❌ SignIn error:", error);
        throw error;
      }
      
      console.log("✅ SignIn successful");
      setUser(data.user);
      setSession(data.session);
    } catch (err) {
      console.error("❌ SignIn exception:", err);
      toast({ 
        title: "Anmeldung fehlgeschlagen", 
        description: (err as Error).message, 
        variant: "destructive" 
      });
      throw err;
    }
  };

  const signUp = async (email: string, password: string, metadata?: {
    name?: string;
    role?: string;
    company_name?: string;
  }) => {
    try {
      console.log("🔐 SignUp requested for:", email, "with metadata:", metadata);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) {
        console.error("❌ SignUp error:", error);
        throw error;
      }
      
      console.log("✅ SignUp successful:", data);
      return data;
    } catch (err) {
      console.error("❌ SignUp exception:", err);
      toast({ 
        title: "Registrierung fehlgeschlagen", 
        description: (err as Error).message, 
        variant: "destructive" 
      });
      throw err;
    }
  };

  const signOut = async () => {
    try {
      console.log("🚪 SignOut requested");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("❌ SignOut error:", error);
        throw error;
      }
      
      console.log("✅ SignOut successful");
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (err) {
      console.error("❌ SignOut exception:", err);
      toast({ 
        title: "Abmeldung fehlgeschlagen", 
        description: (err as Error).message, 
        variant: "destructive" 
      });
      throw err;
    }
  };

  const value: AuthContextProps = {
    user,
    session,
    profile,
    loading: loading || profileLoading,
    error: error || profileError,
    isInitialLoad,
    signIn,
    signUp,
    signOut,
    retryProfileLoad,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
