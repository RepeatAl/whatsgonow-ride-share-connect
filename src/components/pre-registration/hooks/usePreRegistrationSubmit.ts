
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
      // Enhanced payload with required fields
      const payload = {
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
        source: 'website',
        consent_version: '1.0'
      };

      console.log('📤 Sending payload to pre-register endpoint:', payload);

      // ENHANCED: Enhanced fetch with retry mechanism
      let response;
      let retryCount = 0;
      const maxRetries = 2; // Increased from 1 to 2 for better reliability

      while (retryCount <= maxRetries) {
        try {
          response = await fetch('https://orgcruwmxqiwnjnkxpjb.supabase.co/functions/v1/pre-register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
              // WICHTIG: Kein Authorization Header für anonyme Calls
            },
            body: JSON.stringify(payload)
          });
          break;
        } catch (fetchError) {
          retryCount++;
          if (retryCount > maxRetries) {
            throw fetchError;
          }
          console.warn(`⚠️ Fetch attempt ${retryCount} failed, retrying...`, fetchError);
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }

      if (!response) {
        throw new Error('Network request failed after retries');
      }

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ Pre-registration failed:', result);
        
        // ENHANCED: Better handling for already registered emails with clear user guidance
        if (response.status === 409 && result.existing) {
          // User-friendly handling for already registered emails
          toast({
            title: "E-Mail bereits registriert",
            description: "Diese E-Mail-Adresse ist bereits angemeldet. Sie werden zur Registrierung weitergeleitet, um Ihr Konto zu vervollständigen.",
            variant: "default",
          });
          
          // Auto-redirect to registration with email parameter and status
          setTimeout(() => {
            const redirectUrl = `/register?email=${encodeURIComponent(data.email)}&status=duplicate&hint=pre_register`;
            console.log('🔄 Redirecting to registration:', redirectUrl);
            window.location.href = redirectUrl;
          }, 2500); // Increased delay for better UX
          
          return result;
        }
        
        // Enhanced error message handling with more specific guidance
        let errorMessage = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später noch einmal.';
        
        if (response.status === 400) {
          if (result.error?.includes('Invalid email')) {
            errorMessage = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
          } else if (result.error?.includes('Missing required fields')) {
            errorMessage = 'Bitte füllen Sie alle Pflichtfelder aus.';
          } else if (result.error?.includes('GDPR consent')) {
            errorMessage = 'Die DSGVO-Einwilligung ist erforderlich für die Vorregistrierung.';
          } else if (result.error?.includes('vehicle_types')) {
            errorMessage = 'Als Fahrer müssen Sie mindestens einen Fahrzeugtyp auswählen.';
          }
        } else if (response.status === 500) {
          errorMessage = 'Serverfehler. Bitte versuchen Sie es in ein paar Minuten erneut.';
        }
        
        toast({
          title: "Vorregistrierung fehlgeschlagen",
          description: errorMessage,
          variant: "destructive",
        });
        
        throw new Error(result.error || 'Pre-registration failed');
      }

      // ENHANCED: Successful processing with detailed email status feedback
      console.log('✅ Pre-registration successful:', result);
      
      setIsSuccess(true);
      
      // ENHANCED: Improved success message based on email status with clear next steps
      let successMessage;
      let toastVariant: "default" | "destructive" = "default";
      
      if (result.email_sent) {
        successMessage = "Wir haben Ihnen eine Bestätigungs-E-Mail gesendet. Bitte prüfen Sie auch Ihren Spam-Ordner. Sie können sich auch direkt vollständig registrieren.";
      } else if (result.email_send_failed) {
        successMessage = "Ihre Vorregistrierung wurde erfolgreich gespeichert. Die Bestätigungs-E-Mail konnte jedoch nicht versendet werden. Sie können sich trotzdem jetzt vollständig registrieren.";
        toastVariant = "default"; // Still success, just with warning
      } else {
        successMessage = "Ihre Vorregistrierung war erfolgreich. Sie können nun zur vollständigen Registrierung wechseln.";
      }
      
      toast({
        title: "Vorregistrierung erfolgreich!",
        description: successMessage,
        variant: toastVariant,
      });

      // ENHANCED: Auto-redirect to success page with comprehensive status
      setTimeout(() => {
        const status = result.email_sent ? 'success' : 'email_failed';
        const successUrl = `/pre-register/success?status=${status}&email=${encodeURIComponent(data.email)}`;
        console.log('🎯 Redirecting to success page:', successUrl);
        window.location.href = successUrl;
      }, 2000); // Slightly increased delay for better message visibility

      return result;
      
    } catch (error: any) {
      console.error('❌ Pre-registration submission error:', error);
      
      // Enhanced error handling with specific logging and user guidance
      if (error.message?.includes('fetch')) {
        toast({
          title: "Verbindungsfehler",
          description: "Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.",
          variant: "destructive",
        });
      } else if (!error.message?.includes('duplicate') && !error.message?.includes('invalid')) {
        toast({
          title: "Vorregistrierung fehlgeschlagen",
          description: "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später noch einmal oder kontaktieren Sie den Support.",
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

  // ENHANCED: Better interface compatibility with additional helper methods
  return {
    submitPreRegistration,
    isLoading,
    isSubmitting: isLoading, // Alias for compatibility
    handleSubmit: submitPreRegistration, // Alias for compatibility
    isSuccess,
    resetForm,
    // Additional helper for UI states
    canSubmit: !isLoading && !isSuccess
  };
};
