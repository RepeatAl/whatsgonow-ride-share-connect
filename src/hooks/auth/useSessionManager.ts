
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/lib/supabaseClient';

const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour
const AUTH_TIMESTAMP_KEY = "whatsgonow_auth_timestamp";

/**
 * Hook that manages the authentication session state and expiration
 * Optimiert für aktuelle Supabase SDK und bessere Browser-Kompatibilität
 */
export function useSessionManager() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const supabase = getSupabaseClient();

  // Initialize auth state and set up listeners
  useEffect(() => {
    console.log("🔄 Setting up session manager");
    let mounted = true;

    // Auth-Änderungen überwachen - ZUERST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("🔐 Auth state changed:", event);
      
      if (!mounted) return;
      
      // Update state synchronously
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Handle specific events
      if (event === 'SIGNED_IN' && currentSession) {
        // Defer additional operations to prevent deadlocks
        setTimeout(() => {
          if (mounted) {
            setSessionExpired(false);
            // Update timestamp for activity tracking
            try {
              localStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
            } catch (e) {
              // Fallback for non-browser environments
            }
          }
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        setTimeout(() => {
          if (mounted) {
            try {
              localStorage.removeItem(AUTH_TIMESTAMP_KEY);
            } catch (e) {
              // Fallback for non-browser environments
            }
          }
        }, 0);
      }
      
      // Eindeutig Lade-Status aktualisieren
      if (mounted) {
        setLoading(false);
        setIsInitialLoad(false);
      }
    });

    // DANN erst: Aktuelle Session einmalig beim Mount holen
    supabase.auth
      .getSession()
      .then(({ data, error: sessionError }) => {
        if (sessionError) {
          console.error("❌ Fehler beim Abrufen der Session:", sessionError);
        }

        if (mounted) {
          setSession(data.session);
          setUser(data.session?.user ?? null);
          console.log("✅ Aktuelle Session geladen:", !!data.session?.user);
          
          // Update timestamp if we have a session
          if (data.session?.user) {
            try {
              localStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
            } catch (e) {
              // Fallback for non-browser environments
            }
          }
        }
      })
      .catch((err) => {
        console.error("❌ Unerwarteter Fehler bei Session-Init:", err);
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
          setIsInitialLoad(false);
        }
      });

    // Set up session expiration checker only in browser context
    let interval: number | NodeJS.Timeout | undefined;
    
    if (typeof window !== 'undefined') {
      const checkSessionExpiration = () => {
        try {
          const lastActivity = localStorage.getItem(AUTH_TIMESTAMP_KEY);
          if (lastActivity && user) {
            const timePassed = Date.now() - parseInt(lastActivity);
            if (timePassed > SESSION_TIMEOUT) {
              console.log("🕒 Session expired");
              setSessionExpired(true);
              return true;
            }
          }
          return false;
        } catch (e) {
          // Fallback für nicht-Browser Umgebungen
          return false;
        }
      };

      interval = setInterval(checkSessionExpiration, 60000);

      // Reset timer on user activity - nur in Browser-Umgebung
      const updateTimestamp = () => {
        if (user && !sessionExpired) {
          try {
            localStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
          } catch (e) {
            // Ignorieren in Nicht-Browser-Umgebungen
          }
        }
      };

      window.addEventListener('click', updateTimestamp);
      window.addEventListener('keypress', updateTimestamp);
      window.addEventListener('scroll', updateTimestamp);
      window.addEventListener('mousemove', updateTimestamp);

      // Cleanup event listeners
      return () => {
        mounted = false;
        subscription.unsubscribe();
        if (interval) clearInterval(interval);
        window.removeEventListener('click', updateTimestamp);
        window.removeEventListener('keypress', updateTimestamp);
        window.removeEventListener('scroll', updateTimestamp);
        window.removeEventListener('mousemove', updateTimestamp);
      };
    }

    // Für Nicht-Browser-Umgebungen
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Keine Dependencies, um die volle Kontrolle über den Lebenszyklus zu haben

  return {
    user,
    session,
    loading,
    isInitialLoad,
    sessionExpired,
    setSessionExpired
  };
}
