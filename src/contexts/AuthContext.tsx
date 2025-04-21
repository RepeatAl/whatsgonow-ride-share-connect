import React, { createContext, useContext, ReactNode } from "react";
import { useSessionManager } from "@/hooks/auth/useSessionManager";
import { useProfile } from "@/hooks/auth/useProfile";
import { authService } from "@/services/auth-service";
import { isProfileIncomplete } from "@/utils/profile-check";
import type { AuthContextProps } from "@/types/auth";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  
  const {
    user,
    session,
    loading: sessionLoading,
    isInitialLoad: sessionInitialLoad,
    sessionExpired,
    setSessionExpired
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
      setSessionExpired(false);
      setTimeout(() => {
        if (refreshProfile) refreshProfile();
      }, 500);
    } catch (err: any) {
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: err?.message || "Bitte überprüfe deine E-Mail-Adresse und dein Passwort.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      navigate("/", { replace: true });
    } catch (error: any) {
      toast({
        title: "Fehler beim Abmelden",
        description: error?.message || "Bitte versuche es später erneut.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      return await authService.signUp(email, password, metadata);
    } catch (err: any) {
      toast({
        title: "Registrierung fehlgeschlagen",
        description: err?.message || "Bitte versuche es später erneut.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const isProfileComplete = profile ? !isProfileIncomplete(profile) : false;

  const value = {
    user,
    session,
    profile,
    loading: sessionLoading || profileLoading,
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
