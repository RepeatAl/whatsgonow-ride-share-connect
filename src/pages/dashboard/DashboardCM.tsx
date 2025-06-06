import React from 'react';
import Layout from '@/components/Layout';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import DashboardCM from '@/pages/dashboard/DashboardCM';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardCMPage = () => {
  const { profile } = useOptimizedAuth();

  if (!profile || profile.role !== 'cm') {
    return (
      <Layout pageType="authenticated">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Zugriff verweigert</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Diese Seite ist nur für Community Manager zugänglich.</p>
            </CardContent>
          </Card>
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
