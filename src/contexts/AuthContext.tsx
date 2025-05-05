
import React, { createContext, useContext, ReactNode } from "react";
import { isProfileIncomplete } from "@/utils/profile-check";
import type { AuthContextProps } from "@/types/auth";
import { useUserSession } from "./UserSessionContext";

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
    signIn,
    signUp,
    signOut,
    retryProfileLoad: refreshProfile,
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
