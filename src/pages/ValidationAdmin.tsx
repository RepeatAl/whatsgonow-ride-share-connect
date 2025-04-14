
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ValidationDashboard from '@/components/admin/ValidationDashboard';
import Layout from '@/components/Layout';

const ValidationAdmin: React.FC = () => {
  const { user, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg">Lade Benutzerinformationen...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Redirect non-admin users
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout>
      <ValidationDashboard />
    </Layout>
  );
};

export default ValidationAdmin;
