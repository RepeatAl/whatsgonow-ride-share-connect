import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import { isPublicRoute } from "@/routes/publicRoutes";

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("🔄 AuthProvider mounted, current path:", location.pathname);
    console.log("🔓 Is current path public?", isPublicRoute(location.pathname));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);

        console.log("🔑 Auth event:", event);
        console.log("📍 Current path:", location.pathname);
        console.log("🔓 Is public route:", isPublicRoute(location.pathname));

        if (event === 'SIGNED_IN') {
          const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
          
          toast({
            title: "Angemeldet",
            description: "Du bist jetzt eingeloggt."
          });
          
          if (isAuthPage) {
            const intendedPath = location.state?.from?.pathname || '/dashboard';
            navigate(intendedPath);
          }
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Abgemeldet",
            description: "Du wurdest erfolgreich abgemeldet."
          });
          
          if (!isPublicRoute(location.pathname)) {
            navigate('/login', { state: { from: location } });
          }
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
      
      console.log("🔍 Initial session check complete");
      console.log("👤 User authenticated:", !!currentSession?.user);
      
      if (!currentSession?.user && !isPublicRoute(location.pathname)) {
        console.log("🔒 No session, redirecting to login");
        navigate('/login', { state: { from: location } });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: `${(error as Error).message}`,
        variant: "destructive"
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        throw error;
      }

      toast({
        title: "Registrierung erfolgreich",
        description: "Dein Konto wurde erstellt. Bitte überprüfe deine E-Mails für die Bestätigung."
      });
    } catch (error) {
      toast({
        title: "Registrierung fehlgeschlagen",
        description: `${(error as Error).message}`,
        variant: "destructive"
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
    } catch (error) {
      toast({
        title: "Abmeldung fehlgeschlagen",
        description: `${(error as Error).message}`,
        variant: "destructive"
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut
      }}
    >
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
