
import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Button } from "@/components/ui/button";

const Register = () => {
  const { t } = useTranslation(["auth", "common"]);
  const { getLocalizedUrl, currentLanguage } = useLanguageMCP();

  console.log("[Register] Current language:", currentLanguage);
  console.log("[Register] Register URL:", getLocalizedUrl("/register"));
  console.log("[Register] Login URL:", getLocalizedUrl("/login"));
  console.log("[Register] Home URL:", `/${currentLanguage}`);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {t("auth:register", "Registrieren")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RegisterForm />
            
            <div className="text-center space-y-2 mt-4">
              <Link to={getLocalizedUrl("/login")}>
                <Button variant="link">
                  {t("auth:have_account", "Bereits ein Konto? Anmelden")}
                </Button>
              </Link>
              <div>
                <Link to={`/${currentLanguage}`}>
                  <Button variant="outline">
                    {t("common:back_home", "Zurück zur Startseite")}
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
