
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
    console.log("[BackButton] Not rendering on landing page:", location.pathname);
    return null;
  }

  const handleGoBack = () => {
    try {
      console.log("[BackButton] Going back from:", location.pathname);
      
      // Check if we're on profile page and redirect to dashboard instead
      if (location.pathname.includes('/profile')) {
        const dashboardPath = `/${currentLanguage}/dashboard`;
        console.log("[BackButton] On profile, redirecting to dashboard:", dashboardPath);
        navigate(dashboardPath, { replace: true });
        return;
      }

      // Check if there's meaningful history to go back to
      if (window.history.length > 2) {
        // Check if we can safely go back
        const referrer = document.referrer;
        if (referrer && referrer.includes(window.location.origin)) {
          console.log("[BackButton] Going back in history");
          navigate(-1);
        } else {
          // If no valid referrer, go to dashboard
          console.log("[BackButton] No valid referrer, going to dashboard");
          navigate(`/${currentLanguage}/dashboard`, { replace: true });
        }
      } else {
        // If there's no history or only one item, go to dashboard
        console.log("[BackButton] No history, going to dashboard");
        navigate(`/${currentLanguage}/dashboard`, { replace: true });
      }
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback to dashboard on any error
      navigate(`/${currentLanguage}/dashboard`, { replace: true });
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
