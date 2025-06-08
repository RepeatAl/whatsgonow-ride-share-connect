
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import type { PreRegistrationFormData } from '@/lib/validators/pre-registration';

export const usePreRegistrationSubmit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const submitPreRegistration = async (data: PreRegistrationFormData) => {
    console.log('🔄 Starting pre-registration submission...', { email: data.email });
    setIsLoading(true);
    
    try {
      // FIXED: Direkter fetch() Aufruf ohne Supabase Client Auth-Abhängigkeiten
      const response = await fetch('https://orgcruwmxqiwnjnkxpjb.supabase.co/functions/v1/pre-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
          // WICHTIG: Kein Authorization Header für anonyme Calls
        },
        body: JSON.stringify({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          postal_code: data.postal_code,
          wants_driver: data.wants_driver,
          wants_cm: data.wants_cm,
          wants_sender: data.wants_sender,
          vehicle_types: data.vehicle_types,
          gdpr_consent: data.gdpr_consent,
          language: 'de',
          source: 'website'
        })
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ Pre-registration failed:', result);
        
        // Benutzerfreundliche Fehlermeldungen
        let errorMessage = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später noch einmal.';
        
        if (response.status === 409 || result.error?.includes('already registered')) {
          errorMessage = 'Diese E-Mail-Adresse ist bereits registriert.';
        } else if (response.status === 400) {
          if (result.error?.includes('Invalid email')) {
            errorMessage = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
          } else if (result.error?.includes('Missing required fields')) {
            errorMessage = 'Bitte füllen Sie alle Pflichtfelder aus.';
          } else if (result.error?.includes('GDPR consent')) {
            errorMessage = 'Die DSGVO-Einwilligung ist erforderlich.';
          }
        }
        
        toast({
          title: "Vorregistrierung fehlgeschlagen",
          description: errorMessage,
          variant: "destructive",
        });
        
        throw new Error(result.error || 'Pre-registration failed');
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
      
      // Nur Fallback-Toast wenn noch nicht von Response-Handling behandelt
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
