
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/Layout';
import AdminToolsGrid from '@/components/admin/dashboard/AdminToolsGrid';
import KPICards from '@/components/admin/dashboard/KPICards';
import UserActivityTable from '@/components/admin/dashboard/UserActivityTable';
import TransactionsTable from '@/components/admin/dashboard/TransactionsTable';
import LogsTable from '@/components/admin/dashboard/LogsTable';
import FilterOptions from '@/components/admin/dashboard/FilterOptions';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminLogs } from '@/hooks/use-admin-logs';
import TrustScoreAdminPanel from '@/components/admin/TrustScoreAdminPanel';

const AdminDashboard = () => {
  const { profile, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  
  const {
    logs,
    transactions,
    userSummaries,
    stats,
    timeRange,
    setTimeRange,
    selectedRegion,
    setSelectedRegion,
    loading: dataLoading
  } = useAdminLogs(30);
  
  const loading = authLoading || dataLoading;
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!profile || profile.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">{t('admin.dashboard.title', 'Admin Dashboard')}</h1>
        
        <KPICards stats={stats} timeRange={parseInt(timeRange)} />
        
        <AdminToolsGrid />
        
        <div className="mt-8">
          <FilterOptions 
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            userSummaries={userSummaries}
          />
        </div>
        
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <UserActivityTable userSummaries={userSummaries} />
            
            <div className="h-6"></div>
            
            <TransactionsTable transactions={transactions} timeRange={parseInt(timeRange)} />
          </div>
          
          <div className="lg:col-span-4">
            <TrustScoreAdminPanel />
            <div className="h-6"></div>
            <LogsTable logs={logs} timeRange={parseInt(timeRange)} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
