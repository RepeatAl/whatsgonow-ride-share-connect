
import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = () => {
  const { t } = useTranslation(["profile", "common"]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {t("profile:title", "Profil")}
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>{t("profile:settings", "Profileinstellungen")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Profil-Inhalte werden hier implementiert</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
