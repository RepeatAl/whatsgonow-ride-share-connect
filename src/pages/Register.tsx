
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

const Register = () => {
  const { t } = useTranslation(["auth", "common"]);
  const { getLocalizedUrl } = useLanguageMCP();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {t("auth:register", "Registrieren")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            Registrierungs-Formular wird hier implementiert
          </p>
          <div className="text-center">
            <Link to={getLocalizedUrl("/login")}>
              <Button variant="link">
                {t("auth:have_account", "Bereits ein Konto? Anmelden")}
              </Button>
            </Link>
          </div>
          <div className="text-center">
            <Link to={getLocalizedUrl("/")}>
              <Button variant="outline">
                {t("common:back_home", "Zurück zur Startseite")}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
