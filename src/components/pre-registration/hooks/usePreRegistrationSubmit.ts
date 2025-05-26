
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import { useToast } from '@/hooks/use-toast';
import { PreRegistrationFormData } from '@/lib/validators/pre-registration';

export interface SubmitResult {
  success: boolean;
  fieldErrors?: Record<string, string>;
}

export const usePreRegistrationSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { getLocalizedUrl } = useLanguageMCP();
  const { toast } = useToast();

  const handleSubmit = async (data: PreRegistrationFormData): Promise<SubmitResult> => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call for now
      console.log('Pre-registration data:', data);
      
      // Mock validation
      const fieldErrors: Record<string, string> = {};
      
      if (!data.wants_driver && !data.wants_cm && !data.wants_sender) {
        fieldErrors.wants_driver = 'Bitte wähle mindestens eine Rolle aus';
        return { success: false, fieldErrors };
      }
      
      if (data.wants_driver && (!data.vehicle_types || data.vehicle_types.length === 0)) {
        fieldErrors.vehicle_types = 'Bitte wähle mindestens einen Fahrzeugtyp aus';
        return { success: false, fieldErrors };
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success toast
      toast({
        title: "Voranmeldung erfolgreich!",
        description: "Wir haben deine Anmeldung erhalten. Du erhältst bald weitere Informationen per E-Mail.",
        duration: 5000,
      });
      
      // Navigate to success page
      navigate(getLocalizedUrl('/pre-register/success'));
      
      return { success: true };
      
    } catch (error) {
      console.error('Pre-registration submission error:', error);
      
      toast({
        title: "Fehler bei der Anmeldung",
        description: "Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.",
        variant: "destructive",
        duration: 5000,
      });
      
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting
  };
};
