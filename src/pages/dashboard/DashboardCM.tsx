
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const DashboardCM = () => {
  const { profile } = useAuth();
  
  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">
          Community Manager Dashboard
        </h1>
        <p className="text-muted-foreground mb-8">
          Willkommen {profile?.name}, hier siehst du eine Übersicht der Community-Aktivitäten.
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Community Übersicht</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Das Community Manager Dashboard bietet dir Zugriff auf Nutzerverwaltung und Moderationswerkzeuge.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DashboardCM;
