
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Layout from "@/components/Layout";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { getRoleBasedRedirectPath, getCurrentLanguage } from "@/utils/auth-utils";

/**
 * Dashboard-Komponente mit optimierter Weiterleitung
 * Nutzt die zentrale Auth-Redirect-Logik für nahtlose Navigation
 */
const Dashboard = () => {
  const { profile, loading } = useSimpleAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  console.log("📊 Dashboard component rendered");
  console.log("📊 Profile:", profile);
  console.log("📊 Loading:", loading);
  console.log("📊 Current path:", location.pathname);
  
  useEffect(() => {
    if (!loading && profile) {
      const currentLang = getCurrentLanguage(location.pathname);
      const roleBasedPath = getRoleBasedRedirectPath(profile.role, currentLang);
      
      console.log("📊 Current language:", currentLang);
      console.log("📊 Role-based path:", roleBasedPath);
      console.log("📊 Current path:", location.pathname);
      
      // Nur weiterleiten wenn wir nicht schon auf dem richtigen rollenspezifischen Dashboard sind
      if (location.pathname !== roleBasedPath && roleBasedPath !== `/${currentLang}/dashboard`) {
        console.log("📊 Redirecting to role-specific dashboard:", roleBasedPath);
        navigate(roleBasedPath, { replace: true });
      }
    }
  }, [profile, loading, navigate, location.pathname]);
  
  if (loading) {
    console.log("📊 Showing loading spinner");
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
          <LoadingSpinner message="Dashboard wird geladen..." />
        </div>
      </Layout>
    );
  }

  console.log("📊 Rendering default dashboard content");
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        {profile && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p>Willkommen, {profile.first_name || profile.name || "Benutzer"}!</p>
            <p className="text-sm text-gray-500 mt-2">Ihre Rolle: {profile.role || "Unbekannt"}</p>
            <div className="text-sm text-blue-600 mt-2">
              Sie werden zu Ihrem rollenspezifischen Dashboard weitergeleitet...
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
