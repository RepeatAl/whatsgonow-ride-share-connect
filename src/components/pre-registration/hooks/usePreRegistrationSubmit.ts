
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';
import type { PreRegistrationFormData } from '@/lib/validators/pre-registration';

export const usePreRegistrationSubmit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const submitPreRegistration = async (data: PreRegistrationFormData) => {
    console.log('🔄 Starting pre-registration submission...', { email: data.email });
    setIsLoading(true);
    
    try {
      // FIXED: Echter API-Call statt Mock - korrigierte Property-Namen
      const { data: result, error } = await supabase.functions.invoke('pre-register', {
        body: {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          postal_code: data.postal_code,
          wants_driver: data.wants_driver,
          wants_cm: data.wants_cm,
          wants_sender: data.wants_sender,
          vehicle_types: data.vehicle_types,
          gdpr_consent: data.gdpr_consent,
          language: 'de', // Standard-Sprache
          source: 'website'
        }
      });

      if (error) {
        console.error('❌ Pre-registration failed:', error);
        
        // Benutzerfreundliche Fehlermeldungen
        let errorMessage = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später noch einmal.';
        
        if (error.message?.includes('duplicate')) {
          errorMessage = 'Diese E-Mail-Adresse ist bereits registriert.';
        } else if (error.message?.includes('invalid email')) {
          errorMessage = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
        } else if (error.message?.includes('network')) {
          errorMessage = 'Netzwerkfehler. Bitte prüfen Sie Ihre Internetverbindung.';
        }
        
        toast({
          title: "Vorregistrierung fehlgeschlagen",
          description: errorMessage,
          variant: "destructive",
        });
        
        throw error;
      }

      // Erfolgreiche Verarbeitung
      console.log('✅ Pre-registration successful:', result);
      
      setIsSuccess(true);
      
      toast({
        title: "Vorregistrierung erfolgreich!",
        description: "Wir haben Ihnen eine Bestätigungs-E-Mail gesendet. Bitte prüfen Sie auch Ihren Spam-Ordner.",
      });

      return result;
      
    } catch (error: any) {
      console.error('❌ Pre-registration submission error:', error);
      
      // Fallback für unerwartete Fehler
      if (!error.message?.includes('duplicate') && !error.message?.includes('invalid')) {
        toast({
          title: "Vorregistrierung fehlgeschlagen",
          description: "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später noch einmal.",
          variant: "destructive",
        });
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setIsLoading(false);
  };

  // FIXED: Kompatible Interface für PreRegistrationForm
  return {
    submitPreRegistration,
    isLoading,
    isSubmitting: isLoading, // Alias für Kompatibilität
    handleSubmit: submitPreRegistration, // Alias für Kompatibilität
    isSuccess,
    resetForm
  };
};
