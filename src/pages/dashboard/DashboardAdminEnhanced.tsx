
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
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";

const DashboardAdminEnhanced = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { profile } = useSimpleAuth();
  const { users, loading, fetchUsers, updateUserRole, toggleUserActive, deleteUser } = useAdminUsers();
  
  // Nur Admins und Super-Admins können auf diese Seite zugreifen
  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
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
            Enhanced Admin Dashboard
          </h1>
          <div className="text-sm text-gray-500">
            Rolle: {profile.role} | User: {profile.email}
          </div>
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
            <TabsTrigger value="videos" className="flex items-center gap-1">
              <Video className="h-4 w-4" />
              <span>Videos</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Enhanced Admin Übersicht</CardTitle>
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
                  <h3 className="font-medium text-green-800 mb-2">✅ Implementierte Verbesserungen</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• <strong>Audit-Funktion:</strong> Vollständige Protokollierung aller Suspension-Aktionen</li>
                    <li>• <strong>Frontend-Enforcement:</strong> Intelligente Status-Prüfung (aktiv/abgelaufen/widerrufen)</li>
                    <li>• <strong>Mehrsprachigkeit:</strong> i18n-ready mit reason_codes und Übersetzungsunterstützung</li>
                    <li>• <strong>Video-Upload:</strong> Sicherer Admin-Bereich mit Drag&Drop und Storage-Bucket</li>
                    <li>• <strong>Zugriffskontrolle:</strong> Rollenbasierte Sichtbarkeit und Berechtigungen</li>
                  </ul>
                </div>

                {/* Nur für Super-Admins sichtbare Informationen */}
                {profile.role === 'super_admin' && (
                  <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h3 className="font-medium text-purple-800 mb-2">🔐 Super-Admin Bereich</h3>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Systemweite Konfiguration und Einstellungen</li>
                      <li>• Erweiterte Audit-Logs und System-Monitoring</li>
                      <li>• Rollenmanagement und Berechtigungsverteilung</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Enhanced Nutzerverwaltung</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Erweiterte Nutzerverwaltung mit verbesserter Audit-Funktionalität und intelligenter Status-Prüfung.
                </p>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                  <p className="text-sm text-blue-700">
                    <strong>Berechtigung:</strong> Als {profile.role} können Sie Nutzerinformationen verwalten und Aktionen durchführen.
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    Gefunden: {users.length} Nutzer
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
              <h2 className="text-lg font-semibold">Enhanced Suspendierte Nutzer</h2>
              <UnsuspendExpiredUsersButton />
            </div>
            <EnhancedSuspendedUsersTab />
          </TabsContent>

          <TabsContent value="videos" className="space-y-6 mt-6">
            <AdminVideoUploadPanel />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DashboardAdminEnhanced;
