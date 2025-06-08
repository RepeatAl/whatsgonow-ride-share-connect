
import React from 'react';
import Layout from '@/components/Layout';
import SystemAudit from '@/components/admin/SystemAudit';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import { Navigate } from 'react-router-dom';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';

const SystemAuditPage = () => {
  const { user, profile, loading } = useOptimizedAuth();
  const { getLocalizedUrl } = useLanguageMCP();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  // Only allow admins and super_admins to access this page
  if (!user || !profile || !['admin', 'super_admin'].includes(profile.role || '')) {
    return <Navigate to={getLocalizedUrl('/dashboard')} replace />;
  }

  return (
    <Layout 
      title="System Audit - Whatsgonow"
      description="Comprehensive system readiness check"
      pageType="admin"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              System Audit
            </h1>
            <p className="text-gray-600">
              Umfassende Bereitschaftsprüfung vor GoLive
            </p>
          </div>
          
          <SystemAudit />
        </div>
      </div>
    </Layout>
  );
};

export default SystemAuditPage;
