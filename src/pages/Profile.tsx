
import React from 'react';
import Layout from '@/components/Layout';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Settings, Shield } from 'lucide-react';

const Profile = () => {
  const { user, profile } = useOptimizedAuth();

  if (!user || !profile) {
    return (
      <Layout pageType="authenticated">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600">Lädt Profil...</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageType="profile">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Mein Profil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Persönliche Informationen</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Vorname</label>
                    <p className="mt-1 text-sm text-gray-900">{profile.first_name || 'Nicht angegeben'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nachname</label>
                    <p className="mt-1 text-sm text-gray-900">{profile.last_name || 'Nicht angegeben'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">E-Mail</label>
                    <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rolle</label>
                    <p className="mt-1 text-sm text-gray-900">{profile.role || 'Nicht zugewiesen'}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-4">Konto-Einstellungen</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Profil bearbeiten
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="mr-2 h-4 w-4" />
                    Passwort ändern
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
