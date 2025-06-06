
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useOptimizedAuth } from "@/contexts/OptimizedAuthContext";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus, Clock, CheckCircle, PlusCircle, MapPin } from "lucide-react";

const DashboardSender = () => {
  const { t } = useTranslation(["common"]);
  const { profile, user } = useOptimizedAuth();
  const { getLocalizedUrl } = useLanguageMCP();
  const navigate = useNavigate();

  console.log('🎯 DashboardSender: Rendering for user:', user?.email, 'role:', profile?.role);

  if (!profile || !['sender_private', 'sender_business'].includes(profile.role)) {
    return (
      <Layout pageType="authenticated">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Zugriff verweigert</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Diese Seite ist nur für Sender zugänglich.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const handleCreateOrder = () => {
    navigate(getLocalizedUrl("/create-order"));
  };

  const userName = profile?.first_name || profile?.name || user?.email?.split('@')[0] || "Sender";

  return (
    <Layout pageType="authenticated">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">
                Hallo {userName}! 👋
              </h1>
              <p className="text-gray-600 mt-2">
                Bereit für deinen nächsten Transport? Hier siehst du deine Aktivitäten.
              </p>
            </div>
            <Button 
              onClick={handleCreateOrder}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white flex items-center gap-2"
              size="lg"
            >
              <PlusCircle className="h-5 w-5" />
              Neuen Auftrag erstellen
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleCreateOrder}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <PlusCircle className="h-5 w-5 text-brand-primary" />
                  Neuer Auftrag
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Erstelle einen neuen Transportauftrag und finde den passenden Fahrer.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(getLocalizedUrl("/orders"))}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                  Meine Aufträge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Verwalte deine aktiven und vergangenen Transportaufträge.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(getLocalizedUrl("/profile"))}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-green-600" />
                  Profil & Region
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Bearbeite dein Profil und erweitere deine Transportregion.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Current Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Aktuelle Aktivitäten
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Keine aktiven Transporte
                </h3>
                <p className="text-gray-600 mb-6">
                  Du hast aktuell keine aktiven Transportaufträge. Erstelle deinen ersten Auftrag und finde einen Fahrer!
                </p>
                <Button onClick={handleCreateOrder} className="bg-brand-primary hover:bg-brand-primary/90 text-white">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Ersten Auftrag erstellen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardSender;
