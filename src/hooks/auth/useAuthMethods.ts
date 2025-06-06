
import { useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';

export const useAuthMethods = () => {
  // Sign In
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      console.log('🔐 OptimizedAuth: Starting sign in for:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ OptimizedAuth: Sign in error:', error);
        throw error;
      }

      console.log('✅ OptimizedAuth: Sign in successful');
      
      toast({
        title: "Anmeldung erfolgreich",
        description: "Willkommen zurück!",
      });
      
    } catch (error: any) {
      console.error('❌ OptimizedAuth: Sign in failed:', error);
      throw error;
    }
  }, []);

  // Sign Up
  const signUp = useCallback(async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      console.log('📝 OptimizedAuth: Starting sign up for:', email);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/de/dashboard`
        }
      });

      if (error) {
        console.error('❌ OptimizedAuth: Sign up error:', error);
        throw error;
      }

      console.log('✅ OptimizedAuth: Sign up successful');
      
      toast({
        title: "Registrierung erfolgreich",
        description: data.user && !data.session ? 
          "Bitte bestätigen Sie Ihre E-Mail-Adresse." : 
          "Willkommen bei Whatsgonow!"
      });
      
    } catch (error: any) {
      console.error('❌ OptimizedAuth: Sign up failed:', error);
      throw error;
    }
  }, []);

  // Sign Out
  const signOut = useCallback(async (navigate: (path: string, options?: any) => void, currentLanguage: string) => {
    try {
      console.log('🚪 OptimizedAuth: Signing out...');

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ OptimizedAuth: Sign out error:', error);
      }

      console.log('✅ OptimizedAuth: Sign out completed');
      
      toast({
        title: "Abmeldung erfolgreich",
        description: "Auf Wiedersehen!"
      });

      // Navigation zur Startseite
      navigate(`/${currentLanguage}`, { replace: true });
      
    } catch (error: any) {
      console.error('❌ OptimizedAuth: Sign out failed:', error);
      throw error;
    }
  }, []);

  // Emergency Reset für schwere Auth-Probleme
  const emergencyReset = useCallback(async () => {
    console.log('🚨 OptimizedAuth: Emergency reset initiated...');
    
    try {
      // Alle lokalen Storage-Daten löschen
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.includes('supabase') || 
        key.includes('sb-') || 
        key.includes('auth') ||
        key.includes('whatsgonow')
      );
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log(`🧹 Removed localStorage key: ${key}`);
      });

      // SessionStorage auch leeren
      const sessionKeys = Object.keys(sessionStorage).filter(key => 
        key.includes('supabase') || 
        key.includes('sb-') || 
        key.includes('auth')
      );
      
      sessionKeys.forEach(key => {
        sessionStorage.removeItem(key);
        console.log(`🧹 Removed sessionStorage key: ${key}`);
      });

      // Supabase Session force reset
      try {
        await supabase.auth.signOut({ scope: 'global' });
        console.log('🔐 Global signout completed');
      } catch (error) {
        console.log('⚠️ Global signout failed, continuing...', error);
      }

      // Force reload für clean state
      setTimeout(() => {
        window.location.href = window.location.origin;
      }, 1000);

      return true;
    } catch (error) {
      console.error('❌ Emergency reset failed:', error);
      return false;
    }
  }, []);

  return {
    signIn,
    signUp,
    signOut,
    emergencyReset
  };
};
