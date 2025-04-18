
import React from 'react';
import Layout from '@/components/Layout';
import { useRoleRedirect } from '@/hooks/useRoleRedirect';

const DashboardDriver = () => {
  // This will redirect to role-specific dashboard if needed
  useRoleRedirect();
  
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Fahrer Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Willkommen im Fahrer-Dashboard.</p>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardDriver;
