
import React from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Leaf, TrendingUp, Award, Users, Route, Recycle } from "lucide-react";

interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
  unit?: string;
  description: string;
  progress?: number;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  icon: IconComponent, 
  title, 
  value, 
  unit, 
  description, 
  progress,
  color 
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <IconComponent className={`h-4 w-4 text-${color}-600`} />
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold text-${color}-600`}>
        {value} {unit}
      </div>
      <p className="text-xs text-muted-foreground mb-2">{description}</p>
      {progress !== undefined && (
        <Progress value={progress} className="h-2" />
      )}
    </CardContent>
  </Card>
);

const ESGDashboard = () => {
  const { t } = useTranslation(["common", "landing"]);

  // Mock ESG data - in real implementation this would come from API
  const esgMetrics = [
    {
      icon: Leaf,
      title: "CO₂-Einsparung",
      value: 1247,
      unit: "kg",
      description: "Durch geteilte Fahrten eingespart",
      progress: 78,
      color: "green"
    },
    {
      icon: Route,
      title: "Leerfahrten vermieden",
      value: 892,
      unit: "Fahrten",
      description: "Diesen Monat optimiert",
      progress: 65,
      color: "blue"
    },
    {
      icon: Users,
      title: "Aktive Community",
      value: 2543,
      unit: "Nutzer",
      description: "Registrierte Mitglieder",
      progress: 85,
      color: "purple"
    },
    {
      icon: TrendingUp,
      title: "Effizienz-Steigerung",
      value: 34,
      unit: "%",
      description: "Verbesserung der Routenoptimierung",
      progress: 34,
      color: "orange"
    },
    {
      icon: Recycle,
      title: "Wiederverwendungsrate",
      value: 89,
      unit: "%",
      description: "Erfolgreich vermittelte Gegenstände",
      progress: 89,
      color: "teal"
    },
    {
      icon: Award,
      title: "ESG-Score",
      value: "A-",
      unit: "",
      description: "Nachhaltigkeitsbewertung 2024",
      progress: 87,
      color: "amber"
    }
  ];

  const environmentalGoals = [
    { goal: "CO₂-Neutralität bis 2030", progress: 45, description: "Auf gutem Weg" },
    { goal: "100% Elektrofahrzeuge bis 2028", progress: 23, description: "Planung läuft" },
    { goal: "Zero Waste Büros bis 2025", progress: 78, description: "Fast erreicht" }
  ];

  return (
    <Layout pageType="public">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">
              ESG Dashboard - Nachhaltigkeit & Verantwortung
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Transparente Einblicke in unsere Umwelt-, Sozial- und Governance-Leistung
            </p>
          </div>
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {esgMetrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          {/* Environmental Goals */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                Umweltziele 2024-2030
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {environmentalGoals.map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{goal.goal}</span>
                      <span className="text-sm text-gray-600">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                    <p className="text-sm text-gray-600">{goal.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Impact Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Unser Impact in Zahlen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Umweltauswirkungen</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• 1.247 kg CO₂ durch Fahrtenteilung eingespart</li>
                    <li>• 892 Leerfahrten verhindert</li>
                    <li>• 15% weniger Verkehr in Städten</li>
                    <li>• 67% Reduzierung der Transportkosten</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Soziale Auswirkungen</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• 2.543 aktive Community-Mitglieder</li>
                    <li>• 156 neue Einkommensmöglichkeiten für Fahrer</li>
                    <li>• 98% Zufriedenheitsrate bei Nutzern</li>
                    <li>• 45 Städte und Regionen erreicht</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ESGDashboard;
