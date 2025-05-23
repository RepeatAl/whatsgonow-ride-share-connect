
import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { isProfileIncomplete } from "@/utils/profile-check";
import type { AuthContextProps } from "@/types/auth";
import { useUserSession } from "./UserSessionContext";
import { useAuthRedirect } from "@/hooks/auth/useAuthRedirect"; // Neu importiert

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    user,
    session,
    profile,
    loading,
    isInitialLoad,
    sessionExpired,
    setSessionExpired,
    signIn,
    signUp,
    signOut,
    refreshProfile
  } = useUserSession();

  // Zentraler Redirect-Mechanismus für die Authentifizierung
  useAuthRedirect(user, profile, loading);

  const error = null; // Error handling is now in UserSessionContext
  const isProfileComplete = profile ? !isProfileIncomplete(profile) : false;

  const value: AuthContextProps = {
    user,
    session,
    profile,
    loading,
    error,
    isInitialLoad,
    isProfileComplete,
    sessionExpired,
    signIn,
    signUp,
    signOut,
    retryProfileLoad: refreshProfile,
    refreshProfile,
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
