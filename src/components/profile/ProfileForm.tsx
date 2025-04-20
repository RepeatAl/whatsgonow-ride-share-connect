
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
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

  useEffect(() => {
    if (profile) {
      // Using firstName/lastName for display but mapping to the correct fields from UserProfile
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setEmail(profile.email || "");
      setPhone(profile.phone || "");
      setRegion(profile.region || "");
      setPostalCode(profile.postal_code || "");
      setCity(profile.city || "");
      setStreet(profile.street || "");
      setHouseNumber(profile.house_number || "");
      setAddressExtra(profile.address_extra || "");
      setNameAffix(profile.name_affix || "");
    }
  }, [profile]);

  const handleSubmit = async () => {
    try {
      // Map form fields to the correct UserProfile properties
      await onSave({
        firstName,
        lastName,
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
      toast({
        title: "Fehler",
        description: "Profil konnte nicht gespeichert werden. Bitte versuche es später erneut.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">Vorname</Label>
          <Input 
            id="firstName" 
            value={firstName} 
            onChange={e => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Nachname</Label>
          <Input 
            id="lastName" 
            value={lastName} 
            onChange={e => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="email">E-Mail</Label>
          <Input 
            id="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            required 
          />
        </div>
        <div>
          <Label htmlFor="phone">Telefon</Label>
          <Input 
            id="phone" 
            value={phone} 
            onChange={e => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="region">Region</Label>
          <Input 
            id="region" 
            value={region} 
            onChange={e => setRegion(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="postalCode">Postleitzahl</Label>
          <Input 
            id="postalCode" 
            value={postalCode} 
            onChange={e => setPostalCode(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="city">Stadt</Label>
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
      <div className="mt-4">
        <Button 
          onClick={handleSubmit} 
          disabled={loading}
        >
          {loading ? "Speichert..." : "Speichern"}
        </Button>
      </div>
    </div>
  );
}
