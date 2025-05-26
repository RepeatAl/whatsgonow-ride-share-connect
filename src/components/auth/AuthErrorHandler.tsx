
import React from "react";
import { AlertCircle, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthErrorHandlerProps {
  error: string;
  email?: string;
  onRetry?: () => void;
  onBackToHome?: () => void;
}

// Admin whitelist for development bypass
const ADMIN_WHITELIST = [
  "rabieb@whatsgonow.com",
  "admin@whatsgonow.com"
];

const AuthErrorHandler = ({ error, email, onRetry, onBackToHome }: AuthErrorHandlerProps) => {
  const isAdminEmail = email && ADMIN_WHITELIST.includes(email.toLowerCase());
  
  // Categorize error types for better UX
  const getErrorInfo = (errorMessage: string) => {
    if (errorMessage.includes("Email not confirmed")) {
      return {
        type: "email_unverified",
        title: "E-Mail nicht bestätigt",
        message: "Bitte bestätige deine E-Mail-Adresse, um fortzufahren.",
        icon: <Mail className="h-5 w-5 text-blue-600" />,
        color: "border-blue-200 bg-blue-50"
      };
    } else if (errorMessage.includes("Invalid login credentials")) {
      if (isAdminEmail) {
        return {
          type: "admin_blocked",
          title: "Admin-Account nicht verifiziert",
          message: "Dein Admin-Account ist noch nicht verifiziert. Kontaktiere den Support oder nutze die E-Mail-Bestätigung.",
          icon: <Shield className="h-5 w-5 text-orange-600" />,
          color: "border-orange-200 bg-orange-50"
        };
      }
      return {
        type: "invalid_credentials",
        title: "Ungültige Anmeldedaten",
        message: "Bitte überprüfe deine E-Mail-Adresse und dein Passwort.",
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
        color: "border-red-200 bg-red-50"
      };
    } else if (errorMessage.includes("Rate limit exceeded")) {
      return {
        type: "rate_limit",
        title: "Zu viele Versuche",
        message: "Bitte warte einen Moment und versuche es später erneut.",
        icon: <AlertCircle className="h-5 w-5 text-yellow-600" />,
        color: "border-yellow-200 bg-yellow-50"
      };
    }
    
    return {
      type: "unknown",
      title: "Anmeldung fehlgeschlagen",
      message: errorMessage,
      icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      color: "border-red-200 bg-red-50"
    };
  };

  const errorInfo = getErrorInfo(error);

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${errorInfo.color}`}>
      {errorInfo.icon}
      <div className="flex-1">
        <h4 className="font-medium text-sm mb-1">{errorInfo.title}</h4>
        <p className="text-sm text-gray-700 mb-3">{errorInfo.message}</p>
        
        {/* Action buttons based on error type */}
        <div className="flex gap-2">
          {onRetry && (
            <Button size="sm" variant="outline" onClick={onRetry}>
              Erneut versuchen
            </Button>
          )}
          
          {errorInfo.type === "email_unverified" && (
            <Button size="sm" variant="outline" asChild>
              <a href="mailto:support@whatsgonow.com">
                Support kontaktieren
              </a>
            </Button>
          )}
          
          {errorInfo.type === "admin_blocked" && (
            <Button size="sm" variant="outline" asChild>
              <a href="mailto:tech@whatsgonow.com">
                Tech-Support
              </a>
            </Button>
          )}
          
          {onBackToHome && (
            <Button size="sm" variant="ghost" onClick={onBackToHome}>
              Zur Startseite
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthErrorHandler;
