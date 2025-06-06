
import { useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

/**
 * Emergency Auth Cleanup Hook
 * Behebt Auth-Limbo-States und Session-Konflikte
 */
export const useAuthCleanup = () => {
  const emergencyCleanup = useCallback(async () => {
    console.log('🚨 Emergency Auth Cleanup initiated...');
    
    try {
      // Schritt 1: Alle lokalen Storage-Daten löschen
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

      // Schritt 2: SessionStorage auch leeren
      const sessionKeys = Object.keys(sessionStorage).filter(key => 
        key.includes('supabase') || 
        key.includes('sb-') || 
        key.includes('auth')
      );
      
      sessionKeys.forEach(key => {
        sessionStorage.removeItem(key);
        console.log(`🧹 Removed sessionStorage key: ${key}`);
      });

      // Schritt 3: Supabase Session force reset
      try {
        await supabase.auth.signOut({ scope: 'global' });
        console.log('🔐 Global signout completed');
      } catch (error) {
        console.log('⚠️ Global signout failed, continuing...', error);
      }

      // Schritt 4: Force reload für clean state
      setTimeout(() => {
        window.location.href = window.location.origin;
      }, 1000);

      return true;
    } catch (error) {
      console.error('❌ Emergency cleanup failed:', error);
      return false;
    }
  }, []);

  const softCleanup = useCallback(async () => {
    console.log('🔄 Soft Auth Cleanup...');
    
    try {
      // Nur problematische Keys entfernen, nicht alle
      const problematicKeys = [
        'supabase.auth.token',
        'sb-orgcruwmxqiwnjnkxpjb-auth-token'
      ];
      
      problematicKeys.forEach(key => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          console.log(`🧹 Removed problematic key: ${key}`);
        }
      });

      return true;
    } catch (error) {
      console.error('❌ Soft cleanup failed:', error);
      return false;
    }
  }, []);

  return {
    emergencyCleanup,
    softCleanup
  };
};
