
import { Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl 
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { PreRegistrationFormData } from "@/lib/validators/pre-registration";

interface RoleSelectionFieldsProps {
  control: Control<PreRegistrationFormData>;
}

export function RoleSelectionFields({ control }: RoleSelectionFieldsProps) {
  const { t } = useTranslation('pre_register');
  
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">{t("register_as")}</h3>
      <div className="space-y-2">
        <FormField
          control={control}
          name="wants_driver"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal cursor-pointer">{t("driver")}</FormLabel>
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="wants_cm"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal cursor-pointer">{t("cm")}</FormLabel>
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="wants_sender"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal cursor-pointer">{t("sender")}</FormLabel>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
