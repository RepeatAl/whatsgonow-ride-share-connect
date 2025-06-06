import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { CheckCircle, Mail, Home } from "lucide-react";

const PreRegisterSuccess = () => {
  const { t } = useTranslation(["pre_register", "common"]);
  const { getLocalizedUrl } = useLanguageMCP();

  return (
    <Layout pageType="public">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <CardTitle className="text-3xl font-bold text-green-700">
                  {t("pre_register:success.title", "Voranmeldung erfolgreich!")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="text-center space-y-4">
                  <p className="text-lg text-gray-700">
                    {t("pre_register:success.description", "Vielen Dank für dein Interesse an whatsgonow. Wir haben dir (falls technisch möglich) eine Bestätigungs-E-Mail geschickt.")}
                  </p>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-800">Nächste Schritte:</h3>
                    </div>
                    <div className="text-blue-700 space-y-2 text-sm">
                      <p>
                        {t("pre_register:success.confirm_notice", "Bitte klicke auf den Bestätigungslink in dieser E-Mail, um deinen Zugang zu aktivieren.")}
                      </p>
                      <p>
                        {t("pre_register:success.login_notice", "Danach kannst du dich jederzeit einloggen!")}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                      {t("pre_register:success.spam_notice", "Sollte die E-Mail nicht ankommen, prüfe deinen Spam-Ordner oder versuch es später erneut.")}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <Link to={getLocalizedUrl("/login")}>
                    <Button className="w-full sm:w-auto bg-brand-orange hover:bg-brand-orange/90">
                      Jetzt anmelden
                    </Button>
                  </Link>
                  
                  <Link to={getLocalizedUrl("/")}>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Home className="w-4 h-4 mr-2" />
                      {t("pre_register:success.back_to_home", "Zurück zur Startseite")}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PreRegisterSuccess;
