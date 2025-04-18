
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewUserOnboarding from "@/components/onboarding/NewUserOnboarding";
import UserProfileHeader from "@/components/profile/UserProfileHeader";
import { Skeleton } from "@/components/ui/skeleton";
import ImageUploader from "@/components/profile/ImageUploader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { TransportsTab } from "@/components/profile/TransportsTab";
import { RequestsTab } from "@/components/profile/RequestsTab";
import { useAuth } from "@/contexts/AuthContext";
import { getMissingProfileFields, isProfileIncomplete } from "@/utils/profile-check";

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, loading, error, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [loadingSave, setLoadingSave] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(true);
  const [showImageUploader, setShowImageUploader] = useState(false);

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

  const handleSave = async (formData: Partial<UserProfile>) => {
    setLoadingSave(true);
    const { error: upErr } = await supabase
      .from("users")
      .update(formData)
      .eq("user_id", user!.id);

    if (upErr) {
      toast({ title: "Fehler", description: "Profil konnte nicht gespeichert werden.", variant: "destructive" });
    } else {
      toast({ title: "Gespeichert", description: "Dein Profil wurde aktualisiert." });
      await refreshProfile?.();
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
          userId={user!.id}
          open={showImageUploader}
          onSuccess={(url) => {
            setShowImageUploader(false);
            refreshProfile?.();
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
