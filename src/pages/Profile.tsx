
import React from "react";
import { useTranslation } from "react-i18next";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = () => {
  const { t } = useTranslation(["common"]);
  const { user, profile } = useSimpleAuth();

  return (
    <Layout pageType="dashboard">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">
            {t("common:navigation.profile", "Profil")}
          </h1>
          
          <Card>
            <CardHeader>
              <CardTitle>
                Profil von {profile?.first_name || user?.email}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="font-medium">E-Mail:</label>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
                {profile?.first_name && (
                  <div>
                    <label className="font-medium">Vorname:</label>
                    <p className="text-gray-600">{profile.first_name}</p>
                  </div>
                )}
                {profile?.last_name && (
                  <div>
                    <label className="font-medium">Nachname:</label>
                    <p className="text-gray-600">{profile.last_name}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
