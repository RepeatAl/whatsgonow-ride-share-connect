
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "@/hooks/use-toast";
import { PreRegistrationFormData } from "@/lib/validators/pre-registration";
import { useLanguage } from "@/contexts/language";
import i18next from "i18next";

export function usePreRegistrationSubmit() {
  const { t } = useTranslation('pre_register');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { getLocalizedUrl } = useLanguage();
  
  const handleSubmit = async (data: PreRegistrationFormData) => {
    console.log("Form data on submit:", data);
    setIsSubmitting(true);
    
    try {
      // Add the current language to the form data
      const submissionData = {
        ...data,
        language: i18next.language
      };
      
      console.log("Sending data to pre-register endpoint (public/anonymous):", submissionData.language);
      
      const response = await fetch("https://orgcruwmxqiwnjnkxpjb.supabase.co/functions/v1/pre-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": i18next.language,
          // No Authorization header - this is a public endpoint
        },
        body: JSON.stringify(submissionData)
      });
      
      // Improved error handling
      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          console.error("Pre-registration error response:", errorData);
          
          if (errorData.errors) {
            // Show form field errors as toast
            Object.entries(errorData.errors).forEach(([field, message]) => {
              toast({
                variant: "destructive",
                title: t("errors.field_error", { field, ns: 'errors' }),
                description: message as string
              });
            });
            return { success: false, fieldErrors: errorData.errors };
          }
          errorMessage = errorData.error || t("errors.registration_failed", { ns: 'errors' });
        } catch (parseError) {
          const errorText = await response.text();
          console.error("Pre-registration error text:", errorText);
          errorMessage = t("errors.registration_failed", { ns: 'errors' });
        }
        
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      console.log("Pre-registration success:", result);
      
      // Show success toast
      toast({
        title: t("success.title"),
        description: t("success.description"),
        variant: "default"
      });

      // Navigate to localized success page
      const successUrl = getLocalizedUrl("/pre-register/success");
      navigate(successUrl, { replace: true });
      return { success: true };
    } catch (error) {
      console.error("Pre-registration error:", error);
      
      // Show error toast with proper translation
      toast({
        variant: "destructive",
        title: t("errors.registration_failed", { ns: 'errors' }),
        description: error instanceof Error ? error.message : t("common.retry")
      });
      
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit
  };
}
