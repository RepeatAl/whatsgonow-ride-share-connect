
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';
import type { PreRegistrationFormData } from '@/lib/validators/pre-registration';

export const usePreRegistrationSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { getLocalizedUrl } = useLanguageMCP();

  const handleSubmit = async (data: PreRegistrationFormData) => {
    setIsSubmitting(true);
    
    try {
      console.log('📝 Starting pre-registration submission:', data);
      
      // REFACTORED: Call the pre-register function which now uses send-email-enhanced internally
      const { data: result, error } = await supabase.functions.invoke('pre-register', {
        body: {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          postal_code: data.postal_code,
          wants_driver: data.wants_driver,
          wants_cm: data.wants_cm,
          wants_sender: data.wants_sender,
          vehicle_types: data.vehicle_types || [],
          gdpr_consent: data.gdpr_consent,
        }
      });

      if (error) {
        console.error('❌ Pre-registration error:', error);
        throw new Error(error.message || 'Pre-registration failed');
      }

      console.log('✅ Pre-registration successful:', result);
      
      // Show success toast with enhanced messaging
      toast({
        title: "Vorregistrierung erfolgreich!",
        description: result?.email_sent 
          ? "Sie erhalten in Kürze eine Bestätigungs-E-Mail."
          : "Ihre Vorregistrierung wurde gespeichert.",
        variant: "default",
      });

      // Navigate to success page with proper language prefix and email parameter
      const successUrl = getLocalizedUrl(`/pre-register/success?email=${encodeURIComponent(data.email)}&status=${result?.email_sent ? 'email_sent' : 'registered'}`);
      console.log('🎯 Navigating to pre-register success:', successUrl);
      navigate(successUrl, { replace: true });

    } catch (error: any) {
      console.error('❌ Pre-registration submission failed:', error);
      
      // Show error toast
      toast({
        title: "Fehler bei der Vorregistrierung",
        description: error.message || "Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
      
      throw error; // Re-throw to be handled by the form
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit
  };
};
