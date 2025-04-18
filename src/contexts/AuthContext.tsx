// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import type { UserProfile, AuthContextProps } from "@/types/auth";

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Lädt das UserProfile aus deiner Supabase-Tabelle "users"
  const fetchProfile = async (u: User) => {
    try {
      const { data, error: e } = await supabase
        .from<UserProfile>("users")
        .select("*")
        .eq("user_id", u.id)
        .single();
      if (e) throw e;
      setProfile(data);
    } catch (e) {
      setError(e as Error);
      setProfile(null);
    }
  };

  // Initiale Session laden und Listener einrichten
  useEffect(() => {
    (async () => {
      const { data, error: e } = await supabase.auth.getSession();
      if (e) setError(e);
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        await fetchProfile(data.session.user);
      }
      setLoading(false);
      setIsInitialLoad(false);
    })();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, sess) => {
        setSession(sess);
        setUser(sess?.user ?? null);
        if (sess?.user) {
          await fetchProfile(sess.user);
        } else {
          setProfile(null);
        }
      }
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  // Anmelden
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (data.session?.user) {
      setSession(data.session);
      setUser(data.session.user);
      await fetchProfile(data.session.user);
    }
  };

  // Registrieren
  const signUp = async (
    email: string,
    password: string,
    metadata?: Record<string, any>
  ): Promise<{ user: User | null; session: Session | null } | void> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });
    if (error) throw error;
    // Supabase sendet E‑Mail, wir warten auf Bestätigung
    return data;
  };

  // Abmelden
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  // Manuelles Nachladen des Profils
  const retryProfileLoad = () => {
    if (user) fetchProfile(user);
  };

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Export des Hooks für Verbraucher
export const useAuth = (): AuthContextProps => {
  return useContext(AuthContext);
};
