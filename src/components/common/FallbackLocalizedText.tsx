
import React from 'react';
import { useTranslation } from "react-i18next";

interface FallbackLocalizedTextProps {
  tKey: string;
  fallback: string;
  className?: string;
  namespace?: string;
}

export const FallbackLocalizedText: React.FC<FallbackLocalizedTextProps> = ({ 
  tKey, 
  fallback, 
  className,
  namespace = 'common'
}) => {
  const { t } = useTranslation(namespace);
  const text = t(tKey, fallback);

  return (
    <p className={`text-sm text-muted-foreground ${className ?? ""}`}>
      {text}
    </p>
  );
};

export default FallbackLocalizedText;
