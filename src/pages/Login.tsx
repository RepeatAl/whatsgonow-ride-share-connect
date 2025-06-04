
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import EnhancedLoginForm from '@/components/auth/EnhancedLoginForm';

const Login = () => {
  const { t } = useTranslation(['auth', 'common']);
  const { getLocalizedUrl, currentLanguage } = useLanguageMCP();

  console.log('[Login] Current language:', currentLanguage);
  console.log('[Login] Login URL:', getLocalizedUrl('/login'));
  console.log('[Login] Register URL:', getLocalizedUrl('/register'));
  console.log('[Login] Home URL:', `/${currentLanguage}`);

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
            <Link to={`/${currentLanguage}`}>
              <Button variant="outline">
                {t('common:back_home', 'Zurück zur Startseite')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
