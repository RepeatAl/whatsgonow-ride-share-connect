
import { Control, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { PreRegistrationFormData } from "@/lib/validators/pre-registration";

interface Props {
  control: Control<PreRegistrationFormData>;
}

// Define the allowed vehicle types to match our Zod schema
type VehicleType = "S" | "M" | "L" | "XL" | "XXL" | "MOPED" | "BIKE" | "BOAT" | "PLANE";

export function VehicleTypeSelector({ control }: Props) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <Label>{t('pre_register.vehicle_types.label')}</Label>
      
      <div className="space-y-4">
        <div>
          <Label>{t('pre_register.vehicle_types.car_sizes')}</Label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-1">
            {(["S", "M", "L", "XL", "XXL"] as const).map((size) => (
              <Controller
                key={size}
                control={control}
                name="vehicle_types"
                render={({ field }) => {
                  const isChecked = field.value?.includes(size);
                  return (
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`vehicle-${size}`}
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          const currentValues = field.value || [];
                          if (checked) {
                            field.onChange([...currentValues, size as VehicleType]);
                          } else {
                            field.onChange(currentValues.filter(value => value !== size));
                          }
                        }}
                      />
                      <Label htmlFor={`vehicle-${size}`}>{size}</Label>
                    </div>
                  );
                }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {([
            { id: "MOPED" as const, labelKey: "pre_register.vehicle_types.moped" },
            { id: "BIKE" as const, labelKey: "pre_register.vehicle_types.bike" },
            { id: "BOAT" as const, labelKey: "pre_register.vehicle_types.boat" },
            { id: "PLANE" as const, labelKey: "pre_register.vehicle_types.plane" }
          ]).map(({ id, labelKey }) => (
            <Controller
              key={id}
              control={control}
              name="vehicle_types"
              render={({ field }) => {
                const isChecked = field.value?.includes(id);
                return (
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`vehicle-${id}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        const currentValues = field.value || [];
                        if (checked) {
                          field.onChange([...currentValues, id as VehicleType]);
                        } else {
                          field.onChange(currentValues.filter(value => value !== id));
                        }
                      }}
                    />
                    <Label htmlFor={`vehicle-${id}`}>{t(labelKey)}</Label>
                  </div>
                );
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
