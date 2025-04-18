// ✅ Vollständig aktualisierte Profile.tsx mit zentraler Profilprüfung, UI-Erweiterung & dauerhaftem Onboarding-Status
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TransportCard from "@/components/transport/TransportCard";
import RequestCard from "@/components/transport/RequestCard";
import { mockTransports, mockRequests } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { getMissingProfileFields, isProfileIncomplete } from "@/utils/profile-check";
import NewUserOnboarding from "@/components/onboarding/NewUserOnboarding";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
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
  const [onboardingComplete, setOnboardingComplete] = useState(true);

  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();

  useEffect(() => {
    if (!user) return navigate("/login");
    if (profile) {
      const nameParts = (profile.name || "").split(" ");
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
      setEmail(profile.email || user.email || "");
      setPhone(profile.phone || "");
      setRegion(profile.region || "");
      setPostalCode(profile.postal_code || "");
      setCity(profile.city || "");
      setStreet(profile.street || "");
      setHouseNumber(profile.house_number || "");
      setAddressExtra(profile.address_extra || "");
      setNameAffix(profile.name_affix || "");
      setOnboardingComplete(profile.onboarding_complete === true);
    }
  }, [user, profile]);

  const handleSaveChanges = async () => {
    if (!user) return;
    setLoading(true);

    const fullName = `${firstName} ${lastName}`.trim();

    const { error } = await supabase.from("users").update({
      name: fullName,
      name_affix: nameAffix,
      email,
      phone,
      region,
      postal_code: postalCode,
      city,
      street,
      house_number: houseNumber,
      address_extra: addressExtra
    }).eq("user_id", user.id);

    if (error) {
      toast({ title: "Fehler", description: "Profil konnte nicht aktualisiert werden.", variant: "destructive" });
    } else {
      toast({ title: "Profil aktualisiert", description: "Deine Änderungen wurden gespeichert." });
      refreshProfile?.();
    }
    setLoading(false);
  };

  const handleOnboardingComplete = async () => {
    if (!user) return;
    setOnboardingComplete(true);
    const { error } = await supabase.from("users").update({ onboarding_complete: true }).eq("user_id", user.id);
    if (error) {
      console.warn("❌ Fehler beim Setzen des Onboarding-Status:", error);
    } else {
      console.log("✅ Onboarding abgeschlossen und gespeichert");
    }
  };

  if (!profile || loading) {
    return <Layout><div className="p-8 text-center text-gray-500">Lade Profil...</div></Layout>;
  }

  const missingFields = getMissingProfileFields(profile);
  const isProfileComplete = !isProfileIncomplete(profile);

  return <Layout>
    {!onboardingComplete && <NewUserOnboarding onComplete={handleOnboardingComplete} />}
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Mein Profil</h1>
      {!isProfileComplete && (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded mb-4">
          Bitte vervollständige dein Profil, um alle Funktionen zu nutzen.<br />
          Fehlende Angaben: {missingFields.join(', ')}
        </div>
      )}
      <Tabs defaultValue="profile" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="transports">Transporte</TabsTrigger>
          <TabsTrigger value="requests">Anfragen</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <div className="grid gap-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label htmlFor="first_name">Vorname</Label><Input id="first_name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required /></div>
              <div><Label htmlFor="last_name">Nachname</Label><Input id="last_name" value={lastName} onChange={(e) => setLastName(e.target.value)} required /></div>
              <div><Label htmlFor="name_affix">Namenszusatz</Label><Input id="name_affix" value={nameAffix} onChange={(e) => setNameAffix(e.target.value)} /></div>
              <div><Label htmlFor="email">E-Mail</Label><Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              <div><Label htmlFor="phone">Telefon</Label><Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required /></div>
              <div><Label htmlFor="region">Region</Label><Input id="region" value={region} onChange={(e) => setRegion(e.target.value)} required /></div>
              <div><Label htmlFor="postal_code">Postleitzahl</Label><Input id="postal_code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required /></div>
              <div><Label htmlFor="city">Stadt</Label><Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required /></div>
              <div><Label htmlFor="street">Straße</Label><Input id="street" value={street} onChange={(e) => setStreet(e.target.value)} /></div>
              <div><Label htmlFor="house_number">Hausnummer</Label><Input id="house_number" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} /></div>
              <div><Label htmlFor="address_extra">Adresszusatz</Label><Input id="address_extra" value={addressExtra} onChange={(e) => setAddressExtra(e.target.value)} /></div>
            </div>
            <div className="mt-4">
              <Button onClick={handleSaveChanges} disabled={loading}>Speichern</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transports">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {mockTransports.map((t) => <TransportCard key={t.id} transport={t} />)}
          </div>
        </TabsContent>

        <TabsContent value="requests">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {mockRequests.map((r) => <RequestCard key={r.id} request={r} />)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </Layout>;
};

export default Profile;
