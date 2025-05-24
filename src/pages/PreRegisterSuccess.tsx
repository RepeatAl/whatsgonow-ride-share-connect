
import { Suspense } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Mail } from "lucide-react";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useLanguage } from "@/contexts/language";

export default function PreRegisterSuccess() {
  const { t } = useTranslation('pre_register');
  const { getLocalizedUrl } = useLanguage();
  
  return (
    <Layout>
      <Suspense fallback={<LoadingScreen variant="inline" />}>
        <div className="container py-12">
          <div className="max-w-2xl mx-auto text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">
              {t('success.title')}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              {t('success.description')}
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <Mail className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-blue-700 mb-2">
                {t('success.confirm_notice')}
              </p>
              <p className="text-sm text-blue-600">
                {t('success.spam_notice')}
              </p>
            </div>
            <p className="text-base text-gray-600 mb-8">
              {t('success.login_notice')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="default">
                <Link to={getLocalizedUrl("/")} replace>
                  {t('success.back_to_home')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to={getLocalizedUrl("/faq")}>
                  {t('success.learn_more', 'Mehr erfahren')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Suspense>
    </Layout>
  );
}
