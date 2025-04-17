import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import type { AuthContextProps, UserProfile } from "@/types/auth";
import type { Session, User } from "@supabase/supabase-js";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Session + Profile holen
  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (error) {
        setError(error);
        setLoading(false);
        return;
      }
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(data.user);
      setSession(data.session);
    } catch (err) {
      toast({ title: "Anmeldung fehlgeschlagen", description: (err as Error).message, variant: "destructive" });
      throw err;
    }
  };

  const signUp = async (email: string, password: string, metadata?: {
    name?: string;
    role?: string;
    company_name?: string;
  }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
      return data;
    } catch (err) {
      toast({ title: "Registrierung fehlgeschlagen", description: (err as Error).message, variant: "destructive" });
      throw err;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (err) {
      toast({ title: "Abmeldung fehlgeschlagen", description: (err as Error).message, variant: "destructive" });
      throw err;
    }
  };

  const retryProfileLoad = null; // Placeholder, ggf. später hinzufügen

  const value: AuthContextProps = {
    user,
    session,
    profile,
    loading,
    error,
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