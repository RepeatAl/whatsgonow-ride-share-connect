
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import Layout from "@/components/Layout";

/**
 * NotFound - Phase 1 Stabilization
 * Simplified 404 handling with proper MCP integration
 */
const NotFound = () => {
  const location = useLocation();
  const { t, ready } = useTranslation("common");
  const { getLocalizedUrl } = useLanguageMCP();

  useEffect(() => {
    console.log('[NOT-FOUND] User on path:', location.pathname);
  }, [location.pathname]);

  // Wait for translations to load
  if (!ready) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
      </Layout>
    );
  }

  const path = location.pathname;
  const pathSegments = path.split('/').filter(Boolean);
  const pathWithoutLanguage = pathSegments.length > 1 ? pathSegments.slice(1).join('/') : '';
  const homeUrl = getLocalizedUrl("/");

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-9xl font-extrabold text-gray-700 dark:text-gray-300 mb-4">404</h1>
          <div className="mb-8 space-y-4">
            <h2 className="text-2xl font-bold">Seite nicht gefunden</h2>
            <p className="text-muted-foreground">Die angeforderte Seite konnte nicht gefunden werden.</p>
            {pathWithoutLanguage && (
              <p className="text-sm border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded p-2 font-mono">
                /{pathWithoutLanguage}
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" size="lg" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href={homeUrl}>Zur Startseite</a>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
