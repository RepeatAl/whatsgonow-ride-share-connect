
import { useTranslation } from "react-i18next";
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PreRegistrationFormData } from "@/lib/validators/pre-registration";

interface PersonalInfoFieldsProps {
  control: Control<PreRegistrationFormData>;
}

export function PersonalInfoFields({ control }: PersonalInfoFieldsProps) {
  const { t } = useTranslation('pre_register');
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="first_name">{t("first_name")}</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  id="first_name"
                  name="first_name"
                  autoComplete="given-name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="last_name">{t("last_name")}</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  id="last_name"
                  name="last_name"
                  autoComplete="family-name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="email">{t("email")}</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                type="email" 
                id="email"
                name="email"
                autoComplete="email"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="postal_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="postal_code">{t("postal_code")}</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                id="postal_code"
                name="postal_code"
                autoComplete="postal-code"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
