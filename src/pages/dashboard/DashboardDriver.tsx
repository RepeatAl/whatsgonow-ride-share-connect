
import React from 'react';
import Layout from '@/components/Layout';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Fahrer Dashboard
          </h1>
          <p className="text-gray-600">
            Willkommen, {profile?.first_name || profile?.name}! Hier verwalten Sie Ihre Fahrten.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Verfügbare Aufträge</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-gray-600">Neue Transportanfragen</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Aktive Fahrten</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-gray-600">Laufende Transporte</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Verdienst heute</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">€127,50</p>
              <p className="text-sm text-gray-600">Brutto-Einnahmen</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardDriverPage;
