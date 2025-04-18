
import { UseFormRegister } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { PreRegistrationFormData } from "@/lib/validators/pre-registration";

interface Props {
  register: UseFormRegister<PreRegistrationFormData>;
}

export function VehicleTypeSelector({ register }: Props) {
  return (
    <div className="space-y-4">
      <Label>Fahrzeugtyp</Label>
      
      <div className="space-y-4">
        <div>
          <Label>Auto (Größen)</Label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-1">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox 
                  id={`car-${size}`} 
                  {...register(`vehicle_types.car` as const)}
                  value={size}
                />
                <Label htmlFor={`car-${size}`}>{size}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {[
            { id: "motorcycle", label: "Moped/Motorrad" },
            { id: "bicycle", label: "Fahrrad/Lastenrad" },
            { id: "ship", label: "Schiff" },
            { id: "plane", label: "Flugzeug" }
          ].map(({ id, label }) => (
            <div key={id} className="flex items-center space-x-2">
              <Checkbox 
                id={id} 
                {...register(`vehicle_types.${id}` as "vehicle_types.motorcycle" | "vehicle_types.bicycle" | "vehicle_types.ship" | "vehicle_types.plane")} 
              />
              <Label htmlFor={id}>{label}</Label>
            </div>
          ))}
        </div>

        <div>
          <Label htmlFor="other">Sonstige</Label>
          <Input id="other" {...register("vehicle_types.other" as const)} />
        </div>
      </div>
    </div>
  );
}
