
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

// Don't show BackButton on home/landing pages for any language
const excludedPaths = ['/', '/de', '/en', '/ar', '/de/', '/en/', '/ar/'];

export const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  // Don't render on excluded paths (landing pages)
  if (excludedPaths.includes(location.pathname)) {
    return null;
  }

  const handleGoBack = () => {
    try {
      if (window.history.length > 2) {
        navigate(-1);
      } else {
        // If there's no history or only one item in history, go home safely
        navigate("/de", { replace: true });
      }
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback to home page on error
      navigate("/de", { replace: true });
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
