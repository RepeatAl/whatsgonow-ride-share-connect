
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

export const HomeButton = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguageMCP();

  const handleGoHome = () => {
    try {
      console.log("[HomeButton] Navigating to home:", `/${currentLanguage}`);
      navigate(`/${currentLanguage}`, { replace: true });
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback to root
      window.location.href = `/${currentLanguage}`;
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      className="w-fit" 
      onClick={handleGoHome}
      aria-label="Zur Startseite"
    >
      <Home className="h-4 w-4 mr-2" />
      Startseite
    </Button>
  );
};
