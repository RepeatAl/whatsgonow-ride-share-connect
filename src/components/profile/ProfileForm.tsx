
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { UserProfile } from "@/types/auth";
import { PersonalInfoSection } from "./form-sections/PersonalInfoSection";
import { AddressSection } from "./form-sections/AddressSection";
import { FormError } from "./form-sections/FormError";

interface ProfileFormProps {
  profile: UserProfile;
  onSave: (formData: Partial<UserProfile>) => Promise<void>;
  loading?: boolean;
}

export function ProfileForm({ profile, onSave, loading = false }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    region: "",
    postalCode: "",
    city: "",
    street: "",
    houseNumber: "",
    addressExtra: "",
    nameAffix: "",
    companyName: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoaded, setFormLoaded] = useState(false);

  useEffect(() => {
    if (profile) {
      try {
        console.log("Loading profile data:", profile);
        
        setFormData({
          firstName: profile.first_name || "",
          lastName: profile.last_name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          region: profile.region || "",
          postalCode: profile.postal_code || "",
          city: profile.city || "",
          street: profile.street || "",
          houseNumber: profile.house_number || "",
          addressExtra: profile.address_extra || "",
          nameAffix: profile.name_affix || "",
          companyName: profile.company_name || "",
        });
        
        setFormError(null);
        setFormLoaded(true);
      } catch (err) {
        console.error("Error loading profile data:", err);
        setFormError("Profildaten konnten nicht geladen werden");
      }
    }
  }, [profile]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setFormError(null);
      
      const requiredFields = ["firstName", "lastName", "email", "phone", "postalCode", "city", "region", "street", "houseNumber"];
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
      
      if (missingFields.length > 0) {
        setFormError("Bitte fülle alle Pflichtfelder aus (mit * markiert)");
        return;
      }

      await onSave({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        region: formData.region,
        postal_code: formData.postalCode,
        city: formData.city,
        street: formData.street,
        house_number: formData.houseNumber,
        address_extra: formData.addressExtra,
        name_affix: formData.nameAffix,
        company_name: formData.companyName,
      });
      
      toast({
        title: "Profil gespeichert",
        description: "Deine Änderungen wurden erfolgreich gespeichert."
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      setFormError("Profil konnte nicht gespeichert werden");
    }
  };

  if (!formLoaded) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
        <p>Profil wird geladen...</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <FormError error={formError} />
      
      <PersonalInfoSection 
        firstName={formData.firstName}
        lastName={formData.lastName}
        nameAffix={formData.nameAffix}
        email={formData.email}
        phone={formData.phone}
        companyName={formData.companyName}
        isBusinessAccount={profile.role === "sender_business"}
        onChange={handleFieldChange}
      />

      <AddressSection 
        region={formData.region}
        postalCode={formData.postalCode}
        city={formData.city}
        street={formData.street}
        houseNumber={formData.houseNumber}
        addressExtra={formData.addressExtra}
        onChange={handleFieldChange}
      />

      <p className="text-sm text-muted-foreground">* Pflichtfelder</p>
      
      <div className="mt-4">
        <Button 
          onClick={handleSubmit} 
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Speichert...
            </>
          ) : "Speichern"}
        </Button>
      </div>
    </div>
  );
}
