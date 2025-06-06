
import React from 'react';
import Layout from '@/components/Layout';
import SystemTestRunner from '@/utils/system-testing/SystemTestRunner';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';

const SystemTests: React.FC = () => {
  const { profile } = useOptimizedAuth();
  
  // Only allow admin and super_admin access
  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Zugriff verweigert
              </CardTitle>
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
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold">System-Tests</h1>
        </div>
        
        <SystemTestRunner />
      </div>
    </Layout>
  );
};

export default SystemTests;
