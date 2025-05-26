
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

export const HomeButton = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getLocalizedUrl } = useLanguageMCP();

  const handleGoHome = () => {
    try {
      navigate(getLocalizedUrl("/"), { replace: true });
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback to home page on error
      navigate("/", { replace: true });
    }
  };

  return (
    <Button 
      variant="ghost" 
      className="w-fit" 
      onClick={handleGoHome}
    >
      <Home className="h-4 w-4 mr-2" />
      {t('common.home', 'Home')}
    </Button>
  );
};
