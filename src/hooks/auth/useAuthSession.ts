
import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

export function useAuthSession() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("🔄 AuthSession: Initializing auth session");
    
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("🔑 Auth event:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      }
    );

    // Then check for current session
    supabase.auth.getSession().then(({ data: { session: currentSession }, error: sessionError }) => {
      if (sessionError) {
        console.error("❌ Error fetching session:", sessionError);
        setError(sessionError);
      }
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
      
      console.log("🔍 Auth session initialized, user authenticated:", !!currentSession?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { 
    user, 
    session, 
    loading, 
    error, 
    setUser, 
    setSession 
  };
}
