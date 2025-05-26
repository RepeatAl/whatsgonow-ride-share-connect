
import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

const PreRegister = () => {
  const { t } = useTranslation(["auth", "common"]);
  const { getLocalizedUrl } = useLanguageMCP();

  return (
    <Layout pageType="auth">
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {t("auth:pre_register", "Vorab-Registrierung")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  Registriere dich jetzt für den frühen Zugang zu Whatsgonow.
                </p>
                
                <div className="space-y-2">
                  <Link to={getLocalizedUrl("/register")}>
                    <Button className="w-full bg-brand-orange hover:bg-brand-orange/90">
                      Jetzt registrieren
                    </Button>
                  </Link>
                  <Link to={getLocalizedUrl("/login")}>
                    <Button variant="outline" className="w-full">
                      Bereits registriert? Anmelden
                    </Button>
                  </Link>
                  <Link to={getLocalizedUrl("/")}>
                    <Button variant="link">
                      {t("common:back_home", "Zurück zur Startseite")}
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PreRegister;
