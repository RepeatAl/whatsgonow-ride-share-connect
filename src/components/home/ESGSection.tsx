
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import { Leaf, TrendingUp, Award } from "lucide-react";

const ESGSection = () => {
  const { t, i18n, ready } = useTranslation('landing');
  const { getLocalizedUrl } = useLanguageMCP();
  const isRTL = i18n.language === 'ar';
  
  if (!ready) {
    return null;
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
          <Card className="text-center">
            <CardHeader>
              <Leaf className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">{t('esg.metric1.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 mb-1">1,247 kg</div>
              <p className="text-sm text-gray-600">{t('esg.metric1.description')}</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">{t('esg.metric2.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 mb-1">892</div>
              <p className="text-sm text-gray-600">{t('esg.metric2.description')}</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Award className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <CardTitle className="text-lg">{t('esg.metric3.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 mb-1">A-</div>
              <p className="text-sm text-gray-600">{t('esg.metric3.description')}</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button asChild size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
            <Link to={getLocalizedUrl("/esg-dashboard")}>{t('esg.cta_button')}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ESGSection;
