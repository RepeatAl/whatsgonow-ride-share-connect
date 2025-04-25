
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PersonalInfoProps {
  firstName: string;
  lastName: string;
  nameAffix: string;
  email: string;
  phone: string;
  companyName?: string;
  isBusinessAccount?: boolean;
  onChange: (field: string, value: string) => void;
}

export function PersonalInfoSection({
  firstName,
  lastName,
  nameAffix,
  email,
  phone,
  companyName,
  isBusinessAccount,
  onChange,
}: PersonalInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="firstName">Vorname*</Label>
        <Input 
          id="firstName" 
          value={firstName} 
          onChange={e => onChange("firstName", e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="lastName">Nachname*</Label>
        <Input 
          id="lastName" 
          value={lastName} 
          onChange={e => onChange("lastName", e.target.value)}
          required
        />
      </div>
      
      {isBusinessAccount && (
        <div className="md:col-span-2">
          <Label htmlFor="companyName">Firmenname*</Label>
          <Input 
            id="companyName" 
            value={companyName} 
            onChange={e => onChange("companyName", e.target.value)}
            required
          />
        </div>
      )}

      <div className="md:col-span-2">
        <Label htmlFor="email">E-Mail*</Label>
        <Input 
          id="email" 
          value={email} 
          onChange={e => onChange("email", e.target.value)}
          required 
          type="email"
        />
      </div>

      <div>
        <Label htmlFor="phone">Telefon*</Label>
        <Input 
          id="phone" 
          value={phone} 
          onChange={e => onChange("phone", e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="nameAffix">Namenszusatz</Label>
        <Input 
          id="nameAffix" 
          value={nameAffix} 
          onChange={e => onChange("nameAffix", e.target.value)} 
        />
      </div>
    </div>
  );
}
