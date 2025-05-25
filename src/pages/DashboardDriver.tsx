
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlusCircle, Route, List, Search, Truck } from "lucide-react";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

const DashboardDriver = () => {
  const { profile } = useSimpleAuth();
  const navigate = useNavigate();
  const { getLocalizedUrl } = useLanguageMCP();

  console.log("🚛 DashboardDriver rendered for user:", profile?.email);

  return (
    <Layout pageType="profile">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Willkommen, {profile?.first_name || "Fahrer"}!
            </h1>
            <p className="text-muted-foreground">
              Verwalten Sie Ihre Fahrten und finden Sie passende Transportaufträge.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(getLocalizedUrl("/rides"))}
            >
              <List className="h-4 w-4 mr-2" />
              Meine Fahrten
            </Button>
            <Button
              variant="default"
              className="flex items-center gap-2"
              onClick={() => navigate(getLocalizedUrl("/rides/create"))}
            >
              <PlusCircle className="h-4 w-4" />
              Fahrt einstellen
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Fahrt einstellen Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(getLocalizedUrl("/rides/create"))}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-blue-600" />
                Fahrt einstellen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Veröffentlichen Sie eine neue Fahrt und finden Sie passende Aufträge für Ihre Route.
              </p>
            </CardContent>
          </Card>

          {/* Meine Fahrten Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(getLocalizedUrl("/rides"))}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5 text-green-600" />
                Meine Fahrten
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Übersicht über alle Ihre eingestellten Fahrten und deren Status.
              </p>
            </CardContent>
          </Card>

          {/* Aufträge finden Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(getLocalizedUrl("/orders"))}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-orange-600" />
                Aufträge finden
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Finden Sie verfügbare Transportaufträge in Ihrer Region.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Status Section */}
        <Card>
          <CardHeader>
            <CardTitle>Ihr Fahrer-Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {profile?.verified ? (
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Verifiziert - Sie können Fahrten einstellen und Aufträge annehmen</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-orange-600">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  <span>Verifizierung ausstehend - Bitte vervollständigen Sie Ihr Profil</span>
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                Status: Fahrer Account
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

export default DashboardDriver;
