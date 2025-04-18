// ✅ Vollständiger AuthContext mit Supabase-Session, Profile, Login/Logout/SignUp & OnboardingStatus
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { authService } from "@/services/auth-service";
import { useProfile } from "@/hooks/useProfile";
import type { AuthContextProps, UserProfile } from "@/types/auth";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Initial session fetch
  useEffect(() => {
    const getInitialSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) console.warn("Session error:", error);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Hook für Benutzerprofil laden
  const {
    profile,
    profileLoading,
    profileError,
    setProfile,
    retryProfileLoad,
    isInitialLoad
  } = useProfile(user, loading);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    await authService.signIn(email, password);
    setLoading(false);
  };

  const signUp = async (
    email: string,
    password: string,
    metadata?: Record<string, string>
  ) => {
    setLoading(true);
    const result = await authService.signUp(email, password, metadata);
    setLoading(false);
    return result;
  };

  const signOut = async () => {
    setLoading(true);
    await authService.signOut();
    setProfile(null);
    setLoading(false);
  };

  const refreshProfile = () => {
    retryProfileLoad?.();
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
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
