
import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardSender = () => {
  const { t } = useTranslation(["dashboard", "common"]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {t("dashboard:sender_title", "Sender Dashboard")}
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard:sender_welcome", "Willkommen Sender")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Sender Dashboard-Inhalte werden hier implementiert</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSender;
