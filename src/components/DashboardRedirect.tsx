
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';

const DashboardRedirect = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile, loading } = useOptimizedAuth();
  const { getLocalizedUrl } = useLanguageMCP();

  useEffect(() => {
    if (loading) return;

    if (!profile) {
      navigate(getLocalizedUrl('/login'));
      return;
    }

    // FIXED: Konsolidiertes Dashboard für alle Rollen
    console.log('🔄 DashboardRedirect: Redirecting user with role:', profile.role);
    
    switch (profile.role) {
      case 'admin':
      case 'super_admin':
        navigate(getLocalizedUrl('/dashboard/admin'));
        break;
      case 'cm':
        navigate(getLocalizedUrl('/dashboard/cm'));
        break;
      case 'sender_private':
      case 'sender_business':
        navigate(getLocalizedUrl('/dashboard/sender'));
        break;
      case 'driver':
      default:
        // FIXED: Alle Driver und unbekannte Rollen zu konsolidiertem Dashboard
        navigate(getLocalizedUrl('/dashboard'));
    }
  }, [profile, loading, navigate, getLocalizedUrl]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>{t('common:redirecting', 'Weiterleitung...')}</p>
      </div>
    </div>
  );
};

export default DashboardRedirect;
