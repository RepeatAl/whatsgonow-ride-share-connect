
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
      // FIXED: Echter API-Call statt Mock
      const { data: result, error } = await supabase.functions.invoke('pre-register', {
        body: {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          postal_code: data.postalCode,
          wants_driver: data.wantsDriver,
          wants_cm: data.wantsCM,
          wants_sender: data.wantsSender,
          vehicle_types: data.vehicleTypes,
          gdpr_consent: data.gdprConsent,
          language: data.language || 'de',
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

  return {
    submitPreRegistration,
    isLoading,
    isSuccess,
    resetForm
  };
};
