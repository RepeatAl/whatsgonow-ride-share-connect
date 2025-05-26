
import React from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ESGDashboard = () => {
  const { t } = useTranslation(["common"]);

  return (
    <Layout pageType="public">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">
            ESG Dashboard
          </h1>
          
          <Card>
            <CardHeader>
              <CardTitle>
                Nachhaltigkeits-Metriken
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Hier werden bald unsere ESG-Kennzahlen und Nachhaltigkeitsmetriken angezeigt.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ESGDashboard;
