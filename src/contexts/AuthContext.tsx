
import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import { isPublicRoute } from "@/routes/publicRoutes";

interface UserProfile {
  user_id: string;
  name: string;
  email: string;
  role: string;
  region?: string;
  active?: boolean;
}

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", userId)
        .single();
      
      if (error) {
        console.error("Fehler beim Laden des Benutzerprofils:", error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error("Exception beim Laden des Benutzerprofils:", error);
      return null;
    }
  };

  useEffect(() => {
    console.log("🔄 AuthProvider mounted, current path:", location.pathname);
    console.log("🔓 Is current path public?", isPublicRoute(location.pathname));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        console.log("🔑 Auth event:", event);
        console.log("📍 Current path:", location.pathname);
        console.log("🔓 Is public route:", isPublicRoute(location.pathname));

        if (event === 'SIGNED_IN') {
          const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
          
          if (currentSession?.user) {
            // Benutzerprofile asynchron laden ohne den Auth-Prozess zu blockieren
            const userProfile = await fetchUserProfile(currentSession.user.id);
            setProfile(userProfile);
            
            if (!userProfile) {
              console.warn("⚠️ Kein Benutzerprofil gefunden für:", currentSession.user.id);
              // Wir lassen den Benutzer trotzdem eingeloggt, da er authentifiziert ist
            }
          }

          toast({
            title: "Angemeldet",
            description: "Du bist jetzt eingeloggt."
          });
          
          if (isAuthPage) {
            const intendedPath = location.state?.from?.pathname || '/dashboard';
            navigate(intendedPath);
          }
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          
          toast({
            title: "Abgemeldet",
            description: "Du wurdest erfolgreich abgemeldet."
          });
          
          if (!isPublicRoute(location.pathname)) {
            navigate('/login', { state: { from: location } });
          }
        }

        setLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      console.log("🔍 Initial session check complete");
      console.log("👤 User authenticated:", !!currentSession?.user);
      
      if (currentSession?.user) {
        const userProfile = await fetchUserProfile(currentSession.user.id);
        setProfile(userProfile);
        
        if (!userProfile) {
          console.warn("⚠️ Kein Benutzerprofil gefunden für:", currentSession.user.id);
          // Wir lassen den Benutzer trotzdem eingeloggt, da er authentifiziert ist
        }
      }
      
      if (!currentSession?.user && !isPublicRoute(location.pathname)) {
        console.log("🔒 No session, redirecting to login");
        navigate('/login', { state: { from: location } });
      }
      
      setLoading(false);
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
        profile,
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
