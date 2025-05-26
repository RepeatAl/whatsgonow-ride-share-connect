
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, RefreshCw, Home, LogOut } from "lucide-react";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import { useNavigate } from "react-router-dom";

interface ProfileErrorRecoveryProps {
  error: string;
  hasTimedOut: boolean;
  onRetry: () => void;
}

const ProfileErrorRecovery = ({ error, hasTimedOut, onRetry }: ProfileErrorRecoveryProps) => {
  const { signOut } = useSimpleAuth();
  const { getLocalizedUrl } = useLanguageMCP();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      // Force navigation even if signOut fails
      navigate(getLocalizedUrl("/"));
    }
  };

  const handleGoHome = () => {
    navigate(getLocalizedUrl("/"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <CardTitle className="text-xl">
            {hasTimedOut ? "Profil-Laden unterbrochen" : "Profil-Problem"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center">
            {hasTimedOut 
              ? "Das Laden deines Profils hat zu lange gedauert. Dies kann an einer langsamen Internetverbindung liegen."
              : error || "Es gab ein Problem beim Laden deines Profils."
            }
          </p>
          
          <div className="space-y-2">
            <Button 
              onClick={onRetry} 
              className="w-full" 
              variant="default"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Profil erneut laden
            </Button>
            
            <Button 
              onClick={handleGoHome} 
              className="w-full" 
              variant="outline"
            >
              <Home className="h-4 w-4 mr-2" />
              Zur Startseite
            </Button>
            
            <Button 
              onClick={handleSignOut} 
              className="w-full" 
              variant="ghost"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Abmelden und neu versuchen
            </Button>
          </div>
          
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-500">
              Problem weiterhin bestehen?{" "}
              <a 
                href="mailto:support@whatsgonow.com" 
                className="text-brand-orange hover:underline"
              >
                Support kontaktieren
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileErrorRecovery;
