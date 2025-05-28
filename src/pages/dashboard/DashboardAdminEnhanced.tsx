
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersIcon, Shield, Ban, Video } from "lucide-react";
import { EnhancedSuspendedUsersTab } from "@/components/suspension/EnhancedSuspendedUsersTab";
import UnsuspendExpiredUsersButton from "@/components/admin/UnsuspendExpiredUsersButton";
import AdminVideoUploadPanel from "@/components/admin/AdminVideoUploadPanel";
import { EscalationsTab } from "@/components/escalation";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { useAdminUsers } from "@/hooks/use-admin-users";
import { useAdminGuard } from "@/hooks/useAdminGuard";

const DashboardAdminEnhanced = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { isAdmin, isAdminOrCM } = useAdminGuard();
  const { users, loading, fetchUsers, updateUserRole, toggleUserActive, deleteUser } = useAdminUsers();
  
  // Nur Admins und CMs können auf diese Seite zugreifen
  if (!isAdminOrCM) {
    return (
      <Layout>
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-600 mb-2">Zugriff verweigert</h2>
              <p className="text-gray-600">Sie haben keine Berechtigung für diesen Bereich.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            {isAdmin ? 'Admin Dashboard' : 'Community Manager Dashboard'}
          </h1>
        </div>

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
            {isAdmin && (
              <TabsTrigger value="videos" className="flex items-center gap-1">
                <Video className="h-4 w-4" />
                <span>Videos</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{isAdmin ? 'Admin' : 'Community Manager'} Übersicht</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Ban className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Suspendierungen</p>
                          <p className="text-lg font-semibold">Mit Audit-Log</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {isAdmin && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Video className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="text-sm text-muted-foreground">Video-Upload</p>
                            <p className="text-lg font-semibold">Admin Bereich</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-amber-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Eskalationen</p>
                          <p className="text-lg font-semibold">Monitoring</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <UsersIcon className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Nutzer</p>
                          <p className="text-lg font-semibold">Verwaltung</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">✅ Verfügbare Features</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• <strong>Nutzer-Verwaltung:</strong> Rollenverwaltung und Benutzer-Aktionen</li>
                    <li>• <strong>Eskalations-System:</strong> Automatische und manuelle Eskalationen</li>
                    <li>• <strong>Suspendierung:</strong> Vollständige Protokollierung aller Aktionen</li>
                    {isAdmin && (
                      <li>• <strong>Video-Management:</strong> Sichere Uploads und Verwaltung</li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Nutzerverwaltung</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                  <p className="text-sm text-blue-700">
                    <strong>Berechtigung:</strong> {isAdmin ? 'Admin' : 'Community Manager'} - Gefunden: {users.length} Nutzer
                  </p>
                </div>
                
                <UsersTable 
                  users={users}
                  isLoading={loading}
                  onToggleActive={toggleUserActive}
                  onDeleteUser={deleteUser}
                  onUserUpdated={fetchUsers}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="escalations" className="space-y-6 mt-6">
            <EscalationsTab />
          </TabsContent>
          
          <TabsContent value="suspensions" className="space-y-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Suspendierte Nutzer</h2>
              {isAdmin && <UnsuspendExpiredUsersButton />}
            </div>
            <EnhancedSuspendedUsersTab />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="videos" className="space-y-6 mt-6">
              <AdminVideoUploadPanel />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default DashboardAdminEnhanced;
