
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import { useESGMetrics } from "@/utils/esg-utils";
import { getMockESGData } from "@/types/esg";

const ESGSection = () => {
  const { t, i18n, ready } = useTranslation('landing');
  const { getLocalizedUrl } = useLanguageMCP();
  const isRTL = i18n.language === 'ar';
  
  // Get ESG data and metrics using the new utility system
  const esgData = getMockESGData();
  const metrics = useESGMetrics(esgData);
  
  if (!ready) {
    return (
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="text-center animate-pulse">
                <CardHeader>
                  <div className="h-8 w-8 bg-gray-200 rounded mx-auto mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                </CardHeader>
                <CardContent>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-1" />
                  <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('esg.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            {t('esg.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <Card key={metric.key} className="text-center">
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
              {t('esg.cta_button')}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ESGSection;
