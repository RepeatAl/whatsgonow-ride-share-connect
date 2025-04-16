
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuthSession } from "@/hooks/auth/useAuthSession";
import { useProfile } from "@/hooks/auth/useProfile";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import type { AuthContextProps } from "@/types/auth";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Manage authentication state
  const { 
    user, 
    session, 
    loading: sessionLoading, 
    error: sessionError,
    setUser,
    setSession
  } = useAuthSession();

  // Fetch and manage user profile
  const { 
    profile, 
    profileLoading, 
    profileError,
    setProfile, 
    retryProfileLoad
  } = useProfile(user, sessionLoading);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("🔑 Auth event:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          toast({
            title: "Erfolgreich angemeldet",
            description: "Willkommen zurück!"
          });
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          toast({
            title: "Abgemeldet",
            description: "Auf Wiedersehen!"
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("🔍 Checking initial session:", currentSession ? "Found" : "None");
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsInitialLoad(false);
    });

    return () => subscription.unsubscribe();
  }, [setSession, setUser, setProfile]);

  // Enhanced sign in handler
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
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
      const enhancedMetadata = {
        name: metadata?.name || "Neuer Benutzer",
        role: metadata?.role || "sender_private",
        company_name: metadata?.company_name
      };
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { 
          data: enhancedMetadata,
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) throw error;

      toast({
        title: "Registrierung erfolgreich",
        description: "Bitte überprüfe deine E-Mails für die Bestätigung."
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

  const value: AuthContextProps = {
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
    <AuthContext.Provider value={value}>
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
