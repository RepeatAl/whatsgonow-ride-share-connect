
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageSquare, 
  AlertTriangle, 
  TrendingUp,
  FileText,
  Settings
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import { Link } from 'react-router-dom';
import DashboardAdminEnhanced from '@/pages/dashboard/DashboardAdminEnhanced';

const DashboardAdmin = () => {
  const { profile, user } = useOptimizedAuth();

  console.log('🎯 DashboardAdmin: Rendering for user:', user?.email, 'role:', profile?.role);

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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Willkommen, {profile?.first_name || user?.email}! Hier verwalten Sie das System.
          </p>
        </div>
        <DashboardAdminEnhanced />
      </div>
    </Layout>
  );
};

export default DashboardAdmin;
