import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { UserProfile, AuthContextProps, SUPER_ADMIN_ID } from "@/types/auth";

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchProfile = async (user: User) => {
    const { data, error } = await supabase
      .from("users")
      .select("user_id, name, email, role, region, company_name, active, profile_complete")
      .eq("user_id", user.id)
      .single();

    if (error) {
      setError(error);
      setProfile(null);
    } else {
      setProfile(data);
    }
  };

  const refreshSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (data?.session) {
      setUser(data.session.user);
      setSession(data.session);
      await fetchProfile(data.session.user);
    } else {
      setUser(null);
      setSession(null);
      setProfile(null);
    }
    setIsInitialLoad(false);
    setLoading(false);
    if (error) setError(error);
  };

  useEffect(() => {
    refreshSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        setSession(session);
        fetchProfile(session.user);
      } else {
        setUser(null);
        setSession(null);
        setProfile(null);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data?.session?.user) {
      setUser(data.session.user);
      await fetchProfile(data.session.user);
    }
  };

  const signUp = async (email: string, password: string, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, error, isInitialLoad, signIn, signUp, signOut, retryProfileLoad: refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
