
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersIcon, Shield, Ban } from "lucide-react";
import { SuspendedUsersTab, UnsuspendExpiredUsersButton } from "@/components/suspension";

const DashboardAdmin = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          Admin Dashboard
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-1">
              <UsersIcon className="h-4 w-4" />
              <span>Nutzer</span>
            </TabsTrigger>
            <TabsTrigger value="escalations" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span>Eskalationen</span>
            </TabsTrigger>
            <TabsTrigger value="suspensions" className="flex items-center gap-1">
              <Ban className="h-4 w-4" />
              <span>Suspendierungen</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Übersicht</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Willkommen im Admin-Dashboard. Wählen Sie einen Bereich aus den Tabs oben.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Nutzerverwaltung</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Hier können Sie alle Nutzer der Plattform einsehen und verwalten.
                </p>
                {/* User management components would go here */}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="escalations" className="space-y-6 mt-6">
            {/* Escalation components would go here */}
          </TabsContent>
          
          <TabsContent value="suspensions" className="space-y-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Suspendierte Nutzer</h2>
              <UnsuspendExpiredUsersButton />
            </div>
            <SuspendedUsersTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DashboardAdmin;
