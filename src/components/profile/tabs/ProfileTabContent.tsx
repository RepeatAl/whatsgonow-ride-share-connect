
import { Card } from "@/components/ui/card";
import { ProfileForm } from "@/components/profile/ProfileForm";
import DriverApplication from "@/components/profile/DriverApplication";
import { useProfileManager } from "@/hooks/use-profile-manager";
import { useOptimizedAuth } from "@/contexts/OptimizedAuthContext";

export function ProfileTabContent() {
  const { profile } = useOptimizedAuth();
  const { handleSave, loadingSave } = useProfileManager();
  
  if (!profile) {
    return (
      <Card className="p-6">
        <p>Profil wird geladen...</p>
      </Card>
    );
  }
  
  const canBecomeDriver = !profile.role?.includes('driver') && profile.can_become_driver;

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
