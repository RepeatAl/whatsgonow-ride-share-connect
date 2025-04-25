
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

const DashboardSender = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Willkommen, {profile?.name ?? "Versender"}
            </h1>
            <p className="text-muted-foreground">
              Hier findest du eine Übersicht deiner Transporte und Anfragen.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="brand"
              className="flex items-center gap-2"
              onClick={() => navigate("/create-order")}
            >
              <PlusCircle className="h-4 w-4" />
              Neuer Auftrag
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Deine aktuellen Aktivitäten</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Du hast aktuell keine aktiven Transporte. Sobald du einen Auftrag erstellst, erscheint er hier.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DashboardSender;
