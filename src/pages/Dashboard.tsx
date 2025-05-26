
import React from "react";
import { useTranslation } from "react-i18next";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const { t } = useTranslation(["common"]);
  const { user, profile } = useSimpleAuth();

  return (
    <Layout pageType="dashboard">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">
            {t("common:navigation.dashboard", "Dashboard")}
          </h1>
          
          <Card>
            <CardHeader>
              <CardTitle>
                Willkommen, {profile?.first_name || user?.email}!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Dein Dashboard wird bald verfügbar sein.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
