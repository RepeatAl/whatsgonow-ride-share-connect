
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressSectionProps {
  region: string;
  postalCode: string;
  city: string;
  street: string;
  houseNumber: string;
  addressExtra: string;
  onChange: (field: string, value: string) => void;
}

export function AddressSection({
  region,
  postalCode,
  city,
  street,
  houseNumber,
  addressExtra,
  onChange,
}: AddressSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="region">Region*</Label>
        <Input 
          id="region" 
          value={region} 
          onChange={e => onChange("region", e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="postalCode">Postleitzahl*</Label>
        <Input 
          id="postalCode" 
          value={postalCode} 
          onChange={e => onChange("postalCode", e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="city">Stadt*</Label>
        <Input 
          id="city" 
          value={city} 
          onChange={e => onChange("city", e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="street">Straße*</Label>
        <Input 
          id="street" 
          value={street} 
          onChange={e => onChange("street", e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="houseNumber">Hausnummer*</Label>
        <Input 
          id="houseNumber" 
          value={houseNumber} 
          onChange={e => onChange("houseNumber", e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="addressExtra">Adresszusatz</Label>
        <Input 
          id="addressExtra" 
          value={addressExtra} 
          onChange={e => onChange("addressExtra", e.target.value)} 
        />
      </div>
    </div>
  );
}
