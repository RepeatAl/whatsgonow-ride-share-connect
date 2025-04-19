
import { Control, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { PreRegistrationFormData } from "@/lib/validators/pre-registration";

interface Props {
  control: Control<PreRegistrationFormData>;
}

export function VehicleTypeSelector({ control }: Props) {
  return (
    <div className="space-y-4">
      <Label>Fahrzeugtyp</Label>
      
      <div className="space-y-4">
        <div>
          <Label>Auto (Größen)</Label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-1">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
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
                            field.onChange([...currentValues, size]);
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
          {[
            { id: "MOPED", label: "Moped/Motorrad" },
            { id: "BIKE", label: "Fahrrad/Lastenrad" },
            { id: "BOAT", label: "Schiff" },
            { id: "PLANE", label: "Flugzeug" }
          ].map(({ id, label }) => (
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
                          field.onChange([...currentValues, id]);
                        } else {
                          field.onChange(currentValues.filter(value => value !== id));
                        }
                      }}
                    />
                    <Label htmlFor={`vehicle-${id}`}>{label}</Label>
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
