
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTabContent } from "./tabs/ProfileTabContent";
import { RatingsTabContent } from "./tabs/RatingsTabContent";
import { RoleTabContent } from "./tabs/RoleTabContent";
import type { UserProfile } from "@/types/auth";

interface ProfileTabsProps {
  profile: UserProfile;
  userId: string;
  activeTab: string;
  setActiveTab: (value: string) => void;
  showDriverSection: boolean;
  showBusinessSection: boolean;
  showCMSection: boolean;
  showAdminSection: boolean;
  canBecomeDriver: boolean;
}

export function ProfileTabs({
  profile,
  userId,
  activeTab,
  setActiveTab,
  showDriverSection,
  showBusinessSection,
  showCMSection,
  showAdminSection,
  canBecomeDriver
}: ProfileTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        <TabsTrigger value="profile">Profil</TabsTrigger>
        <TabsTrigger value="ratings">Bewertungen</TabsTrigger>
        {showDriverSection && <TabsTrigger value="driver">Fahrer</TabsTrigger>}
        {showBusinessSection && <TabsTrigger value="business">Business</TabsTrigger>}
        {showCMSection && <TabsTrigger value="community">CM</TabsTrigger>}
        {showAdminSection && <TabsTrigger value="admin">Admin</TabsTrigger>}
      </TabsList>
      
      <TabsContent value="profile">
        <ProfileTabContent profile={profile} canBecomeDriver={canBecomeDriver} />
      </TabsContent>

      <TabsContent value="ratings">
        <RatingsTabContent userId={userId} />
      </TabsContent>

      {showDriverSection && (
        <TabsContent value="driver">
          <RoleTabContent 
            title="Fahrereinstellungen"
            description="Hier kannst du deine Fahrerinformationen und Verfügbarkeit verwalten."
          />
        </TabsContent>
      )}

      {showBusinessSection && (
        <TabsContent value="business">
          <RoleTabContent 
            title="Geschäftseinstellungen"
            description="Verwalte deine Geschäftsinformationen und Firmendetails."
          />
        </TabsContent>
      )}

      {showCMSection && (
        <TabsContent value="community">
          <RoleTabContent 
            title="Community Manager"
            description="Verwaltung deiner Community Manager Funktionen."
          />
        </TabsContent>
      )}

      {showAdminSection && (
        <TabsContent value="admin">
          <RoleTabContent 
            title="Admin-Einstellungen"
            description="Hier kannst du auf Admin-spezifische Einstellungen und Funktionen zugreifen."
          />
        </TabsContent>
      )}
    </Tabs>
  );
}
