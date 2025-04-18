
import React from 'react';
import Layout from '@/components/Layout';
import { useRoleRedirect } from '@/hooks/useRoleRedirect';

const DashboardAdmin = () => {
  // This will redirect to role-specific dashboard if needed
  useRoleRedirect();
  
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Willkommen im Admin-Dashboard.</p>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardAdmin;
