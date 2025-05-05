
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { isProfileIncomplete } from "@/utils/profile-check";
import UserProfileHeader from "@/components/profile/UserProfileHeader";
import ImageUploader from "@/components/profile/ImageUploader";
import { toast } from "@/hooks/use-toast";
import { ProfileTabs } from "@/components/profile/ProfileTabs";

const Profile = () => {
  const { user, profile, loading, error, refreshProfile } = useAuth();
  const navigate = useNavigate();
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
  
  // Determine if the user is a sender
  const isSender = profile?.role?.startsWith('sender_');

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

            {isSender && (
              <div className="flex justify-end">
                <button 
                  onClick={() => navigate('/create-order')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-brand-orange text-white hover:bg-brand-orange/90 transition-colors"
                >
                  Neuen Auftrag erstellen
                </button>
              </div>
            )}

            <ProfileTabs 
              profile={profile}
              userId={user.id}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              showDriverSection={showDriverSection}
              showBusinessSection={showBusinessSection}
              showCMSection={showCMSection}
              showAdminSection={showAdminSection}
              canBecomeDriver={canBecomeDriver}
            />
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
