
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, Route, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

const Landing = () => {
  const { t } = useTranslation(["landing", "common"]);
  const { getLocalizedUrl } = useLanguageMCP();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Whatsgonow
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {t("landing:hero.subtitle", "Crowdlogistik-Plattform für spontane und planbare Transporte")}
        </p>
        <div className="flex gap-4 justify-center">
          <Link to={getLocalizedUrl("/register")}>
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
              {t("common:get_started", "Jetzt starten")}
            </Button>
          </Link>
          <Link to={getLocalizedUrl("/esg-dashboard")}>
            <Button size="lg" variant="outline">
              ESG Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Truck className="h-8 w-8 text-orange-500 mb-2" />
              <CardTitle>{t("landing:features.drivers.title", "Fahrer")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t("landing:features.drivers.description", "Verdiene Geld auf deinen bereits geplanten Fahrten")}
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Package className="h-8 w-8 text-blue-500 mb-2" />
              <CardTitle>{t("landing:features.senders.title", "Auftraggeber")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t("landing:features.senders.description", "Günstige und flexible Transportlösungen")}
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Route className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle>{t("landing:features.efficiency.title", "Effizienz")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t("landing:features.efficiency.description", "Weniger Leerfahrten, mehr Nachhaltigkeit")}
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-purple-500 mb-2" />
              <CardTitle>{t("landing:features.community.title", "Community")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t("landing:features.community.description", "Verbinde Menschen für gemeinsame Ziele")}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t("landing:cta.title", "Bereit loszulegen?")}
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          {t("landing:cta.description", "Registriere dich jetzt und werde Teil der Crowdlogistik-Revolution")}
        </p>
        <Link to={getLocalizedUrl("/register")}>
          <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
            {t("common:register", "Registrieren")}
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default Landing;
