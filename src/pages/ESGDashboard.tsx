
import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, TrendingUp, Users, Award } from "lucide-react";

const ESGDashboard = () => {
  const { t } = useTranslation(["esg", "common"]);

  const esgMetrics = [
    {
      title: "CO2 Einsparung",
      value: "1,247 kg",
      change: "+23%",
      icon: Leaf,
      color: "text-green-600"
    },
    {
      title: "Leerfahrten reduziert",
      value: "892",
      change: "+18%",
      icon: TrendingUp,
      color: "text-blue-600"
    },
    {
      title: "Aktive Fahrer",
      value: "156",
      change: "+12%",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "ESG Score",
      value: "A-",
      change: "Stabil",
      icon: Award,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ESG Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("esg:dashboard.subtitle", "Transparenz über unsere Nachhaltigkeitsbemühungen und Umweltauswirkungen")}
          </p>
          <Badge variant="outline" className="mt-4">
            {t("esg:dashboard.last_updated", "Letzte Aktualisierung: Heute")}
          </Badge>
        </div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {esgMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <Card key={index} className="relative overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <IconComponent className={`h-6 w-6 ${metric.color}`} />
                    <Badge variant="secondary">{metric.change}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-600">
                    {metric.title}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Environmental Impact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                {t("esg:environmental.title", "Umweltauswirkungen")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">
                  {t("esg:environmental.carbon_footprint", "CO2-Fußabdruck")}
                </h3>
                <p className="text-green-700 text-sm">
                  Durch unsere Plattform konnten wir in diesem Monat 1.247 kg CO2 einsparen.
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">
                  {t("esg:environmental.efficiency", "Transporteffizienz")}
                </h3>
                <p className="text-blue-700 text-sm">
                  892 Leerfahrten wurden durch unsere intelligente Routenoptimierung vermieden.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Social Impact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                {t("esg:social.title", "Gesellschaftliche Auswirkungen")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">
                  {t("esg:social.job_creation", "Arbeitsplätze")}
                </h3>
                <p className="text-purple-700 text-sm">
                  Über 156 aktive Fahrer nutzen unsere Plattform für zusätzliches Einkommen.
                </p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">
                  {t("esg:social.community", "Gemeinschaft")}
                </h3>
                <p className="text-orange-700 text-sm">
                  Wir fördern lokale Gemeinschaften durch flexible Transportlösungen.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Governance Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-orange-600" />
              {t("esg:governance.title", "Unternehmensführung")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-gray-50 rounded-lg p-4 mb-2">
                  <div className="text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-600">Transparenz</div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-gray-50 rounded-lg p-4 mb-2">
                  <div className="text-2xl font-bold text-gray-900">A-</div>
                  <div className="text-sm text-gray-600">ESG Rating</div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-gray-50 rounded-lg p-4 mb-2">
                  <div className="text-2xl font-bold text-gray-900">5★</div>
                  <div className="text-sm text-gray-600">Compliance</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            {t("esg:footer.note", "Diese Daten werden regelmäßig aktualisiert und von unabhängigen Dritten überprüft.")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ESGDashboard;
