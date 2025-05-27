
import { Card } from "@/components/ui/card";
import { ProfileForm } from "@/components/profile/ProfileForm";
import DriverApplication from "@/components/profile/DriverApplication";
import { useProfileManager } from "@/hooks/use-profile-manager";
import type { UserProfile } from "@/types/auth";

interface ProfileTabContentProps {
  profile: UserProfile;
  canBecomeDriver: boolean;
}

export function ProfileTabContent({ profile, canBecomeDriver }: ProfileTabContentProps) {
  const { handleSave, loadingSave } = useProfileManager();

  return (
    <div className="mt-4 space-y-4">
      <ProfileForm 
        profile={profile} 
        onSave={handleSave}
        loading={loadingSave}
      />
      {canBecomeDriver && <DriverApplication />}
    </div>
  );
}
