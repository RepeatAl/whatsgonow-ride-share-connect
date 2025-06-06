import React from 'react';
import Layout from '@/components/Layout';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import DashboardAdminEnhanced from '@/pages/dashboard/DashboardAdminEnhanced';

const DashboardAdmin = () => {
  const { profile } = useOptimizedAuth();

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    return (
      <Layout pageType="authenticated">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Zugriff verweigert</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Diese Seite ist nur für Administratoren zugänglich.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageType="admin">
      <DashboardAdminEnhanced />
    </Layout>
  );
};

export default DashboardAdmin;
