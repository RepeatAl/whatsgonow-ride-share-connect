
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

// Don't show BackButton on home/landing pages for any language
const excludedPaths = ['/', '/de', '/en', '/ar', '/de/', '/en/', '/ar/'];

export const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguageMCP();
  
  // Don't render on excluded paths (landing pages)
  if (excludedPaths.includes(location.pathname)) {
    return null;
  }

  const handleGoBack = () => {
    try {
      // Check if we're on profile page and redirect to dashboard instead
      if (location.pathname.includes('/profile')) {
        const dashboardPath = `/${currentLanguage}/dashboard`;
        navigate(dashboardPath, { replace: true });
        return;
      }

      // Check if we're on login/register pages - go to home
      if (location.pathname.includes('/login') || location.pathname.includes('/register')) {
        const homePath = `/${currentLanguage}`;
        try {
          navigate(homePath, { replace: true });
        } catch (navError) {
          // Fallback to window.location for reliability
          window.location.href = homePath;
        }
        return;
      }

      // Check if there's meaningful history to go back to
      if (window.history.length > 2) {
        // Check if we can safely go back
        const referrer = document.referrer;
        if (referrer && referrer.includes(window.location.origin)) {
          navigate(-1);
        } else {
          // If no valid referrer, go to dashboard
          const dashboardPath = `/${currentLanguage}/dashboard`;
          try {
            navigate(dashboardPath, { replace: true });
          } catch (navError) {
            window.location.href = dashboardPath;
          }
        }
      } else {
        // If there's no history or only one item, go to dashboard
        const dashboardPath = `/${currentLanguage}/dashboard`;
        try {
          navigate(dashboardPath, { replace: true });
        } catch (navError) {
          window.location.href = dashboardPath;
        }
      }
    } catch (error) {
      // Ultimate fallback to home page
      window.location.href = `/${currentLanguage}`;
    }
  };

  return (
    <Button 
      variant="ghost" 
      className="w-fit mb-4" 
      onClick={handleGoBack}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      {t('common.back', 'Zurück')}
    </Button>
  );
};
