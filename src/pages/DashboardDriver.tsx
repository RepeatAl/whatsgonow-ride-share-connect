
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlusCircle, Route, List } from "lucide-react";

const DashboardDriver = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <Layout pageType="profile">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Willkommen, {profile?.first_name || "Fahrer"}
            </h1>
            <p className="text-muted-foreground">
              Verwalte deine Fahrten und finde passende Aufträge.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/rides")}
            >
              <List className="h-4 w-4 mr-2" />
              Meine Fahrten
            </Button>
            <Button
              variant="default"
              className="flex items-center gap-2"
              onClick={() => navigate("/rides/create")}
            >
              <PlusCircle className="h-4 w-4" />
              Fahrt einstellen
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Fahrt einstellen Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/rides/create")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-blue-600" />
                Fahrt einstellen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Veröffentliche eine neue Fahrt und finde passende Aufträge für deine Route.
              </p>
            </CardContent>
          </Card>

          {/* Meine Fahrten Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/rides")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5 text-green-600" />
                Meine Fahrten
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Übersicht über alle deine eingestellten Fahrten und deren Status.
              </p>
            </CardContent>
          </Card>

          {/* Aufträge finden Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/orders")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5 text-orange-600" />
                Aufträge finden
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Finde verfügbare Transportaufträge in deiner Region.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Status Section */}
        <Card>
          <CardHeader>
            <CardTitle>Dein Status</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.verified ? (
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>Verifiziert - Du kannst Fahrten einstellen</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-orange-600">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span>Verifizierung ausstehend - Bitte vervollständige dein Profil</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DashboardDriver;
