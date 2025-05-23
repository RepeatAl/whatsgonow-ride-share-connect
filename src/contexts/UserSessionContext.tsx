
import React, { createContext, useContext } from "react";
import { User, Session } from "@supabase/supabase-js";
import type { UserProfile } from "@/types/auth";
import { useSessionManager } from "@/hooks/auth/useSessionManager";
import { useProfile } from "@/hooks/auth/useProfile";
import { useAuthMethods } from "@/hooks/auth/useAuthMethods";

interface UserSessionContextProps {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  region: string | null;
  isTest: boolean;
  loading: boolean;
  isInitialLoad: boolean;
  sessionExpired: boolean;
  setSessionExpired: (expired: boolean) => void;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (
    email: string,
    password: string,
    metadata?: Record<string, any>
  ) => Promise<any>;
  signOut: () => Promise<void>;
  refreshProfile: (() => Promise<void>) | null;
}

const UserSessionContext = createContext<UserSessionContextProps>({} as UserSessionContextProps);

export const UserSessionProvider = ({ children }: { children: React.ReactNode }) => {
  // Use the session manager hook to handle auth state
  const { 
    user, 
    session, 
    loading, 
    isInitialLoad, 
    sessionExpired, 
    setSessionExpired 
  } = useSessionManager();
  
  // Use the profile hook to handle profile data
  const { 
    profile, 
    region, 
    isTest, 
    refreshProfile 
  } = useProfile(user);
  
  // Use the auth methods hook for login/signup/logout
  const { signIn, signUp, signOut } = useAuthMethods();

  // Combine all values for the context provider
  const value = {
    user,
    session,
    profile,
    region,
    isTest,
    loading: loading || isInitialLoad,
    isInitialLoad,
    sessionExpired,
    setSessionExpired,
    // Direkte Weiterleitung der Authentifizierungsmethoden
    signIn,
    signUp,
    signOut,
    refreshProfile: user ? refreshProfile : null
  };

  return (
    <UserSessionContext.Provider value={value}>
      {children}
    </UserSessionContext.Provider>
  );
};

export const useUserSession = () => {
  const context = useContext(UserSessionContext);
  if (!context) {
    throw new Error("useUserSession must be used within a UserSessionProvider");
  }
  return context;
};
