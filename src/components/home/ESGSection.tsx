
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import { Leaf, TrendingUp, Award } from "lucide-react";

// Type for ESG metrics data
interface ESGMetric {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
  unit?: string;
  description: string;
  color: string;
}

const ESGSection = () => {
  const { t, i18n, ready } = useTranslation('landing');
  const { getLocalizedUrl } = useLanguageMCP();
  const isRTL = i18n.language === 'ar';
  
  if (!ready) {
    return null;
  }

  // Mock data - in real implementation this would come from API/database
  const getESGMetrics = (): ESGMetric[] => [
    {
      icon: Leaf,
      title: t('esg.metric1.title', 'CO₂ eingespart'),
      value: 1247,
      unit: 'kg',
      description: t('esg.metric1.description', 'Durch geteilte Fahrten'),
      color: 'green'
    },
    {
      icon: TrendingUp,
      title: t('esg.metric2.title', 'Leerfahrten vermieden'),
      value: 892,
      unit: '',
      description: t('esg.metric2.description', 'Diesen Monat'),
      color: 'blue'
    },
    {
      icon: Award,
      title: t('esg.metric3.title', 'ESG-Rating'),
      value: 'A-',
      unit: '',
      description: t('esg.metric3.description', 'Nachhaltigkeitsbewertung'),
      color: 'orange'
    }
  ];

  const metrics = getESGMetrics();
  
  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('esg.title', 'Nachhaltigkeit & Verantwortung')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            {t('esg.description', 'Unser Beitrag zu einer besseren Welt durch verantwortungsvolle Logistik')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <Card key={index} className="text-center">
                <CardHeader>
                  <IconComponent className={`h-8 w-8 text-${metric.color}-600 mx-auto mb-2`} />
                  <CardTitle className="text-lg">{metric.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold text-${metric.color}-600 mb-1`}>
                    {metric.value} {metric.unit}
                  </div>
                  <p className="text-sm text-gray-600">{metric.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button asChild size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
            <Link to={getLocalizedUrl("/esg-dashboard")}>
              {t('esg.cta_button', 'ESG-Dashboard anzeigen')}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ESGSection;
