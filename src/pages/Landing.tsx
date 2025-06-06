
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, MapPin, Star, Users, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import Layout from "@/components/Layout";

const Landing = () => {
  const { t } = useTranslation(["landing", "common"]);
  const { getLocalizedUrl } = useLanguageMCP();

  const features = [
    {
      icon: <Truck className="h-8 w-8" />,
      title: t("landing:features.transport.title", "Flexible Transporte"),
      description: t("landing:features.transport.description", "Von kleinen Paketen bis zu größeren Gegenständen - finde den passenden Transport.")
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: t("landing:features.community.title", "Vertrauensvolle Community"),
      description: t("landing:features.community.description", "Alle Fahrer sind verifiziert und bewertet für deine Sicherheit.")
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: t("landing:features.realtime.title", "Live-Tracking"),
      description: t("landing:features.realtime.description", "Verfolge deine Sendung in Echtzeit von Abholung bis Zustellung.")
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: t("landing:features.security.title", "Sicher & Versichert"),
      description: t("landing:features.security.description", "Alle Transporte sind versichert und deine Daten geschützt.")
    }
  ];

  return (
    <Layout 
      title={t("landing:page_title", "Whatsgonow - Deine Crowdlogistik-Plattform")}
      description={t("landing:page_description", "Verbinde dich mit verifizierten Fahrern für schnelle und zuverlässige Transporte in deiner Nähe.")}
      pageType="public"
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t("landing:hero.title", "Transport. Einfach. Sicher.")}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t("landing:hero.subtitle", "Verbinde dich mit verifizierten Fahrern für schnelle und zuverlässige Transporte in deiner Nähe.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={getLocalizedUrl("/register")}>
              <Button size="lg" className="w-full sm:w-auto">
                {t("landing:hero.cta_primary", "Jetzt loslegen")}
              </Button>
            </Link>
            <Link to={getLocalizedUrl("/about")}>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                {t("landing:hero.cta_secondary", "Mehr erfahren")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("landing:features.title", "Warum Whatsgonow?")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("landing:features.subtitle", "Moderne Technologie trifft auf menschliche Verbindungen für den perfekten Transport.")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-none shadow-lg">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t("landing:cta.title", "Bereit für deinen ersten Transport?")}
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            {t("landing:cta.subtitle", "Registriere dich kostenlos und starte noch heute.")}
          </p>
          <Link to={getLocalizedUrl("/register")}>
            <Button size="lg" variant="secondary">
              {t("landing:cta.button", "Kostenlos registrieren")}
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Landing;
