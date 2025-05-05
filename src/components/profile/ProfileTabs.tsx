
import { useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTabContent } from "./tabs/ProfileTabContent";
import { RatingsTabContent } from "./tabs/RatingsTabContent";
import { RoleTabContent } from "./tabs/RoleTabContent";
import { DriverTabContent } from "./tabs/DriverTabContent";
import { SenderTabContent } from "./tabs/SenderTabContent";
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
  // Determine the default active tab based on user role
  const defaultTab = useMemo(() => {
    if (profile.role?.startsWith('sender')) return 'sender';
    if (profile.role === 'driver') return 'driver';
    if (profile.role === 'cm') return 'community';
    if (profile.role === 'admin' || profile.role === 'admin_limited') return 'admin';
    return 'profile';
  }, [profile.role]);

  // Set the default tab when the component mounts
  useEffect(() => {
    if (activeTab === 'profile' && defaultTab !== 'profile') {
      setActiveTab(defaultTab);
    }
  }, [defaultTab, activeTab, setActiveTab]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        <TabsTrigger value="profile">Profil</TabsTrigger>
        <TabsTrigger value="sender">Versender</TabsTrigger>
        <TabsTrigger value="ratings">Bewertungen</TabsTrigger>
        {showDriverSection && <TabsTrigger value="driver">Fahrer</TabsTrigger>}
        {showBusinessSection && <TabsTrigger value="business">Business</TabsTrigger>}
        {showCMSection && <TabsTrigger value="community">CM</TabsTrigger>}
        {showAdminSection && <TabsTrigger value="admin">Admin</TabsTrigger>}
      </TabsList>
      
      <TabsContent value="profile">
        <ProfileTabContent profile={profile} canBecomeDriver={canBecomeDriver} />
      </TabsContent>

      <TabsContent value="sender">
        <SenderTabContent profile={profile} />
      </TabsContent>

      <TabsContent value="ratings">
        <RatingsTabContent userId={userId} />
      </TabsContent>

      {showDriverSection && (
        <TabsContent value="driver">
          <DriverTabContent profile={profile} />
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
