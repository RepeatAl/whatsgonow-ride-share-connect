import React from 'react';
import Layout from '@/components/Layout';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import DashboardCM from '@/pages/dashboard/DashboardCM';

const DashboardCMPage = () => {
  const { profile } = useOptimizedAuth();

  if (!profile || profile.role !== 'cm') {
    return (
      <Layout pageType="authenticated">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Zugriff verweigert!</strong>
            <span className="block sm:inline">Du hast keine Berechtigung, auf dieses Dashboard zuzugreifen.</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageType="authenticated">
      <DashboardCM />
    </Layout>
  );
};

export default DashboardCMPage;
