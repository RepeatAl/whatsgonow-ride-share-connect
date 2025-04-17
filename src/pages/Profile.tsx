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
import { User, Shield, Star, Car, Package, CreditCard, Bell, MessageCircle, MapPin, Settings, LogOut } from "lucide-react";
import TransportCard from "@/components/transport/TransportCard";
import RequestCard from "@/components/transport/RequestCard";
import { mockTransports, mockRequests } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();
  const {
    user,
    profile,
    signOut
  } = useAuth();
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      if (!user) {
        navigate("/login");
        return;
      }
      if (profile) {
        // Verwende das vorhandene Profil aus dem AuthContext
        setUserData({
          name: profile.name,
          email: profile.email,
          role: profile.role,
          region: profile.region,
          memberSince: new Date(user.created_at || Date.now()).toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'long'
          }),
          // Mock Daten für die Ansicht
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          phone: "+49 123 4567890",
          verificationStatus: {
            phone: true,
            email: true,
            identity: profile.role === 'driver',
            payment: true
          },
          stats: {
            transportsCompleted: 12,
            requestsFulfilled: 8,
            rating: 4.9,
            reviews: 18
          }
        });
      } else {
        // Fallback, falls kein Profil vorhanden ist
        setUserData({
          name: "Neuer Benutzer",
          email: user.email,
          role: "unbekannt",
          memberSince: new Date(user.created_at || Date.now()).toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'long'
          }),
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          phone: "",
          verificationStatus: {
            phone: false,
            email: true,
            identity: false,
            payment: false
          },
          stats: {
            transportsCompleted: 0,
            requestsFulfilled: 0,
            rating: 0,
            reviews: 0
          }
        });
      }
      setLoading(false);
    };
    loadUserData();
  }, [user, profile, navigate]);
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  const handleSaveChanges = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const {
        error
      } = await supabase.from("users").update({
        name: userData.name,
        email: userData.email
      }).eq("user_id", user.id);
      if (error) throw error;
      toast({
        title: "Profil aktualisiert",
        description: "Deine Änderungen wurden gespeichert."
      });
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Profils:", error);
      toast({
        title: "Fehler",
        description: "Profil konnte nicht aktualisiert werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  if (loading || !userData) {
    return <Layout>
        <div className="max-w-7xl mx-auto px-4 pt-6 pb-16">
          <div className="animate-pulse">
            <div className="h-20 w-20 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-8 w-1/3 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-1/4 bg-gray-200 rounded mb-8"></div>
            
            <div className="h-12 w-full bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>;
  }
  return <Layout>
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-16">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex items-center">
              <div className="h-20 w-20 rounded-full overflow-hidden mr-4 border-2 border-brand-purple">
                <img src={userData.avatar} alt={userData.name} className="h-full w-full object-cover" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  {userData.name}
                  {Object.values(userData.verificationStatus).every(v => v) && <Shield className="h-5 w-5 ml-2 text-green-500" />}
                </h1>
                <p className="text-gray-600">
                  Member since {userData.memberSince}
                </p>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-gray-700">{userData.stats.rating}</span>
                  <span className="mx-1 text-gray-500">•</span>
                  <span className="text-gray-500">{userData.stats.reviews} reviews</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Verification Status
              </Button>
              <Button variant="outline" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" className="flex items-center text-red-500 hover:text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </div>
          </div>

          <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
              <TabsTrigger value="profile" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="transports" className="flex items-center">
                <Car className="h-4 w-4 mr-2" />
                <span>My Transports</span>
              </TabsTrigger>
              <TabsTrigger value="requests" className="flex items-center">
                <Package className="h-4 w-4 mr-2" />
                <span>My Requests</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                <span>Payments</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                <span>Messages</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" defaultValue={userData.name} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" defaultValue={userData.email} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" defaultValue={userData.phone} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input id="location" defaultValue="Berlin, Germany" />
                        </div>
                      </div>
                      <div className="pt-2">
                        <Button className="w-full md:w-auto" onClick={handleSaveChanges}>Save Changes</Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
                    <h2 className="text-xl font-semibold mb-4">Address Information</h2>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" defaultValue="123 Main Street" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input id="city" defaultValue="Berlin" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input id="postalCode" defaultValue="10115" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input id="country" defaultValue="Germany" />
                        </div>
                      </div>
                      <div className="pt-2">
                        <Button className="w-full md:w-auto">Save Address</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-lg shadow-sm border p-6 bg-orange-500">
                    <h2 className="text-xl font-semibold mb-4">Verification Status</h2>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 mr-2 text-green-500" />
                          <span>Phone Number</span>
                        </div>
                        <span className="text-sm font-medium text-slate-950">Verified</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 mr-2 text-green-500" />
                          <span>Email Address</span>
                        </div>
                        <span className="text-sm font-medium text-slate-950">Verified</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 mr-2 text-green-500" />
                          <span>ID Verification</span>
                        </div>
                        <span className="text-sm font-medium text-slate-950">Verified</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 mr-2 text-green-500" />
                          <span>Payment Method</span>
                        </div>
                        <span className="text-sm font-medium text-slate-950">Verified</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg shadow-sm border p-6 bg-orange-500">
                    <h2 className="text-xl font-semibold mb-4">Preferences</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="emailNotifications" className="cursor-pointer">
                          Email Notifications
                        </Label>
                        <Switch id="emailNotifications" checked={true} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="smsNotifications" className="cursor-pointer">
                          SMS Notifications
                        </Label>
                        <Switch id="smsNotifications" checked={true} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="locationServices" className="cursor-pointer">
                          Location Services
                        </Label>
                        <Switch id="locationServices" checked={true} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="darkMode" className="cursor-pointer">
                          Dark Mode
                        </Label>
                        <Switch id="darkMode" checked={false} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="transports" className="mt-6">
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">My Transports</h2>
                  <p className="text-gray-600 mt-1">
                    View and manage your transport offers
                  </p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockTransports.slice(0, 3).map(transport => <TransportCard key={transport.id} transport={transport} />)}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="requests" className="mt-6">
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">My Requests</h2>
                  <p className="text-gray-600 mt-1">
                    View and manage your transport requests
                  </p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockRequests.slice(0, 3).map(request => <RequestCard key={request.id} request={request} />)}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payments" className="mt-6">
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Payment Methods</h2>
                  <p className="text-gray-600 mt-1">
                    Manage your payment methods and transaction history
                  </p>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-500">
                    This feature will be implemented soon.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Notifications</h2>
                  <p className="text-gray-600 mt-1">
                    Manage your notifications and alert preferences
                  </p>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-500">
                    This feature will be implemented soon.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="messages" className="mt-6">
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Messages</h2>
                  <p className="text-gray-600 mt-1">
                    View your message history
                  </p>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-500">
                    This feature will be implemented soon.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>;
};
export default Profile;