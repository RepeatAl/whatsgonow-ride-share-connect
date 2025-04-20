import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour
const AUTH_CONTEXT_KEY = "whatsgonow_auth_timestamp";

export function useSessionManager() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    console.log("🔄 Setting up session manager");
    let mounted = true;

    const initSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (initialSession?.user) {
          console.log("✅ Found existing session");
          setSession(initialSession);
          setUser(initialSession.user);
          localStorage.setItem(AUTH_CONTEXT_KEY, Date.now().toString());
          setSessionExpired(false);
        }
      } catch (err) {
        console.error("❌ Session init error:", err);
      } finally {
        if (mounted) {
          setLoading(false);
          setIsInitialLoad(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("🔐 Auth state changed:", event);
      
      if (event === 'SIGNED_IN' && currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
        setSessionExpired(false);
        localStorage.setItem(AUTH_CONTEXT_KEY, Date.now().toString());
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        localStorage.removeItem(AUTH_CONTEXT_KEY);
      }
      
      setLoading(false);
      setIsInitialLoad(false);
    });

    initSession();

    const checkSessionExpiration = () => {
      const lastActivity = localStorage.getItem(AUTH_CONTEXT_KEY);
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
        localStorage.setItem(AUTH_CONTEXT_KEY, Date.now().toString());
      }
    };

    window.addEventListener('click', updateTimestamp);
    window.addEventListener('keypress', updateTimestamp);
    window.addEventListener('scroll', updateTimestamp);
    window.addEventListener('mousemove', updateTimestamp);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearInterval(interval);
      window.removeEventListener('click', updateTimestamp);
      window.removeEventListener('keypress', updateTimestamp);
      window.removeEventListener('scroll', updateTimestamp);
      window.removeEventListener('mousemove', updateTimestamp);
    };
  }, []);

  return {
    user,
    session,
    loading,
    isInitialLoad,
    sessionExpired,
    setSessionExpired
  };
}
