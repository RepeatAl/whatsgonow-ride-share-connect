
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { isProfileIncomplete } from "@/utils/profile-check";
import { useProfileManager } from "@/hooks/use-profile-manager";
import UserProfileHeader from "@/components/profile/UserProfileHeader";
import ImageUploader from "@/components/profile/ImageUploader";

const Profile = () => {
  const { user, profile, loading, error, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { handleSave, loadingSave } = useProfileManager();
  const [showImageUploader, setShowImageUploader] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }

    if (!loading && profile && isProfileIncomplete(profile)) {
      navigate("/complete-profile");
    }
  }, [user, profile, loading, navigate]);

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
                Dein Profil konnte nicht geladen werden. Bitte versuche es später erneut.
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
        <Card>
          <CardHeader>
            <CardTitle>Profil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <UserProfileHeader 
              profile={profile}
              userId={user.id}
              onUploadClick={() => setShowImageUploader(true)}
            />
            
            <ProfileForm 
              profile={profile} 
              onSave={handleSave}
              loading={loadingSave}
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
          />
        )}
      </div>
    </Layout>
  );
};

export default Profile;
