
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { authService } from "@/services/auth-service";
import { useProfile as useProfileHook } from "@/hooks/auth/useProfile";
import { isProfileIncomplete } from "@/utils/profile-check";
import type { UserProfile, AuthContextProps } from "@/types/auth";

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
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

  const { 
    profile: profileHook,
    loading: profileLoading, 
    error: profileError, 
    retryProfileLoad, 
    isInitialLoad,
    user: profileUser,
    refreshProfile
  } = useProfileHook();

  // Calculate isProfileComplete from the profile data using the utility function
  const isProfileComplete = profile ? !isProfileIncomplete(profile) : false;

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    await authService.signIn(email, password);
    setLoading(false);
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    setLoading(true);
    const result = await authService.signUp(email, password, metadata);
    setLoading(false);
    return result;
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Set profile from hook when it changes
  useEffect(() => {
    if (profileHook) {
      setProfile(profileHook);
    }
  }, [profileHook]);

  const value = {
    user,
    session,
    profile,
    loading: loading || profileLoading,
    error: error || profileError,
    isInitialLoad,
    isProfileComplete,
    signIn,
    signUp,
    signOut,
    retryProfileLoad,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
