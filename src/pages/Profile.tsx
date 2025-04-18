// src/pages/Profile.tsx
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
import UserProfileHeader from "@/components/profile/UserProfileHeader";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, loading, error, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [loadingSave, setLoadingSave] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(true);

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
    if (!loading && profile) {
      const [vor, ...rest] = (profile.name || "").split(" ");
      setFirstName(vor || "");
      setLastName(rest.join(" ") || "");
      setEmail(profile.email || "");
      setPhone(profile.phone || "");
      setRegion(profile.region || "");
      setPostalCode(profile.postal_code || "");
      setCity(profile.city || "");
      setStreet(profile.street || "");
      setHouseNumber(profile.house_number || "");
      setAddressExtra(profile.address_extra || "");
      setNameAffix(profile.name_affix || "");
      setOnboardingComplete(!!profile.onboarding_complete);
    }
  }, [loading, profile]);

  const missingFields = getMissingProfileFields(profile);
  const profileIsComplete = !isProfileIncomplete(profile);

  const handleSave = async () => {
    setLoadingSave(true);
    const fullName = `${firstName} ${lastName}`.trim();
    const { error: upErr } = await supabase
      .from("users")
      .update({
        name: fullName,
        name_affix: nameAffix,
        email, phone, region,
        postal_code: postalCode, city,
        street, house_number: houseNumber,
        address_extra: addressExtra,
      })
      .eq("user_id", user!.id);

    if (upErr) {
      toast({ title: "Fehler", description: "Profil konnte nicht gespeichert werden.", variant: "destructive" });
    } else {
      toast({ title: "Gespeichert", description: "Dein Profil wurde aktualisiert." });
      await refreshProfile?.();
      if (!onboardingComplete && profileIsComplete) {
        navigate("/profile");
      }
    }
    setLoadingSave(false);
  };

  const handleOnboarding = async () => {
    const { error: onErr } = await supabase
      .from("users")
      .update({ onboarding_complete: true })
      .eq("user_id", user!.id);
    if (!onErr) setOnboardingComplete(true);
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !profile) {
    return (
      <Layout>
        <div className="p-8 text-center text-red-500">
          Profil konnte nicht geladen werden. Bitte versuche es später erneut.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <UserProfileHeader profile={profile} userId={user!.id} />
        
        {!onboardingComplete && <NewUserOnboarding onComplete={handleOnboarding} />}

        {!profileIsComplete && (
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded mb-4">
            Bitte vervollständige dein Profil!<br/>
            Fehlende Angaben: {missingFields.join(", ")}
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
                <div>
                  <Label htmlFor="firstName">Vorname</Label>
                  <Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="lastName">Nachname</Label>
                  <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="email">E-Mail</Label>
                  <Input id="email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="region">Region</Label>
                  <Input id="region" value={region} onChange={e => setRegion(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postleitzahl</Label>
                  <Input id="postalCode" value={postalCode} onChange={e => setPostalCode(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="city">Stadt</Label>
                  <Input id="city" value={city} onChange={e => setCity(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="street">Straße</Label>
                  <Input id="street" value={street} onChange={e => setStreet(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="houseNumber">Hausnummer</Label>
                  <Input id="houseNumber" value={houseNumber} onChange={e => setHouseNumber(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="addressExtra">Adresszusatz</Label>
                  <Input id="addressExtra" value={addressExtra} onChange={e => setAddressExtra(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="nameAffix">Namenszusatz</Label>
                  <Input id="nameAffix" value={nameAffix} onChange={e => setNameAffix(e.target.value)} />
                </div>
              </div>
              <div className="mt-4">
                <Button onClick={handleSave} disabled={loadingSave}>Speichern</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transports">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {mockTransports.map(t => <TransportCard key={t.id} transport={t} />)}
            </div>
          </TabsContent>

          <TabsContent value="requests">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {mockRequests.map(r => <RequestCard key={r.id} request={r} />)}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
