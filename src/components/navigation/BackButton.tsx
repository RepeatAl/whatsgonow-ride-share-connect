
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Nur auf der Startseite ausblenden
const excludedPaths = ['/'];

export const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Don't render on excluded paths
  if (excludedPaths.includes(location.pathname)) {
    return null;
  }

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <Button 
      variant="ghost" 
      className="w-fit mb-4" 
      onClick={handleGoBack}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Zurück
    </Button>
  );
};
