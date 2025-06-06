
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";
import { ShieldAlert } from "lucide-react";

interface AccessDeniedMessageProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

export const AccessDeniedMessage: React.FC<AccessDeniedMessageProps> = ({ 
  title,
  description,
  variant = "destructive"
}) => {
  const { t } = useTranslation('common');

  return (
    <Alert variant={variant} className="max-w-xl mx-auto mt-6">
      <ShieldAlert className="h-5 w-5" />
      <AlertTitle>
        {title || t('access_denied.title', 'Zugriff verweigert')}
      </AlertTitle>
      <AlertDescription>
        {description || t('access_denied.description', 'Dieser Bereich ist nur für Administratoren zugänglich.')}
      </AlertDescription>
    </Alert>
  );
};

export default AccessDeniedMessage;
