
import React from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner"; // Import hinzugefügt
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Dashboard-Komponente mit optimierter Ladedarstellung
 * Die Weiterleitung erfolgt jetzt zentral über den AuthContext
 */
const Dashboard = () => {
  const { profile, loading } = useAuth();
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p className="text-lg">Einen Moment bitte, Sie werden weitergeleitet...</p>
        {profile && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p>Willkommen, {profile.first_name || profile.name || "Benutzer"}!</p>
            <p className="text-sm text-gray-500 mt-2">Ihre Rolle: {profile.role || "Unbekannt"}</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
