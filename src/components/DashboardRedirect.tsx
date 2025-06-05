
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';

const DashboardRedirect = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile, loading } = useSimpleAuth();
  const { getLocalizedUrl } = useLanguageMCP();

  useEffect(() => {
    if (loading) return;

    if (!profile) {
      navigate(getLocalizedUrl('/login'));
      return;
    }

    // Redirect based on user role
    switch (profile.role) {
      case 'admin':
      case 'super_admin':
        navigate(getLocalizedUrl('/admin/dashboard'));
        break;
      case 'cm':
        navigate(getLocalizedUrl('/dashboard/cm'));
        break;
      case 'driver':
        navigate(getLocalizedUrl('/dashboard/driver'));
        break;
      case 'sender_private':
      case 'sender_business':
        navigate(getLocalizedUrl('/dashboard/sender'));
        break;
      default:
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
