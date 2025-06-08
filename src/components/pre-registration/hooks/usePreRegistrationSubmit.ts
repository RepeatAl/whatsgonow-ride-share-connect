
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
        
        // FIXED: Bessere Behandlung für bereits registrierte E-Mails
        if (response.status === 409 && result.existing) {
          // Benutzerfreundliche Behandlung für bereits registrierte E-Mails
          toast({
            title: "E-Mail bereits registriert",
            description: "Diese E-Mail-Adresse ist bereits für die Vorregistrierung angemeldet. Sie können direkt zur Registrierung wechseln.",
            variant: "default",
          });
          
          // Optional: Auto-Weiterleitung zur Registrierung
          setTimeout(() => {
            window.location.href = `/register?email=${encodeURIComponent(data.email)}`;
          }, 2000);
          
          return result;
        }
        
        // Andere Fehlermeldungen
        let errorMessage = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später noch einmal.';
        
        if (response.status === 400) {
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
      
      // FIXED: Verbesserte Erfolgsmeldung mit E-Mail-Status
      const successMessage = result.email_sent 
        ? "Wir haben Ihnen eine Bestätigungs-E-Mail gesendet. Bitte prüfen Sie auch Ihren Spam-Ordner."
        : "Ihre Vorregistrierung war erfolgreich. Die Bestätigungs-E-Mail konnte nicht versendet werden, aber Ihre Anmeldung wurde gespeichert.";
      
      toast({
        title: "Vorregistrierung erfolgreich!",
        description: successMessage,
      });

      return result;
      
    } catch (error: any) {
      console.error('❌ Pre-registration submission error:', error);
      
      // Nur Fallback-Toast wenn noch nicht von Response-Handling behandelt
      if (!error.message?.includes('duplicate') && !error.message?.includes('invalid') && !error.message?.includes('already registered')) {
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
