
import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { PreRegistrationForm } from "@/components/pre-registration/PreRegistrationForm";

const PreRegister = () => {
  const { t } = useTranslation(["pre_register", "common"]);
  const { getLocalizedUrl } = useLanguageMCP();

  return (
    <Layout pageType="pre-register">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-brand-orange">
                  {t("pre_register:title", "Sei dabei, wenn whatsgonow startet!")}
                </CardTitle>
                <CardDescription className="text-lg mt-4">
                  {t("pre_register:subtitle", "Registriere dich jetzt für die Warteliste und sei einer der Ersten, die whatsgonow nutzen können.")}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <PreRegistrationForm />
                
                <div className="mt-8 text-center space-y-4">
                  <div className="border-t pt-6">
                    <p className="text-sm text-gray-600 mb-4">
                      Bereits registriert oder möchtest du dich direkt anmelden?
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link to={getLocalizedUrl("/register")}>
                        <Button variant="outline" className="w-full sm:w-auto">
                          Vollständige Registrierung
                        </Button>
                      </Link>
                      
                      <Link to={getLocalizedUrl("/login")}>
                        <Button variant="ghost" className="w-full sm:w-auto">
                          Bereits ein Konto? Anmelden
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
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
      </div>
    </Layout>
  );
};

export default PreRegister;
