
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import EnhancedLoginForm from '@/components/auth/EnhancedLoginForm';

const Login = () => {
  const { t } = useTranslation(['auth', 'common']);
  const { getLocalizedUrl } = useLanguageMCP();

  const handleBackToHome = () => {
    try {
      // Use window.location.href as fallback for reliable navigation
      window.location.href = getLocalizedUrl('/');
    } catch (error) {
      // Ultimate fallback to root
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6">
        <EnhancedLoginForm />
        
        <div className="text-center space-y-2">
          <Link to={getLocalizedUrl('/register')}>
            <Button variant="link">
              {t('auth:no_account', 'Noch kein Konto? Jetzt registrieren')}
            </Button>
          </Link>
          <div>
            <Button variant="outline" onClick={handleBackToHome}>
              {t('common:back_home', 'Zurück zur Startseite')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
