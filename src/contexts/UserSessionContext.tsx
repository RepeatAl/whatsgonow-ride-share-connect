
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import type { UserProfile } from "@/types/auth";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { fetchUserRegion } from "@/utils/regionUtils";

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
  signIn: (email: string, password: string) => Promise<void>;
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
  const navigate = useNavigate();
  
  // Session state
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  
  // Profile state
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileError, setProfileError] = useState<Error | null>(null);
  
  // Region state
  const [region, setRegion] = useState<string | null>(null);
  const [isTest, setIsTest] = useState(false);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Initialize auth state listener
  useEffect(() => {
    console.log("🔄 UserSessionContext: Initializing auth state listener");
    let mounted = true;

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("🔐 Auth state changed:", event);
      
      if (!mounted) return;
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Reset session expired flag on sign in
      if (event === 'SIGNED_IN') {
        setSessionExpired(false);
        localStorage.setItem("whatsgonow_auth_timestamp", Date.now().toString());
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        localStorage.removeItem("whatsgonow_auth_timestamp");
      }
    });

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (!mounted) return;
      
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        localStorage.setItem("whatsgonow_auth_timestamp", Date.now().toString());
      }
      
      setLoading(false);
      setIsInitialLoad(false);
    }).catch(err => {
      console.error("❌ Session init error:", err);
      if (mounted) {
        setLoading(false);
        setIsInitialLoad(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Handle profile loading when user changes
  useEffect(() => {
    let mounted = true;
    
    const loadUserProfile = async () => {
      if (!user) {
        if (mounted) {
          setProfile(null);
          setRegion(null);
        }
        return;
      }
      
      try {
        setProfileError(null);
        
        // Fetch profile
        const { data: userProfile, error: profileError } = await supabase
          .from("profiles")
          .select(`
            user_id,
            email,
            first_name,
            last_name,
            phone,
            role,
            company_name,
            region,
            postal_code,
            city,
            street,
            house_number,
            address_extra,
            profile_complete,
            onboarding_complete,
            name_affix,
            avatar_url,
            verified,
            can_become_driver,
            dashboard_access_enabled,
            wants_to_upload_items
          `)
          .eq("user_id", user.id)
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        if (userProfile) {
          const transformedProfile: UserProfile = {
            ...userProfile,
            name: `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || 'New User'
          };
          
          if (mounted) {
            setProfile(transformedProfile);
            setRegion(transformedProfile.region || null);
            console.log("✅ Profile loaded successfully");
          }
        } else {
          console.warn("⚠️ No profile found for user", user.id);
        }

        // Check if region is a test region
        const userRegion = await fetchUserRegion(supabase, user.id);
        if (mounted) {
          setRegion(userRegion);
          setIsTest(isTestRegion(userRegion));
        }
      } catch (error) {
        console.error("❌ Error loading profile:", error);
        if (mounted) {
          setProfileError(error as Error);
        }
      }
    };

    loadUserProfile();

    return () => {
      mounted = false;
    };
  }, [user]);

  // Session expiration checker
  useEffect(() => {
    const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour
    
    const checkSessionExpiration = () => {
      const lastActivity = localStorage.getItem("whatsgonow_auth_timestamp");
      if (lastActivity && user) {
        const timePassed = Date.now() - parseInt(lastActivity);
        if (timePassed > SESSION_TIMEOUT) {
          console.log("🕒 Session expired");
          setSessionExpired(true);
          return true;
        }
      }
      return false;
    };

    const interval = setInterval(checkSessionExpiration, 60000);
    
    const updateTimestamp = () => {
      if (user && !sessionExpired) {
        localStorage.setItem("whatsgonow_auth_timestamp", Date.now().toString());
      }
    };
    
    // Reset timer on user activity
    window.addEventListener('click', updateTimestamp);
    window.addEventListener('keypress', updateTimestamp);
    window.addEventListener('scroll', updateTimestamp);
    window.addEventListener('mousemove', updateTimestamp);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('click', updateTimestamp);
      window.removeEventListener('keypress', updateTimestamp);
      window.removeEventListener('scroll', updateTimestamp);
      window.removeEventListener('mousemove', updateTimestamp);
    };
  }, [user, sessionExpired]);

  // Auth methods
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      setSessionExpired(false);
      return data;
    } catch (err: any) {
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: err?.message || "Bitte überprüfe deine E-Mail-Adresse und dein Passwort.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Registrierung erfolgreich",
        description: "Bestätige deine E‑Mail-Adresse, um fortzufahren."
      });

      return data;
    } catch (err: any) {
      toast({
        title: "Registrierung fehlgeschlagen",
        description: err?.message || "Bitte versuche es später erneut.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate("/", { replace: true });
    } catch (error: any) {
      toast({
        title: "Fehler beim Abmelden",
        description: error?.message || "Bitte versuche es später erneut.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      setProfileError(null);
      
      const { data: userProfile, error: profileError } = await supabase
        .from("profiles")
        .select(`
          user_id,
          email,
          first_name,
          last_name,
          phone,
          role,
          company_name,
          region,
          postal_code,
          city,
          street,
          house_number,
          address_extra,
          profile_complete,
          onboarding_complete,
          name_affix,
          avatar_url,
          verified,
          can_become_driver,
          dashboard_access_enabled,
          wants_to_upload_items
        `)
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (userProfile) {
        const transformedProfile: UserProfile = {
          ...userProfile,
          name: `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || 'New User'
        };
        
        setProfile(transformedProfile);
        setRegion(userProfile.region || null);
        console.log("🔄 Profile refreshed");
      }
    } catch (error) {
      console.error("❌ Error refreshing profile:", error);
      setProfileError(error as Error);
    }
  };

  // Helper function to check if region is test
  const isTestRegion = (region: string | null | undefined): boolean => {
    const TEST_REGION_PREFIXES = ["test", "us-ca", "us-ny", "uk-ldn"];
    return region ? TEST_REGION_PREFIXES.some(prefix => 
      region.toLowerCase().startsWith(prefix)
    ) : false;
  };

  const value = {
    user,
    session,
    profile,
    region,
    isTest,
    loading,
    isInitialLoad,
    sessionExpired,
    setSessionExpired,
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
