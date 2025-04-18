
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const DashboardAdmin = () => {
  const { profile } = useAuth();
  
  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">
          Administrator Dashboard
        </h1>
        <p className="text-muted-foreground mb-8">
          Willkommen {profile?.name}, hier siehst du eine Übersicht aller Plattform-Aktivitäten.
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Systemübersicht</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Das Administrator Dashboard bietet dir vollen Zugriff auf alle Systemeinstellungen und Nutzerkonten.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DashboardAdmin;
