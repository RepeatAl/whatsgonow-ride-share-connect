
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewUserOnboarding from "@/components/onboarding/NewUserOnboarding";
import UserProfileHeader from "@/components/profile/UserProfileHeader";
import { Skeleton } from "@/components/ui/skeleton";
import ImageUploader from "@/components/profile/ImageUploader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { TransportsTab } from "@/components/profile/TransportsTab";
import { RequestsTab } from "@/components/profile/RequestsTab";
import { useProfileManager } from "@/hooks/use-profile-manager";
import { getMissingProfileFields, isProfileIncomplete } from "@/utils/profile-check";

const Profile = () => {
  const { user, loading, error, profile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const {
    loadingSave,
    showImageUploader,
    onboardingComplete,
    setShowImageUploader,
    handleSave,
    handleOnboarding,
  } = useProfileManager();

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

  const missingFields = getMissingProfileFields(profile);
  const profileIsComplete = !isProfileIncomplete(profile);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <UserProfileHeader 
          profile={profile} 
          userId={user!.id} 
          onUploadClick={() => setShowImageUploader(true)}
        />
        
        <ImageUploader
          open={showImageUploader}
          onSuccess={(url) => {
            setShowImageUploader(false);
            handleSave({ avatar_url: url });
          }}
          onCancel={() => setShowImageUploader(false)}
        />

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
            <div className="mt-6">
              <ProfileForm 
                profile={profile}
                onSave={handleSave}
                loading={loadingSave}
              />
            </div>
          </TabsContent>

          <TabsContent value="transports">
            <TransportsTab />
          </TabsContent>

          <TabsContent value="requests">
            <RequestsTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
