
import { useTranslation } from "react-i18next";
import { Control } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
} from "@/components/ui/form";
import { PreRegistrationFormData } from "@/lib/validators/pre-registration";

interface RoleSelectionFieldsProps {
  control: Control<PreRegistrationFormData>;
}

export function RoleSelectionFields({ control }: RoleSelectionFieldsProps) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <Label>{t("pre_register.register_as")}</Label>
      <div className="space-y-2">
        <FormField
          control={control}
          name="wants_driver"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-2 space-y-0">
              <FormControl>
                <Checkbox 
                  id="wants_driver"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel htmlFor="wants_driver" className="font-normal">
                {t("pre_register.driver")}
              </FormLabel>
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="wants_cm"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-2 space-y-0">
              <FormControl>
                <Checkbox 
                  id="wants_cm"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel htmlFor="wants_cm" className="font-normal">
                {t("pre_register.cm")}
              </FormLabel>
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="wants_sender"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-2 space-y-0">
              <FormControl>
                <Checkbox 
                  id="wants_sender"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel htmlFor="wants_sender" className="font-normal">
                {t("pre_register.sender")}
              </FormLabel>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
