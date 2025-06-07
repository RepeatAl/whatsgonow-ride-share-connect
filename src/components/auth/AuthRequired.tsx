
import React, { ReactNode, useState } from 'react';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import { requiresAuthentication } from '@/auth/permissions';
import { useTranslation } from 'react-i18next';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import LoginPrompt from '@/components/ui/LoginPrompt';

interface AuthRequiredProps {
  children: ReactNode;
  action: string;
  loginPrompt?: string;
  fallback?: ReactNode;
  onAuthSuccess?: () => void;
}

/**
 * AuthRequired - Zentrale Komponente für das "öffentlich vs. geschützt" Prinzip
 * 
 * Prüft nur bei konkreten Aktionen (Button-Klicks) ob Login erforderlich ist.
 * Wenn ja: Login-Modal, wenn nein: Aktion direkt ausführen.
 * 
 * Verwendung:
 * <AuthRequired action="create_order" loginPrompt="Zum Bestellen bitte anmelden">
 *   <Button onClick={handleCreateOrder}>Transport buchen</Button>
 * </AuthRequired>
 */
const AuthRequired: React.FC<AuthRequiredProps> = ({
  children,
  action,
  loginPrompt,
  fallback,
  onAuthSuccess
}) => {
  const { user } = useOptimizedAuth();
  const { t } = useTranslation(['auth', 'common']);
  const { getLocalizedUrl } = useLanguageMCP();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Prüfe ob diese Aktion Login erfordert
  const needsAuth = requiresAuthentication(action);

  // Wenn keine Authentifizierung nötig, zeige Kinder direkt
  if (!needsAuth) {
    return <>{children}</>;
  }

  // Wenn authentifiziert, zeige Kinder
  if (user) {
    return <>{children}</>;
  }

  // Wenn nicht authentifiziert aber Login erforderlich
  const handleAuthClick = () => {
    setShowLoginPrompt(true);
  };

  const handleLoginSuccess = () => {
    setShowLoginPrompt(false);
    if (onAuthSuccess) {
      onAuthSuccess();
    }
  };

  const defaultPrompt = loginPrompt || t('auth:login_required_for_action', 'Für diese Aktion ist eine Anmeldung erforderlich');

  // Fallback-Content oder Login-Aufforderung
  if (fallback) {
    return <>{fallback}</>;
  }

  // Standard: Zeige Login-Button anstelle der ursprünglichen Aktion
  return (
    <div className="auth-required-wrapper">
      {React.cloneElement(children as React.ReactElement, {
        onClick: handleAuthClick,
        children: t('auth:login_to_continue', 'Anmelden um fortzufahren')
      })}
      
      {showLoginPrompt && (
        <LoginPrompt
          isOpen={showLoginPrompt}
          onClose={() => setShowLoginPrompt(false)}
          onLoginSuccess={handleLoginSuccess}
          message={defaultPrompt}
          redirectAfterLogin={action}
        />
      )}
    </div>
  );
};

export default AuthRequired;
