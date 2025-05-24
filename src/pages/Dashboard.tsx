
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { getRoleBasedRedirectPath } from "@/utils/auth-utils";
import { useLanguage } from "@/contexts/language";

/**
 * Dashboard-Komponente mit optimierter Weiterleitung
 * Nutzt die zentrale Auth-Redirect-Logik für nahtlose Navigation
 */
const Dashboard = () => {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const { getLocalizedUrl } = useLanguage();
  
  useEffect(() => {
    if (!loading && profile) {
      // Nur weiterleiten wenn wir ein spezifisches Rollendashboard haben
      const roleBasedPath = getRoleBasedRedirectPath(profile.role);
      if (roleBasedPath !== "/dashboard") {
        const localizedPath = getLocalizedUrl(roleBasedPath);
        navigate(localizedPath, { replace: true });
      }
    }
  }, [profile, loading, navigate, getLocalizedUrl]);
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
          <LoadingSpinner message="Dashboard wird geladen..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
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
