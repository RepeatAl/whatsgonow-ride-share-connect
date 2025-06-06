
import React, { createContext, useContext, ReactNode, useMemo, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import type { UserProfile } from "@/types/auth";
import { useNavigate } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import { useAuthSession } from "@/hooks/auth/useAuthSession";
import { useAuthMethods } from "@/hooks/auth/useAuthMethods";
import { useAuthRedirect } from "@/hooks/auth/useAuthRedirect";

interface OptimizedAuthContextProps {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isProfileLoading: boolean;
  profileError: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  emergencyReset: () => Promise<boolean>;
}

const OptimizedAuthContext = createContext<OptimizedAuthContextProps>({} as OptimizedAuthContextProps);

export const OptimizedAuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguageMCP();
  
  // Use custom hooks for auth functionality
  const {
    user,
    session,
    profile,
    loading,
    isProfileLoading,
    profileError,
    refreshProfile,
    clearAuthState
  } = useAuthSession();

  const {
    signIn: authSignIn,
    signUp: authSignUp,
    signOut: authSignOut,
    emergencyReset
  } = useAuthMethods();

  // Handle redirects
  useAuthRedirect(user, profile, loading, isProfileLoading);

  // Wrapper functions to handle state management
  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      await authSignIn(email, password);
    } finally {
      setLoading(false);
    }
  }, [authSignIn]);

  const signUp = useCallback(async (email: string, password: string, metadata?: Record<string, any>) => {
    setLoading(true);
    try {
      await authSignUp(email, password, metadata);
    } finally {
      setLoading(false);
    }
  }, [authSignUp]);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      clearAuthState();
      await authSignOut(navigate, currentLanguage);
    } finally {
      setLoading(false);
    }
  }, [authSignOut, navigate, currentLanguage, clearAuthState]);

  const contextValue = useMemo(() => ({
    user,
    session,
    profile,
    loading,
    isProfileLoading,
    profileError,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    emergencyReset
  }), [
    user,
    session,
    profile,
    loading,
    isProfileLoading,
    profileError,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    emergencyReset
  ]);

  return (
    <OptimizedAuthContext.Provider value={contextValue}>
      {children}
    </OptimizedAuthContext.Provider>
  );
};

export const useOptimizedAuth = () => {
  const context = useContext(OptimizedAuthContext);
  if (!context) {
    throw new Error("useOptimizedAuth must be used within OptimizedAuthProvider");
  }
  return context;
};
