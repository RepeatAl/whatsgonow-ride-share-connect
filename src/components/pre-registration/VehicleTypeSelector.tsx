
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

// Define the allowed vehicle types as a type
export type VehicleType = "S" | "M" | "L" | "XL" | "XXL" | "MOPED" | "BIKE" | "BOAT" | "PLANE";

interface VehicleSelectorProps {
  control: Control<PreRegistrationFormData>;
}

export function VehicleTypeSelector({ control }: VehicleSelectorProps) {
  const { t } = useTranslation('pre_register');
  
  const vehicleOptions: { value: VehicleType; label: string }[] = [
    { value: "S", label: "S" },
    { value: "M", label: "M" },
    { value: "L", label: "L" },
    { value: "XL", label: "XL" },
    { value: "XXL", label: "XXL" },
    { value: "MOPED", label: t("vehicle_types.moped") },
    { value: "BIKE", label: t("vehicle_types.bike") },
    { value: "BOAT", label: t("vehicle_types.boat") },
    { value: "PLANE", label: t("vehicle_types.plane") }
  ];

  return (
    <div className="space-y-3">
      <FormLabel>{t("vehicle_types.label")}</FormLabel>
      <p className="text-sm text-muted-foreground">{t("vehicle_types.car_sizes")}</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {vehicleOptions.map((option) => (
          <FormField
            key={option.value}
            control={control}
            name="vehicle_types"
            render={({ field }) => {
              const fieldValue = field.value || [];
              const checkboxId = `vehicle_${option.value}`;
              return (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      id={checkboxId}
                      checked={fieldValue.includes(option.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          // Ensure we're working with an array
                          const newValue = [...(fieldValue || []), option.value];
                          field.onChange(newValue);
                        } else {
                          const newValue = fieldValue.filter(
                            (value) => value !== option.value
                          );
                          field.onChange(newValue);
                        }
                      }}
                    />
                  </FormControl>
                  <FormLabel htmlFor={checkboxId} className="font-normal cursor-pointer">
                    {option.label}
                  </FormLabel>
                </FormItem>
              );
            }}
          />
        ))}
      </div>
    </div>
  );
}
