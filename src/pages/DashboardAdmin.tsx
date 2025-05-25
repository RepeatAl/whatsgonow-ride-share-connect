
import React from 'react';
import Layout from '@/components/Layout';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Users, BarChart3, Settings, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';

const DashboardAdmin = () => {
  const { profile } = useSimpleAuth();
  const navigate = useNavigate();
  const { getLocalizedUrl } = useLanguageMCP();

  console.log("🛡️ DashboardAdmin rendered for user:", profile?.email);

  return (
    <Layout pageType="profile">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Willkommen, {profile?.first_name || "Administrator"}! Verwalten Sie das System und überwachen Sie alle Aktivitäten.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(getLocalizedUrl("/admin/users"))}
            >
              <Users className="h-4 w-4 mr-2" />
              Benutzer verwalten
            </Button>
            <Button
              variant="default"
              onClick={() => navigate(getLocalizedUrl("/admin/dashboard"))}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Benutzer verwalten Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(getLocalizedUrl("/admin/users"))}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Benutzer verwalten
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Verwalten Sie alle registrierten Benutzer, Rollen und Berechtigungen.
              </p>
            </CardContent>
          </Card>

          {/* Analytics Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(getLocalizedUrl("/admin/dashboard"))}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Analytics & Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Übersicht über Systemstatistiken, Nutzung und Performance-Metriken.
              </p>
            </CardContent>
          </Card>

          {/* Validierung Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(getLocalizedUrl("/admin/validation"))}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-600" />
                Validierung & Moderation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Überprüfen Sie Benutzerverifizierungen und moderieren Sie Inhalte.
              </p>
            </CardContent>
          </Card>

          {/* Feedback Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(getLocalizedUrl("/admin/feedback"))}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Feedback & Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Bearbeiten Sie Benutzerfeedback und Support-Anfragen.
              </p>
            </CardContent>
          </Card>

          {/* Einstellungen Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(getLocalizedUrl("/admin"))}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-600" />
                System-Einstellungen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Konfigurieren Sie Systemeinstellungen und Plattform-Parameter.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Status Section */}
        <Card>
          <CardHeader>
            <CardTitle>Administrator Zugang</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>Vollzugriff auf alle Admin-Funktionen</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Rolle: {profile?.role === 'super_admin' ? 'Super Administrator' : 'Administrator'}
              </div>
              <div className="text-sm text-muted-foreground">
                E-Mail: {profile?.email}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DashboardAdmin;
