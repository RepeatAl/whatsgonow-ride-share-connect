
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Camera, MapPin, Star, Settings } from 'lucide-react';
import ProfileTabContent from './tabs/ProfileTabContent';
import RoleTabContent from './tabs/RoleTabContent';
import RatingsTabContent from './tabs/RatingsTabContent';
import ImageGallery from './ImageGallery';

export default function ProfileTabs() {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Profil</span>
        </TabsTrigger>
        <TabsTrigger value="images" className="flex items-center gap-2">
          <Camera className="h-4 w-4" />
          <span className="hidden sm:inline">Bilder</span>
        </TabsTrigger>
        <TabsTrigger value="addresses" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span className="hidden sm:inline">Adressen</span>
        </TabsTrigger>
        <TabsTrigger value="ratings" className="flex items-center gap-2">
          <Star className="h-4 w-4" />
          <span className="hidden sm:inline">Bewertungen</span>
        </TabsTrigger>
        <TabsTrigger value="role" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Rolle</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="mt-6">
        <ProfileTabContent />
      </TabsContent>

      <TabsContent value="images" className="mt-6">
        <ImageGallery />
      </TabsContent>

      <TabsContent value="addresses" className="mt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Adressbuch</h3>
          <p className="text-gray-600">Ihre gespeicherten Adressen werden hier angezeigt.</p>
          {/* AddressBook component would go here */}
        </div>
      </TabsContent>

      <TabsContent value="ratings" className="mt-6">
        <RatingsTabContent />
      </TabsContent>

      <TabsContent value="role" className="mt-6">
        <RoleTabContent />
      </TabsContent>
    </Tabs>
  );
}
