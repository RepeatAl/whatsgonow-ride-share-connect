
import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const { t } = useTranslation(["dashboard", "common"]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {t("dashboard:title", "Dashboard")}
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard:welcome", "Willkommen")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Dashboard-Inhalte werden hier implementiert</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
