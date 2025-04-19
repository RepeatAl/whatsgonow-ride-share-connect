
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut();
      toast({
        description: "Erfolgreich abgemeldet",
      });
      navigate("/", { replace: true }); // Ensure redirect to home page
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Fehler beim Abmelden",
        description: "Bitte versuche es erneut",
      });
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
