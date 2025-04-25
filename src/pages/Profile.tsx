import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { isProfileIncomplete } from "@/utils/profile-check";
import { useProfileManager } from "@/hooks/use-profile-manager";
import UserProfileHeader from "@/components/profile/UserProfileHeader";
import ImageUploader from "@/components/profile/ImageUploader";
import UserRating from "@/components/rating/UserRating";
import { DriverApplication } from "@/components/profile/DriverApplication";

const Profile = () => {
  const { user, profile, loading, error, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { handleSave, loadingSave } = useProfileManager();
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }
    if (!loading && profile && isProfileIncomplete(profile)) {
      navigate("/complete-profile");
    }
  }, [user, profile, loading, navigate]);

  const showAdminSection = profile?.role === "admin" || profile?.role === "admin_limited";
  const showDriverSection = profile?.role === "driver";
  const showCMSection = profile?.role === "cm";
  const showBusinessSection = profile?.role === "sender_business";
  const canBecomeDriver = profile?.role === "sender_private" || profile?.role === "sender_business";

  if (loading) {
    return (
      <Layout>
        <div className="container max-w-4xl mx-auto py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !profile || !user) {
    return (
      <Layout>
        <div className="container max-w-4xl mx-auto py-8">
          <Card>
            <CardHeader>
              <CardTitle>Fehler</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-500">
                {error?.message ?? "Dein Profil konnte nicht geladen werden. Bitte versuche es später erneut."}
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Mein Profil</CardTitle>
            <CardDescription>
              Verwalte dein Profil und persönliche Einstellungen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <UserProfileHeader 
              profile={profile}
              userId={user.id}
              onUploadClick={() => setShowImageUploader(true)}
            />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                <TabsTrigger value="profile">Profil</TabsTrigger>
                <TabsTrigger value="ratings">Bewertungen</TabsTrigger>
                {showDriverSection && <TabsTrigger value="driver">Fahrer</TabsTrigger>}
                {showBusinessSection && <TabsTrigger value="business">Business</TabsTrigger>}
                {showCMSection && <TabsTrigger value="community">CM</TabsTrigger>}
                {showAdminSection && <TabsTrigger value="admin">Admin</TabsTrigger>}
              </TabsList>
              
              <TabsContent value="profile" className="mt-4 space-y-4">
                <ProfileForm 
                  profile={profile} 
                  onSave={handleSave}
                  loading={loadingSave}
                />
                {canBecomeDriver && <DriverApplication />}
              </TabsContent>

              <TabsContent value="ratings" className="mt-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Deine Bewertungen</CardTitle>
                    <CardDescription>
                      Bewertungen, die du von anderen Nutzern erhalten hast
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="font-medium mb-2">Deine aktuelle Bewertung</h3>
                        <UserRating userId={user.id} size="lg" showDetails={true} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {showDriverSection && (
                <TabsContent value="driver" className="mt-4 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Fahrereinstellungen</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Hier kannst du deine Fahrerinformationen und Verfügbarkeit verwalten.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {showBusinessSection && (
                <TabsContent value="business" className="mt-4 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Geschäftseinstellungen</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Verwalte deine Geschäftsinformationen und Firmendetails.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {showCMSection && (
                <TabsContent value="community" className="mt-4 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Community Manager</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Verwaltung deiner Community Manager Funktionen.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {showAdminSection && (
                <TabsContent value="admin" className="mt-4 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Admin-Einstellungen</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Hier kannst du auf Admin-spezifische Einstellungen und Funktionen zugreifen.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>

        {showImageUploader && (
          <ImageUploader
            userId={user.id}
            onSuccess={(url) => {
              refreshProfile?.();
              setShowImageUploader(false);
              toast({
                title: "Profilbild aktualisiert",
                description: "Dein neues Profilbild wurde hochgeladen."
              });
            }}
            onCancel={() => setShowImageUploader(false)}
            open={showImageUploader}
            currentImage={profile.avatar_url}
          />
        )}
      </div>
    </Layout>
  );
};

export default Profile;
