
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

interface LoginPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
  message?: string;
  redirectAfterLogin?: string;
}

/**
 * LoginPrompt - Modal für nahtlose Login-Aufforderung
 * 
 * Erscheint wenn Nutzer eine geschützte Aktion ausführen möchte.
 * Bietet schnellen Zugang zu Login und Registrierung.
 */
const LoginPrompt: React.FC<LoginPromptProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  message,
  redirectAfterLogin
}) => {
  const { t } = useTranslation(['auth', 'common']);
  const { getLocalizedUrl } = useLanguageMCP();

  const loginUrl = getLocalizedUrl('/login');
  const registerUrl = getLocalizedUrl('/register');

  const handleLoginClick = () => {
    // Speichere die ursprüngliche Aktion für Redirect nach Login
    if (redirectAfterLogin) {
      sessionStorage.setItem('redirectAfterLogin', redirectAfterLogin);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {t('auth:login_required', 'Anmeldung erforderlich')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-center text-sm text-muted-foreground">
            {message || t('auth:login_required_message', 'Für diese Aktion musst du angemeldet sein.')}
          </p>
          
          <div className="flex flex-col space-y-3">
            <Link to={loginUrl} onClick={handleLoginClick}>
              <Button className="w-full" size="lg">
                <LogIn className="mr-2 h-4 w-4" />
                {t('auth:sign_in', 'Anmelden')}
              </Button>
            </Link>
            
            <Link to={registerUrl} onClick={handleLoginClick}>
              <Button variant="outline" className="w-full" size="lg">
                <UserPlus className="mr-2 h-4 w-4" />
                {t('auth:sign_up', 'Registrieren')}
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <Button variant="ghost" onClick={onClose} size="sm">
              {t('common:cancel', 'Abbrechen')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginPrompt;
