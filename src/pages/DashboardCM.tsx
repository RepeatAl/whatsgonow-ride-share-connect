
import React from 'react';
import Layout from '@/components/Layout';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Flag, Users, BarChart3, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';

const DashboardCM = () => {
  const { profile } = useSimpleAuth();
  const navigate = useNavigate();
  const { getLocalizedUrl } = useLanguageMCP();

  console.log("💬 DashboardCM rendered for user:", profile?.email);

  return (
    <Layout pageType="profile">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Community Manager Dashboard
            </h1>
            <p className="text-muted-foreground">
              Willkommen, {profile?.first_name || "Community Manager"}! Verwalten Sie die Community und moderieren Sie Inhalte.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(getLocalizedUrl("/inbox"))}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Nachrichten
            </Button>
            <Button
              variant="default"
              onClick={() => navigate(getLocalizedUrl("/community-manager"))}
            >
              <Shield className="h-4 w-4 mr-2" />
              Moderation
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Community Moderation Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(getLocalizedUrl("/community-manager"))}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Moderation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Moderieren Sie Benutzeraktivitäten und verwalten Sie gemeldete Inhalte.
              </p>
            </CardContent>
          </Card>

          {/* Nachrichten Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(getLocalizedUrl("/inbox"))}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
                Nachrichten
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Bearbeiten Sie Community-Nachrichten und Support-Anfragen.
              </p>
            </CardContent>
          </Card>

          {/* Gemeldete Inhalte Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(getLocalizedUrl("/admin/feedback"))}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-orange-600" />
                Gemeldete Inhalte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Überprüfen Sie gemeldete Inhalte und treffen Sie Moderationsentscheidungen.
              </p>
            </CardContent>
          </Card>

          {/* Benutzer verwalten Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(getLocalizedUrl("/trust-management"))}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Benutzer verwalten
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Verwalten Sie Benutzerprofile und Community-Richtlinien.
              </p>
            </CardContent>
          </Card>

          {/* Community Analytics Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(getLocalizedUrl("/feedback"))}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                Community Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Übersicht über Community-Aktivitäten und Engagement-Metriken.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CM Status Section */}
        <Card>
          <CardHeader>
            <CardTitle>Community Manager Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>Aktiver Community Manager mit Moderationsrechten</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Rolle: Community Manager
              </div>
              <div className="text-sm text-muted-foreground">
                E-Mail: {profile?.email}
              </div>
              <div className="text-sm text-green-600">
                ✓ Berechtigt für Benutzermoderation und Community-Verwaltung
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DashboardCM;
