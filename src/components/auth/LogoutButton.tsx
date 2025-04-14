
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

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
  
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  
  return (
    <Button 
      variant={variant} 
      onClick={handleLogout}
      className={className}
    >
      {showIcon && <LogOut className="h-4 w-4 mr-2" />}
      Abmelden
    </Button>
  );
};

export default LogoutButton;
