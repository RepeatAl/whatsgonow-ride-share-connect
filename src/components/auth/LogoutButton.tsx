
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "brand" | "accent";
  showIcon?: boolean;
  className?: string;
}

const LogoutButton = ({ 
  variant = "outline", 
  showIcon = true,
  className = ""
}: LogoutButtonProps) => {
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      setLoading(true);
      
      // Verwende signOut von AuthContext
      await signOut();
      
      toast({
        description: "Erfolgreich abgemeldet",
      });
      
      // Forciert zur Startseite nach Abmelden mit vollständiger Seitenneuladen
      // Dies stellt sicher, dass alle Statusdaten zurückgesetzt werden
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Fehler beim Abmelden",
        description: "Bitte versuche es erneut",
      });
      
      // Im Fehlerfall trotzdem versuchen zur Startseite zu navigieren
      navigate("/", { replace: true });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Button 
      variant={variant} 
      onClick={handleLogout}
      className={className}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : showIcon ? (
        <LogOut className="h-4 w-4 mr-2" />
      ) : null}
      Abmelden
    </Button>
  );
};

export default LogoutButton;
