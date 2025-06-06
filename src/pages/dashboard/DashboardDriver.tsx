import React from 'react';
import Layout from '@/components/Layout';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import DashboardDriver from '@/pages/dashboard/DashboardDriver';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardDriverPage = () => {
  const { profile } = useOptimizedAuth();

  if (!profile || profile.role !== 'driver') {
    return (
      <Layout pageType="authenticated">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Zugriff verweigert</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Diese Seite ist nur für Fahrer zugänglich.</p>
            </CardContent>
          </Card>
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
