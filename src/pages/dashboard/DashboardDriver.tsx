
import { useNavigate } from "react-router-dom";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlusCircle, Search } from "lucide-react";

const DashboardDriver = () => {
  const { profile } = useSimpleAuth();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Willkommen, {profile?.name ?? "Fahrer"}
            </h1>
            <p className="text-muted-foreground">
              Hier findest du verfügbare Aufträge in deiner Region.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate("/driver/order-preview")}
            >
              <Search className="h-4 w-4" />
              Aufträge anzeigen
            </Button>
            <Button
              variant="brand"
              className="flex items-center gap-2"
              onClick={() => navigate("/find-transport")}
            >
              <PlusCircle className="h-4 w-4" />
              Aufträge finden
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Deine aktuellen Aktivitäten</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Du hast aktuell keine angenommenen Transporte. Sobald du einen Auftrag annimmst, erscheint er hier.
            </p>
            
            <div className="mt-6">
              <Button 
                variant="secondary" 
                onClick={() => navigate("/driver/order-preview")}
                className="w-full sm:w-auto"
              >
                <Search className="h-4 w-4 mr-2" />
                Verfügbare Aufträge durchsuchen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DashboardDriver;
