
import React from "react";
import { useOptimizedAuth } from "@/contexts/OptimizedAuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, Truck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useRoleRedirect } from "@/hooks/useRoleRedirect";

const Dashboard = () => {
  const { profile, loading } = useOptimizedAuth();
  const navigate = useNavigate();

  // This hook will redirect users based on their role
  useRoleRedirect();

  if (loading) {
    return (
      <Layout pageType="authenticated">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return null; // useRoleRedirect will handle the redirect
  }

  // This is a fallback dashboard for users without specific roles
  return (
    <Layout 
      title="Dashboard - Whatsgonow" 
      description="Dein persönliches Dashboard"
      pageType="authenticated"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Willkommen zurück!</h1>
          <p className="text-gray-600">
            Hier ist dein Dashboard, {profile.first_name}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Neuen Auftrag erstellen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Erstelle einen neuen Transportauftrag
              </p>
              <Link to="/create-order">
                <Button className="w-full">
                  Auftrag erstellen
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Meine Aufträge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Verwalte deine aktiven Transportaufträge
              </p>
              <Link to="/my-orders">
                <Button variant="outline" className="w-full">
                  Aufträge anzeigen
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Transport anbieten
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Biete deine Transportdienste an
              </p>
              <Link to="/offer-transport">
                <Button variant="outline" className="w-full">
                  Transport anbieten
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
