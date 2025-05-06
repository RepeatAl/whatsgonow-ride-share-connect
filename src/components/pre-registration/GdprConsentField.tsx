
import { useTranslation } from "react-i18next";
import { Control } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PreRegistrationFormData } from "@/lib/validators/pre-registration";

interface GdprConsentFieldProps {
  control: Control<PreRegistrationFormData>;
}

export function GdprConsentField({ control }: GdprConsentFieldProps) {
  const { t } = useTranslation();
  
  return (
    <FormField
      control={control}
      name="gdpr_consent"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
          <FormControl>
            <Checkbox 
              id="gdpr_consent"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel htmlFor="gdpr_consent" className="font-normal">
              {t("pre_register.gdpr_consent")}
            </FormLabel>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
