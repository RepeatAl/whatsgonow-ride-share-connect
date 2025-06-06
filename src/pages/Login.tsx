import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import EnhancedLoginForm from '@/components/auth/EnhancedLoginForm';
import EmergencyResetButton from '@/components/ui/EmergencyResetButton';
import Layout from '@/components/layout/Layout';

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
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <EnhancedLoginForm />
          
          <div className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="p-4">
                <div className="text-sm text-gray-500">
                  {t('auth:login_description', 'Melden Sie sich an, um Ihre Daten zu sehen')}
                </div>
              </div>
            </div>

            <div>
              <Button variant="outline" onClick={handleBackToHome}>
                {t('common:back_home', 'Zurück zur Startseite')}
              </Button>
            </div>

            {/* Emergency Reset Button für Login-Probleme */}
            <div className="text-center border-t pt-4">
              <div className="text-xs text-gray-500 mb-2">
                Bei Login-Problemen:
              </div>
              <EmergencyResetButton />
            </div>

            <div className="text-center space-y-2">
              <Link to={getLocalizedUrl('/register')}>
                <Button variant="link">
                  {t('auth:no_account', 'Noch kein Konto? Jetzt registrieren')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
