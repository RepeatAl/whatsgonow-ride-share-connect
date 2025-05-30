
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { PreRegistrationFormData } from "@/lib/validators/pre-registration";
import { supabase } from "@/lib/supabaseClient";

export function usePreRegistrationSubmit() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (data: PreRegistrationFormData) => {
    console.log("Form data on submit:", data);
    setIsSubmitting(true);
    
    try {
      // Get session token instead of using hardcoded anon key
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      console.log("Sending data to pre-register endpoint with auth token");
      
      const response = await fetch("https://orgcruwmxqiwnjnkxpjb.supabase.co/functions/v1/pre-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken || ""}`
        },
        body: JSON.stringify(data)
      });
      
      // Improved error handling
      if (!response.ok) {
        // Try to parse error response
        let errorMessage;
        try {
          const errorData = await response.json();
          console.error("Pre-registration error response:", errorData);
          
          if (errorData.errors) {
            return { success: false, fieldErrors: errorData.errors };
          }
          errorMessage = errorData.error || t("errors.registration_failed");
        } catch (parseError) {
          // If we can't parse JSON, use the text
          const errorText = await response.text();
          console.error("Pre-registration error text:", errorText);
          errorMessage = t("errors.registration_failed");
        }
        
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      console.log("Pre-registration success:", result);
      
      toast.success(t("pre_register.success.title"), {
        description: t("pre_register.success.description")
      });

      // Use React Router's navigate instead of window.location.href for client-side navigation
      navigate("/pre-register/success", { replace: true });
      return { success: true };
    } catch (error) {
      console.error("Pre-registration error:", error);
      setIsSubmitting(false);
      
      toast.error(t("errors.registration_failed"), {
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
