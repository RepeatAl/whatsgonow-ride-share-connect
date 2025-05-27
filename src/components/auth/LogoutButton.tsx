
import { useState } from "react";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

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
  const { signOut } = useSimpleAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { getLocalizedUrl } = useLanguageMCP();
  
  const handleLogout = async () => {
    try {
      setLoading(true);
      
      // Verwende signOut von SimpleAuth
      await signOut();
      
      toast({
        description: "Erfolgreich abgemeldet",
      });
      
      // Navigiere zur lokalisierten Startseite
      const homeUrl = getLocalizedUrl("/");
      navigate(homeUrl, { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Fehler beim Abmelden",
        description: "Bitte versuche es erneut",
      });
      
      // Im Fehlerfall trotzdem versuchen zur Startseite zu navigieren
      const homeUrl = getLocalizedUrl("/");
      navigate(homeUrl, { replace: true });
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
