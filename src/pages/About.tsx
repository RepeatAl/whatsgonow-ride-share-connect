
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import Layout from "@/components/Layout";

const About = () => {
  const { t, i18n } = useTranslation(["landing", "common"]);
  const { getLocalizedUrl } = useLanguageMCP();
  const isRTL = i18n.language === 'ar';

  return (
    <Layout pageType="landing">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {t("landing:about.title", "Über Whatsgonow")}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t("landing:about.subtitle", "Die innovative Crowdlogistik-Plattform für effiziente Transporte zwischen privaten und kleingewerblichen Nutzern")}
              </p>
            </div>

            {/* Mission */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-brand-orange">
                  {t("landing:about.mission.title", "Unsere Mission")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {t("landing:about.mission.description", "Whatsgonow ist eine Crowdlogistik-Plattform, die spontane und planbare Transporte zwischen privaten oder kleingewerblichen Auftraggebern und mobilen Fahrern vermittelt. Unser Ziel ist es, Leerfahrten zu reduzieren, Einkommensquellen zu schaffen und Lieferungen effizienter zu gestalten.")}
                </p>
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    {t("landing:about.features.contractors.title", "Für Auftraggeber")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-700">
                    <li>• {t("landing:about.features.contractors.item1", "Einfache Transportvermittlung von A nach B")}</li>
                    <li>• {t("landing:about.features.contractors.item2", "Flexible Terminplanung")}</li>
                    <li>• {t("landing:about.features.contractors.item3", "Transparente Preisverhandlung")}</li>
                    <li>• {t("landing:about.features.contractors.item4", "Sicherer QR-Code-basierter Abholprozess")}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    {t("landing:about.features.drivers.title", "Für Fahrer")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-700">
                    <li>• {t("landing:about.features.drivers.item1", "Zusätzliche Einkommensquelle durch bestehende Fahrten")}</li>
                    <li>• {t("landing:about.features.drivers.item2", "Flexible Routenplanung mit Seitensteps")}</li>
                    <li>• {t("landing:about.features.drivers.item3", "Verified Driver System für Vertrauen")}</li>
                    <li>• {t("landing:about.features.drivers.item4", "Automatische Abrechnung nach Lieferung")}</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-6">
                {t("landing:about.cta.title", "Bereit anzufangen?")}
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-brand-orange hover:bg-brand-orange/90">
                  <Link to={getLocalizedUrl("/pre-register")}>
                    {t("landing:about.cta.preregister", "Vorab registrieren")}
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to={getLocalizedUrl("/")}>
                    {t("common:back_home", "Zurück zur Startseite")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
