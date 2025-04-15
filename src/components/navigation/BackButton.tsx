
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Pages where we don't want to show the back button
const excludedPaths = ['/', '/dashboard', '/login'];

export const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Don't render on excluded paths
  if (excludedPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <Button 
      variant="ghost" 
      className="w-fit mb-4" 
      onClick={() => navigate(-1)}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Zurück
    </Button>
  );
};
