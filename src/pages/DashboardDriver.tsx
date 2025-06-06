import React from 'react';
import Layout from '@/components/Layout';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import DashboardDriver from '@/pages/dashboard/DashboardDriver';

const DashboardDriverPage = () => {
  const { profile } = useOptimizedAuth();

  if (!profile || profile.role !== 'driver') {
    return (
      <Layout pageType="authenticated">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Zugriff verweigert</h2>
            <p className="text-gray-600">Diese Seite ist nur für Fahrer zugänglich.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageType="authenticated">
      <DashboardDriver />
    </Layout>
  );
};

export default DashboardDriverPage;
