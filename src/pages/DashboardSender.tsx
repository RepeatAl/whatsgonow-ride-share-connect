
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlusCircle, Package, Search, Truck } from "lucide-react";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

const DashboardSender = () => {
  const { profile } = useSimpleAuth();
  const navigate = useNavigate();
  const { getLocalizedUrl } = useLanguageMCP();

  console.log("📊 DashboardSender rendered for user:", profile?.email);

  return (
    <Layout pageType="profile">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Willkommen, {profile?.first_name || "Sender"}!
            </h1>
            <p className="text-muted-foreground">
              Hier können Sie Ihre Sendungen verwalten und neue Aufträge erstellen.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(getLocalizedUrl("/orders"))}
            >
              <Package className="h-4 w-4 mr-2" />
              Meine Aufträge
            </Button>
            <Button
              variant="default"
              className="flex items-center gap-2"
              onClick={() => navigate(getLocalizedUrl("/create-order"))}
            >
              <PlusCircle className="h-4 w-4" />
              Neuen Auftrag erstellen
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Auftrag erstellen Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(getLocalizedUrl("/create-order"))}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-blue-600" />
                Neuen Auftrag erstellen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Erstellen Sie einen neuen Transportauftrag und finden Sie den passenden Fahrer.
              </p>
            </CardContent>
          </Card>

          {/* Meine Aufträge Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(getLocalizedUrl("/orders"))}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                Meine Aufträge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Übersicht über alle Ihre aktiven und vergangenen Transportaufträge.
              </p>
            </CardContent>
          </Card>

          {/* Transport finden Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(getLocalizedUrl("/find-transport"))}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-orange-600" />
                Transport finden
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Finden Sie verfügbare Fahrer für Ihre Sendungen in der Region.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Status Section */}
        <Card>
          <CardHeader>
            <CardTitle>Ihr Account Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>Account aktiv - Sie können Aufträge erstellen</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Rolle: {profile?.role === 'sender_private' ? 'Privater Sender' : 'Geschäftlicher Sender'}
              </div>
              {profile?.profile_complete ? (
                <div className="text-sm text-green-600">
                  ✓ Profil vollständig ausgefüllt
                </div>
              ) : (
                <div className="text-sm text-orange-600">
                  ⚠ Profil unvollständig - Bitte vervollständigen Sie Ihr Profil
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DashboardSender;
