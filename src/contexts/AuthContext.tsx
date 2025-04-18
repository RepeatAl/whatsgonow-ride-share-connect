// ✅ Vollständiger AuthContext mit Supabase-Session, Profil-Logik und zentraler Authentifizierung
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 1. Hole initiale Session
  useEffect(() => {
    const loadInitialSession = async () => {
      const {
        data: { session },
        error
      } = await supabase.auth.getSession();

      if (error) console.warn("⚠️ Session error:", error);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    loadInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 2. Profil laden über Hook
  const {
    profile,
    profileLoading,
    profileError,
    setProfile,
    retryProfileLoad,
    isInitialLoad
  } = useProfile(user, loading);

  // 3. Auth-Funktionen
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    await authService.signIn(email, password);
    setLoading(false);
  };

  const signUp = async (
    email: string,
    password: string,
    metadata?: {
      first_name?: string;
      last_name?: string;
      name_affix?: string;
      phone?: string;
      region?: string;
      postal_code?: string;
      city?: string;
      street?: string;
      house_number?: string;
      address_extra?: string;
      role?: string;
      company_name?: string;
    }
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

  // 4. Zusammenführung
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
    throw new Error("❌ useAuth must be used within an AuthProvider");
  }
  return context;
};
