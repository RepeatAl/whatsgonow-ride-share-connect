
import React, { createContext, useContext, ReactNode } from "react";
import { useSessionManager } from "@/hooks/auth/useSessionManager";
import { useProfile } from "@/hooks/auth/useProfile";
import { authService } from "@/services/auth-service";
import { isProfileIncomplete } from "@/utils/profile-check";
import type { AuthContextProps } from "@/types/auth";
import { toast } from "@/hooks/use-toast";

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    user,
    session,
    loading,
    isInitialLoad: sessionInitialLoad,
    sessionExpired
  } = useSessionManager();

  const {
    profile,
    loading: profileLoading,
    error,
    retryProfileLoad,
    isInitialLoad: profileInitialLoad,
    refreshProfile
  } = useProfile();

  const signIn = async (email: string, password: string) => {
    try {
      await authService.signIn(email, password);
    } catch (err) {
      console.error("❌ Sign in error:", err);
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: "Bitte überprüfe deine E-Mail-Adresse und dein Passwort.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      const result = await authService.signUp(email, password, metadata);
      return result;
    } catch (err) {
      console.error("❌ Sign up error:", err);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error("❌ Sign out error:", error);
      throw error;
    }
  };

  const isProfileComplete = profile ? !isProfileIncomplete(profile) : false;

  const value = {
    user,
    session,
    profile,
    loading: loading || profileLoading,
    error,
    isInitialLoad: sessionInitialLoad || profileInitialLoad,
    isProfileComplete,
    signIn,
    signUp,
    signOut,
    retryProfileLoad,
    refreshProfile,
    sessionExpired
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
