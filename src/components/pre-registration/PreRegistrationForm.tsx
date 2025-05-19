
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import { preRegistrationSchema, type PreRegistrationFormData } from "@/lib/validators/pre-registration";
import { VehicleTypeSelector } from "./VehicleTypeSelector";
import { usePreRegistrationSubmit } from "./hooks/usePreRegistrationSubmit";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { RoleSelectionFields } from "./RoleSelectionFields";
import { GdprConsentField } from "./GdprConsentField";

export function PreRegistrationForm() {
  const { t } = useTranslation('pre_register');
  const { isSubmitting, handleSubmit: submitRegistration } = usePreRegistrationSubmit();
  
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
    const result = await submitRegistration(data);
    
    if (!result.success && result.fieldErrors) {
      Object.entries(result.fieldErrors).forEach(([field, message]) => {
        form.setError(field as any, {
          message: message as string
        });
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-xl mx-auto">
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
          {isSubmitting ? t("processing") : t("submit")}
        </Button>
      </form>
    </Form>
  );
}
