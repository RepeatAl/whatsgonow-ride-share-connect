
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

const Login = () => {
  const { t } = useTranslation(["auth", "common"]);
  const { getLocalizedUrl } = useLanguageMCP();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {t("auth:login", "Anmelden")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            Login-Formular wird hier implementiert
          </p>
          <div className="text-center">
            <Link to={getLocalizedUrl("/register")}>
              <Button variant="link">
                {t("auth:no_account", "Noch kein Konto? Registrieren")}
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

export default Login;
