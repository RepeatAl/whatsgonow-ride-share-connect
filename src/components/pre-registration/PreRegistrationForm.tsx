
import React, { Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { preRegistrationSchema, type PreRegistrationFormData } from "@/lib/validators/pre-registration";
import { VehicleTypeSelector } from "./VehicleTypeSelector";
import { usePreRegistrationSubmit } from "./hooks/usePreRegistrationSubmit";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { RoleSelectionFields } from "./RoleSelectionFields";
import { GdprConsentField } from "./GdprConsentField";
import { StableLoading } from "@/components/ui/stable-loading";
import { useAppInitialization } from "@/hooks/useAppInitialization";

const PreRegistrationFormContent = () => {
  const { t } = useTranslation('pre_register');
  const { isSubmitting, handleSubmit: submitRegistration } = usePreRegistrationSubmit();
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string>("");
  
  const form = useForm<PreRegistrationFormData>({
    resolver: zodResolver(preRegistrationSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      postal_code: "",
      wants_driver: false,
      wants_cm: false,
      wants_sender: false,
      vehicle_types: [],
      gdpr_consent: false,
    }
  });

  const wantsDriver = form.watch("wants_driver");

  const onSubmit = async (data: PreRegistrationFormData) => {
    setSubmitError("");
    setSubmitSuccess(false);
    
    const result = await submitRegistration(data);
    
    if (!result.success && result.fieldErrors) {
      Object.entries(result.fieldErrors).forEach(([field, message]) => {
        form.setError(field as any, {
          message: message as string
        });
      });
      setSubmitError(t("errors.form_validation", { ns: 'errors' }));
    } else if (!result.success) {
      setSubmitError(t("errors.registration_failed", { ns: 'errors' }));
    } else {
      setSubmitSuccess(true);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-xl mx-auto">
        {submitError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}
        
        {submitSuccess && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              {t("success.title")}
            </AlertDescription>
          </Alert>
        )}

        <PersonalInfoFields control={form.control} />
        
        <RoleSelectionFields control={form.control} />

        {wantsDriver && (
          <div className="space-y-2">
            <VehicleTypeSelector control={form.control} />
            {form.formState.errors.vehicle_types && (
              <p className="text-sm text-red-500">{t('vehicle_types.error', { ns: 'errors' })}</p>
            )}
          </div>
        )}

        <GdprConsentField control={form.control} />

        <Button 
          type="submit" 
          className="w-full" 
          disabled={!form.formState.isValid || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              {t("processing")}
            </>
          ) : (
            t("submit")
          )}
        </Button>
      </form>
    </Form>
  );
};

export function PreRegistrationForm() {
  const appState = useAppInitialization(['pre_register', 'errors']);
  
  if (!appState.isReady) {
    return <StableLoading variant="form" message="Formular wird vorbereitet..." />;
  }

  return (
    <Suspense fallback={<StableLoading variant="form" />}>
      <PreRegistrationFormContent />
    </Suspense>
  );
}
