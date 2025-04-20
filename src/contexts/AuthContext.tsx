
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import { User, Session } from "@supabase/supabase-js";
import { authService } from "@/services/auth-service";
import { useProfile } from "@/hooks/auth/useProfile";
import { isProfileIncomplete } from "@/utils/profile-check";
import type { UserProfile, AuthContextProps } from "@/types/auth";
import { toast } from "@/hooks/use-toast";

const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds
const AUTH_CONTEXT_KEY = "whatsgonow_auth_timestamp";

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Check session expiration
  useEffect(() => {
    const checkSessionExpiration = () => {
      const lastActivity = localStorage.getItem(AUTH_CONTEXT_KEY);
      if (lastActivity && user) {
        const timePassed = Date.now() - parseInt(lastActivity);
        if (timePassed > SESSION_TIMEOUT) {
          console.log("🕒 Session expired due to inactivity");
          setSessionExpired(true);
          signOut();
        } else {
          // Update the timestamp for activity
          localStorage.setItem(AUTH_CONTEXT_KEY, Date.now().toString());
        }
      }
    };

    // Check on component mount and set interval
    checkSessionExpiration();
    const interval = setInterval(checkSessionExpiration, 60000); // Check every minute

    // Update timestamp on user activity
    const updateTimestamp = () => {
      if (user) {
        localStorage.setItem(AUTH_CONTEXT_KEY, Date.now().toString());
      }
    };

    // Listen for user activity
    window.addEventListener("click", updateTimestamp);
    window.addEventListener("keypress", updateTimestamp);
    window.addEventListener("scroll", updateTimestamp);
    window.addEventListener("mousemove", updateTimestamp);

    return () => {
      clearInterval(interval);
      window.removeEventListener("click", updateTimestamp);
      window.removeEventListener("keypress", updateTimestamp);
      window.removeEventListener("scroll", updateTimestamp);
      window.removeEventListener("mousemove", updateTimestamp);
    };
  }, [user]);

  useEffect(() => {
    console.log("🔄 AuthProvider initialized");
    let mounted = true;

    const getInitialSession = async () => {
      try {
        console.log("📥 Getting initial session");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error("❌ Session error:", error);
          setError(error);
        } else {
          console.log("✅ Session state:", session ? "Active" : "None");
          // Only set the session and user if we're not in the middle of an expired session
          if (!sessionExpired) {
            setSession(session);
            setUser(session?.user ?? null);
            
            // Initialize timestamp if user is logged in
            if (session?.user) {
              localStorage.setItem(AUTH_CONTEXT_KEY, Date.now().toString());
            }
          }
        }
      } catch (err) {
        console.error("❌ Unexpected error during session init:", err);
        if (mounted) setError(err as Error);
      } finally {
        if (mounted) {
          setLoading(false);
          setIsInitialLoad(false);
        }
      }
    };

    // Set up auth state listener
    const { data: listener } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("📡 Auth state changed:", event);
      if (mounted) {
        if (event === "SIGNED_IN") {
          localStorage.setItem(AUTH_CONTEXT_KEY, Date.now().toString());
        } else if (event === "SIGNED_OUT") {
          localStorage.removeItem(AUTH_CONTEXT_KEY);
        }
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
        setIsInitialLoad(false);
        
        // Reset session expired flag if user signs in again
        if (event === "SIGNED_IN") {
          setSessionExpired(false);
        }
      }
    });

    getInitialSession();

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [sessionExpired]);

  const { 
    profile: profileHook,
    loading: profileLoading, 
    error: profileError, 
    retryProfileLoad, 
    isInitialLoad: profileInitialLoad,
    user: profileUser,
    refreshProfile
  } = useProfile();

  // Set profile from hook when it changes
  useEffect(() => {
    if (profileHook) {
      console.log("📋 Setting profile from hook:", profileHook.email);
      setProfile(profileHook);
    }
  }, [profileHook]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log("🔑 Attempting login for:", email);
      await authService.signIn(email, password);
      console.log("✅ Sign in successful");
      localStorage.setItem(AUTH_CONTEXT_KEY, Date.now().toString());
      setSessionExpired(false);
    } catch (err) {
      console.error("❌ Sign in error:", err);
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: "Bitte überprüfe deine E-Mail-Adresse und dein Passwort.",
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    setLoading(true);
    try {
      console.log("📝 Attempting sign up for:", email);
      const result = await authService.signUp(email, password, metadata);
      console.log("✅ Sign up successful");
      return result;
    } catch (err) {
      console.error("❌ Sign up error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      console.log("🚪 Signing out");
      await authService.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      setSessionExpired(true);
      localStorage.removeItem(AUTH_CONTEXT_KEY);
      console.log("✅ Sign out successful");
    } catch (error) {
      console.error("❌ Sign out error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Calculate isProfileComplete from the profile data
  const isProfileComplete = profile ? !isProfileIncomplete(profile) : false;

  const value = {
    user,
    session,
    profile,
    loading,
    error,
    isInitialLoad: isInitialLoad || profileInitialLoad,
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
