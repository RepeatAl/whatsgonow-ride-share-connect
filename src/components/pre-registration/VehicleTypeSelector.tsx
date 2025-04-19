
import { UseFormRegister } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
                  id={`vehicle-${size}`} 
                  value={size}
                  {...register("vehicle_types")}
                />
                <Label htmlFor={`vehicle-${size}`}>{size}</Label>
              </div>
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
            <div key={id} className="flex items-center space-x-2">
              <Checkbox 
                id={`vehicle-${id}`}
                value={id}
                {...register("vehicle_types")}
              />
              <Label htmlFor={`vehicle-${id}`}>{label}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
