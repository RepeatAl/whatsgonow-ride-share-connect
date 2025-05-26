
import React, { createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import type { UserProfile } from '@/types/auth';
import { useStabilizedAuth } from '@/hooks/useStabilizedAuth';

interface StabilizedAuthContextProps {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  refreshProfile: () => void;
}

const StabilizedAuthContext = createContext<StabilizedAuthContextProps>({} as StabilizedAuthContextProps);

export const StabilizedAuthProvider = ({ children }: { children: ReactNode }) => {
  const authState = useStabilizedAuth();

  return (
    <StabilizedAuthContext.Provider value={authState}>
      {children}
    </StabilizedAuthContext.Provider>
  );
};

export const useStabilizedAuthContext = () => {
  const context = useContext(StabilizedAuthContext);
  if (!context) {
    throw new Error('useStabilizedAuthContext must be used within a StabilizedAuthProvider');
  }
  return context;
};
