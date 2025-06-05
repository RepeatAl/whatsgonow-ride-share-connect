
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import Landing from '@/components/Landing';
import DashboardRedirect from '@/components/DashboardRedirect';
import LanguageSwitcher from '@/components/language/LanguageSwitcher';

const Home = () => {
  const { t } = useTranslation();
  const { user, loading } = useSimpleAuth();
  const { currentLanguage } = useLanguageMCP();

  console.log('[Home] Current user:', user?.id);
  console.log('[Home] Loading state:', loading);
  console.log('[Home] Current language:', currentLanguage);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t('common:loading', 'Wird geladen...')}</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, redirect to appropriate dashboard
  if (user) {
    return <DashboardRedirect />;
  }

  // Show landing page for anonymous users with language switcher
  return (
    <div className="min-h-screen">
      {/* Language Switcher for Anonymous Users */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      
      <Landing />
    </div>
  );
};

export default Home;
