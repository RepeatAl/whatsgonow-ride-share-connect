
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, User } from "lucide-react";

const Dashboard = () => {
  const { t } = useTranslation(["common"]);
  const { user, profile, loading, isProfileLoading } = useSimpleAuth();
  const { getLocalizedUrl } = useLanguageMCP();
  const navigate = useNavigate();

  // Rollenbasierte Weiterleitung
  useEffect(() => {
    if (loading || isProfileLoading) return;
    
    if (!user) {
      navigate(getLocalizedUrl("/login"));
      return;
    }

    if (!profile) {
      navigate(getLocalizedUrl("/profile"));
      return;
    }

    // Weiterleitung zum rollenspezifischen Dashboard
    switch (profile.role) {
      case "sender_private":
      case "sender_business":
        navigate(getLocalizedUrl("/dashboard/sender"), { replace: true });
        break;
      case "driver":
        navigate(getLocalizedUrl("/dashboard/driver"), { replace: true });
        break;
      case "cm":
        navigate(getLocalizedUrl("/dashboard/cm"), { replace: true });
        break;
      case "admin":
      case "super_admin":
        navigate(getLocalizedUrl("/dashboard/admin"), { replace: true });
        break;
      default:
        // Fallback für unbekannte Rollen
        console.log("Unknown role, staying on main dashboard:", profile.role);
    }
  }, [user, profile, loading, isProfileLoading, navigate, getLocalizedUrl]);

  if (loading || isProfileLoading) {
    return (
      <Layout pageType="dashboard">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Dashboard wird geladen...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Fallback für Benutzer ohne spezifische Rolle
  return (
    <Layout pageType="dashboard">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">
            Willkommen bei whatsgonow
          </h1>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-6 w-6" />
                Profil vervollständigen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Bitte vervollständige dein Profil, um whatsgonow nutzen zu können.
              </p>
              <Button asChild>
                <a href={getLocalizedUrl("/profile")}>
                  Profil bearbeiten
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
