
import { createContext, useContext, ReactNode, useState } from "react";
import { useLocation } from "react-router-dom";
import { authService } from "@/services/auth-service";
import { useAuthSession } from "@/hooks/auth/useAuthSession";
import { useProfile } from "@/hooks/auth/useProfile";
import { useAuthRedirect } from "@/hooks/auth/useAuthRedirect";
import { toast } from "@/hooks/use-toast";
import type { AuthContextProps } from "@/types/auth";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Manage authentication state
  const { 
    user, 
    session, 
    loading: sessionLoading, 
    error: sessionError
  } = useAuthSession();

  // Fetch and manage user profile
  const { 
    profile, 
    profileLoading, 
    profileError,
    setProfile, 
    retryProfileLoad
  } = useProfile(user, sessionLoading);

  // Handle authentication-based redirects
  useAuthRedirect(user, profile, sessionLoading || profileLoading);

  // Determine if we're still in initial loading state
  if (isInitialLoad && !sessionLoading) {
    setIsInitialLoad(false);
  }

  // Sign in handler with proper error management
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      toast({
        title: "Angemeldet",
        description: "Du bist jetzt eingeloggt."
      });
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: (error as Error).message,
        variant: "destructive"
      });
      throw error;
    }
  };

  // Enhanced sign up handler
  const signUp = async (email: string, password: string, metadata?: { 
    name?: string;
    role?: string;
    company_name?: string;
  }) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
      });
      
      if (error) throw error;

      toast({
        title: "Registrierung erfolgreich",
        description: "Dein Konto wurde erstellt. Bitte überprüfe deine E-Mails für die Bestätigung."
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registrierung fehlgeschlagen",
        description: (error as Error).message,
        variant: "destructive"
      });
      throw error;
    }
  };

  // Sign out handler
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Abgemeldet",
        description: "Du wurdest erfolgreich abgemeldet."
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Abmeldung fehlgeschlagen",
        description: (error as Error).message,
        variant: "destructive"
      });
      throw error;
    }
  };

  // Create context with all auth-related data and functions
  const authContextValue: AuthContextProps = {
    user,
    session,
    profile,
    loading: sessionLoading || profileLoading,
    error: sessionError || profileError,
    isInitialLoad,
    signIn,
    signUp,
    signOut,
    retryProfileLoad
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
