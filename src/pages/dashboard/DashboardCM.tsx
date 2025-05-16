
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersIcon, Shield, LineChart } from "lucide-react";
import EscalationsTab from "@/components/escalation/EscalationsTab";

const DashboardCM = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">
          Community Manager Dashboard
        </h1>
        <p className="text-muted-foreground mb-8">
          Willkommen {profile?.name}, hier siehst du eine Übersicht der Community-Aktivitäten.
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <LineChart className="h-4 w-4" />
              <span>Übersicht</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-1">
              <UsersIcon className="h-4 w-4" />
              <span>Nutzer</span>
            </TabsTrigger>
            <TabsTrigger value="escalations" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span>Eskalationen</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
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
          </TabsContent>

          <TabsContent value="users">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Nutzerverwaltung</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Hier kannst du alle Nutzer einsehen und verwalten.
                </p>
                {/* UserList component would go here */}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="escalations">
            <EscalationsTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DashboardCM;
