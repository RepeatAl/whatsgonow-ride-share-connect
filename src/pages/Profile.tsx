import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Shield, Star, Car, Package, CreditCard, Bell, MessageCircle, Settings, LogOut } from "lucide-react";
import TransportCard from "@/components/transport/TransportCard";
import RequestCard from "@/components/transport/RequestCard";
import { mockTransports, mockRequests } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    if (!user) return navigate("/login");
    if (profile) {
      setName(profile.name || "");
      setEmail(profile.email || user.email || "");
      setPhone("+49 123 4567890");
      setRegion(profile.region || "");
    }
  }, [user, profile]);

  const handleSaveChanges = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("users").update({
      name,
      email,
      phone,
      region
    }).eq("user_id", user.id);

    if (error) {
      toast({ title: "Fehler", description: "Profil konnte nicht aktualisiert werden.", variant: "destructive" });
    } else {
      toast({ title: "Profil aktualisiert", description: "Deine Änderungen wurden gespeichert." });
    }
    setLoading(false);
  };

  if (!profile || loading) {
    return <Layout><div className="p-8 text-center text-gray-500">Lade Profil...</div></Layout>;
  }

  return <Layout>
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Mein Profil</h1>
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
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="email">E-Mail</Label>
                <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="region">Region</Label>
                <Input id="region" value={region} onChange={(e) => setRegion(e.target.value)} />
              </div>
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
