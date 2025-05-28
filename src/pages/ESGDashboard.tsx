
import React from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Leaf } from "lucide-react";
import { useESGDashboardMetrics, useESGGoals } from "@/utils/esg-utils";
import { getMockESGData } from "@/types/esg";
import type { ESGMetric } from "@/types/esg";

const MetricCard: React.FC<ESGMetric> = ({ 
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
  const { t, ready } = useTranslation(["common", "landing"]);

  // Get ESG data using the new utility system
  const esgData = getMockESGData();
  const esgMetrics = useESGDashboardMetrics(esgData);
  const esgGoals = useESGGoals(esgData);

  if (!ready) {
    return (
      <Layout pageType="public">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageType="public">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">
              {t('esg.title', 'ESG Dashboard - Nachhaltigkeit & Verantwortung')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {t('esg.description', 'Transparente Einblicke in unsere Umwelt-, Sozial- und Governance-Leistung')}
            </p>
          </div>
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {esgMetrics.map((metric) => (
              <MetricCard key={metric.key} {...metric} />
            ))}
          </div>

          {/* Environmental Goals */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                {t('esg.goals.title', 'Umweltziele 2024-2030')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {esgGoals.map((goal, index) => (
                  <div key={goal.key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {t(`esg.goals.${goal.key}.title`, `Goal ${goal.key}`)}
                      </span>
                      <span className="text-sm text-gray-600">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                    <p className="text-sm text-gray-600">
                      {t(`esg.goals.${goal.key}.description`, `Description for ${goal.key}`)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Impact Summary */}
          <Card>
            <CardHeader>
              <CardTitle>{t('common.impact_summary', 'Unser Impact in Zahlen')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">{t('common.environmental_impact', 'Umweltauswirkungen')}</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• {esgData.metrics.co2Saved} kg CO₂ {t('common.saved_by_sharing', 'durch Fahrtenteilung eingespart')}</li>
                    <li>• {esgData.metrics.emptyRidesAvoided} {t('common.empty_rides_prevented', 'Leerfahrten verhindert')}</li>
                    <li>• 15% {t('common.less_traffic', 'weniger Verkehr in Städten')}</li>
                    <li>• 67% {t('common.cost_reduction', 'Reduzierung der Transportkosten')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">{t('common.social_impact', 'Soziale Auswirkungen')}</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• {esgData.metrics.activeUsers} {t('common.active_members', 'aktive Community-Mitglieder')}</li>
                    <li>• 156 {t('common.income_opportunities', 'neue Einkommensmöglichkeiten für Fahrer')}</li>
                    <li>• {esgData.metrics.reuseRate}% {t('common.satisfaction_rate', 'Zufriedenheitsrate bei Nutzern')}</li>
                    <li>• 45 {t('common.cities_reached', 'Städte und Regionen erreicht')}</li>
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
