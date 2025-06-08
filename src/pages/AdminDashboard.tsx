
import React from 'react';
import Layout from '@/components/Layout';
import SystemAudit from '@/components/admin/SystemAudit';
import AuthFreezeToggle from '@/components/admin/AuthFreezeToggle';
import LiveTestSuite from '@/components/admin/LiveTestSuite';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import { Navigate } from 'react-router-dom';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Settings, TestTube } from 'lucide-react';

const AdminDashboard = () => {
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
      title="Admin Dashboard - Whatsgonow"
      description="System administration and monitoring"
      pageType="admin"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              System-Administration und GoLive-Bereitschaft
            </p>
          </div>
          
          <Tabs defaultValue="audit" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="audit" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                System Audit
              </TabsTrigger>
              <TabsTrigger value="control" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                System Control
              </TabsTrigger>
              <TabsTrigger value="testing" className="flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                Live Testing
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="audit">
              <SystemAudit />
            </TabsContent>
            
            <TabsContent value="control">
              <AuthFreezeToggle />
            </TabsContent>
            
            <TabsContent value="testing">
              <LiveTestSuite />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
