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
      const parts = (profile.name || "").split(" ");
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
      setEmail(profile.email || user.email || "");
      setPhone(profile.phone || "");
      setRegion(profile.region || "");
      setPostalCode(profile.postal_code || "");
      setCity(profile.city || "");
      setStreet(profile.street || "");
      setHouseNumber(profile.house_number || "");
      setAddressExtra(profile.address_extra || "");
      setNameAffix(profile.name_affix || "");
      setOnboardingComplete(Boolean(profile.onboarding_complete));
    }
  }, [user, profile]);

  const handleSaveChanges = async () => {
    if (!user) return;
    setLoading(true);
    const fullName = `${firstName} ${lastName}`.trim();
    const isComplete = !isProfileIncomplete({
      ...profile!,
      name: fullName,
      email, phone, region, postal_code: postalCode, city
    } as any);

    const { error } = await supabase
      .from("users")
      .update({
        name: fullName,
        name_affix: nameAffix,
        email, phone, region,
        postal_code: postalCode,
        city, street, house_number: houseNumber, address_extra: addressExtra,
        profile_complete: isComplete
      })
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Fehler", description: "Profil konnte nicht gespeichert werden.", variant: "destructive" });
    } else {
      toast({ title: "Profil aktualisiert", description: "Deine Änderungen wurden gespeichert." });
      // ** Redirect, sobald alle Pflichtfelder gefüllt sind **
      if (isComplete) {
        navigate("/profile", { replace: true });
        return;
      }
      refreshProfile?.();
    }
    setLoading(false);
  };

  const handleOnboardingComplete = async () => {
    if (!user) return;
    setOnboardingComplete(true);
    await supabase.from("users").update({ onboarding_complete: true }).eq("user_id", user.id);
  };

  if (!profile || loading) {
    return (
      <Layout>
        <div className="p-8 text-center text-gray-500">Lade Profil…</div>
      </Layout>
    );
  }

  const missingFields = getMissingProfileFields(profile);
  const isComplete = !isProfileIncomplete(profile);

  return (
    <Layout>
      {!onboardingComplete && <NewUserOnboarding onComplete={handleOnboardingComplete} />}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-4">Mein Profil</h1>
        {!isComplete && (
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded mb-4">
            Bitte vervollständige dein Profil.<br />
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
            {/* … deine Formfelder … */}
            <div className="mt-4">
              <Button onClick={handleSaveChanges} disabled={loading}>Speichern</Button>
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
