
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import type { UserProfile } from "@/types/auth";

interface ProfileFormProps {
  profile: UserProfile;
  onSave: (formData: Partial<UserProfile>) => Promise<void>;
  loading?: boolean;
}

export function ProfileForm({ profile, onSave, loading = false }: ProfileFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [addressExtra, setAddressExtra] = useState("");
  const [nameAffix, setNameAffix] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      try {
        // Map the snake_case properties from UserProfile to our camelCase state variables
        setFirstName(profile.first_name || "");
        setLastName(profile.last_name || "");
        setEmail(profile.email || "");
        setPhone(profile.phone || "");
        setRegion(profile.region || "");
        setPostalCode(profile.postal_code || "");
        setCity(profile.city || "");
        setStreet(profile.street || "");
        setHouseNumber(profile.house_number || "");
        setAddressExtra(profile.address_extra || "");
        setNameAffix(profile.name_affix || "");
        setFormError(null);
      } catch (err) {
        console.error("Error loading profile data:", err);
        setFormError("Profildaten konnten nicht geladen werden");
      }
    }
  }, [profile]);

  const handleSubmit = async () => {
    try {
      setFormError(null);
      
      // Validate form - basic checks
      if (!firstName || !lastName || !email) {
        setFormError("Bitte fülle alle Pflichtfelder aus (Vorname, Nachname, E-Mail)");
        return;
      }
      
      // Map form fields to the correct UserProfile properties using snake_case
      await onSave({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        region,
        postal_code: postalCode,
        city,
        street,
        house_number: houseNumber,
        address_extra: addressExtra,
        name_affix: nameAffix,
      });
      
      toast({
        title: "Profil gespeichert",
        description: "Deine Änderungen wurden erfolgreich gespeichert."
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      setFormError("Profil konnte nicht gespeichert werden");
      toast({
        title: "Fehler",
        description: "Profil konnte nicht gespeichert werden. Bitte versuche es später erneut.",
        variant: "destructive"
      });
    }
  };

  if (!profile) {
    return (
      <div className="p-8 text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>Profil wird geladen...</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {formError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">Vorname*</Label>
          <Input 
            id="firstName" 
            value={firstName} 
            onChange={e => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Nachname*</Label>
          <Input 
            id="lastName" 
            value={lastName} 
            onChange={e => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="email">E-Mail*</Label>
          <Input 
            id="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            required 
          />
        </div>
        <div>
          <Label htmlFor="phone">Telefon*</Label>
          <Input 
            id="phone" 
            value={phone} 
            onChange={e => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="region">Region*</Label>
          <Input 
            id="region" 
            value={region} 
            onChange={e => setRegion(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="postalCode">Postleitzahl*</Label>
          <Input 
            id="postalCode" 
            value={postalCode} 
            onChange={e => setPostalCode(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="city">Stadt*</Label>
          <Input 
            id="city" 
            value={city} 
            onChange={e => setCity(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="street">Straße</Label>
          <Input 
            id="street" 
            value={street} 
            onChange={e => setStreet(e.target.value)} 
          />
        </div>
        <div>
          <Label htmlFor="houseNumber">Hausnummer</Label>
          <Input 
            id="houseNumber" 
            value={houseNumber} 
            onChange={e => setHouseNumber(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="addressExtra">Adresszusatz</Label>
          <Input 
            id="addressExtra" 
            value={addressExtra} 
            onChange={e => setAddressExtra(e.target.value)} 
          />
        </div>
        <div>
          <Label htmlFor="nameAffix">Namenszusatz</Label>
          <Input 
            id="nameAffix" 
            value={nameAffix} 
            onChange={e => setNameAffix(e.target.value)} 
          />
        </div>
      </div>
      <p className="text-sm text-muted-foreground">* Pflichtfelder</p>
      <div className="mt-4">
        <Button 
          onClick={handleSubmit} 
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
              Speichert...
            </>
          ) : "Speichern"}
        </Button>
      </div>
    </div>
  );
}
