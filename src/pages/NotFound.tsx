
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language";
import Layout from "@/components/Layout";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation("common");
  const { getLocalizedUrl, currentLanguage } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const path = location.pathname;
  const pathWithoutLanguage = path.split('/').slice(2).join('/');
  const homeUrl = getLocalizedUrl("/", currentLanguage);

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-9xl font-extrabold text-gray-700 dark:text-gray-300 mb-4">404</h1>
          <div className="mb-8 space-y-4">
            <h2 className="text-2xl font-bold">{t("page_not_found")}</h2>
            <p className="text-muted-foreground">{t("page_not_found_desc")}</p>
            {pathWithoutLanguage && (
              <p className="text-sm border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded p-2 font-mono">
                /{pathWithoutLanguage}
              </p>
            )}
          </div>
          <Button variant="default" size="lg" onClick={() => window.history.back()} className="mr-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("go_back")}
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href={homeUrl}>{t("go_home")}</a>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
