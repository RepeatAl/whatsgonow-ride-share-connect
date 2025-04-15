
import { createContext, useContext, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/use-auth-state";
import { authService } from "@/services/auth-service";
import { getRoleBasedRedirectPath } from "@/utils/auth-utils";
import { toast } from "@/hooks/use-toast";
import { isPublicRoute } from "@/routes/publicRoutes";
import type { AuthContextProps } from "@/types/auth";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    setUser,
    session,
    setSession,
    profile,
    setProfile,
    loading,
    setLoading
  } = useAuthState();

  useEffect(() => {
    console.log("🔄 AuthProvider mounted, current path:", location.pathname);
    console.log("🔓 Is current path public?", isPublicRoute(location.pathname));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        console.log("🔑 Auth event:", event);
        console.log("📍 Current path:", location.pathname);
        
        const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

        if (event === 'SIGNED_IN') {
          if (currentSession?.user) {
            const userProfile = await authService.fetchUserProfile(currentSession.user.id);
            setProfile(userProfile);
            
            if (!userProfile) {
              console.warn("⚠️ Kein Benutzerprofil gefunden für:", currentSession.user.id);
            } else {
              const redirectPath = isAuthPage ? getRoleBasedRedirectPath(userProfile.role) : location.pathname;
              navigate(redirectPath);
            }
          }

          toast({
            title: "Angemeldet",
            description: "Du bist jetzt eingeloggt."
          });
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
        const userProfile = await authService.fetchUserProfile(currentSession.user.id);
        setProfile(userProfile);
        
        if (!userProfile) {
          console.warn("⚠️ Kein Benutzerprofil gefunden für:", currentSession.user.id);
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

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signIn: authService.signIn,
        signUp: authService.signUp,
        signOut: authService.signOut
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
