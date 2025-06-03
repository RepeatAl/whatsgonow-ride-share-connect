
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdminUsers } from "@/hooks/use-admin-users";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { Badge } from "@/components/ui/badge";

const UsersPage = () => {
  const navigate = useNavigate();
  const { 
    users, 
    loading, 
    updateUserRole, 
    toggleUserActive, 
    deleteUser,
    fetchUsers,
    checkDeletionReadiness 
  } = useAdminUsers();

  const suspendedUsers = users.filter(user => !user.active);
  const totalUsers = users.length;

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          className="pl-0" 
          onClick={() => navigate("/admin")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zum Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Benutzerverwaltung</h1>
      </div>

      {/* Status-Übersicht */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-blue-600 mr-4" />
            <div>
              <p className="text-2xl font-bold">{totalUsers}</p>
              <p className="text-sm text-muted-foreground">Gesamt-Nutzer</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <AlertTriangle className="h-8 w-8 text-amber-600 mr-4" />
            <div>
              <p className="text-2xl font-bold">{suspendedUsers.length}</p>
              <p className="text-sm text-muted-foreground">Gesperrt</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <div className="h-4 w-4 bg-green-600 rounded-full"></div>
            </div>
            <div>
              <p className="text-2xl font-bold">{totalUsers - suspendedUsers.length}</p>
              <p className="text-sm text-muted-foreground">Aktiv</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Benutzer-Aktionen</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">
                CASCADE-Löschung aktiviert
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchUsers}
                disabled={loading}
              >
                Aktualisieren
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">
              ✅ <strong>Sichere Löschung:</strong> Foreign Key Constraints mit CASCADE sind aktiv
            </p>
            <p className="mb-2">
              🔄 <strong>Automatische Bereinigung:</strong> Alle abhängigen Daten werden automatisch mitgelöscht
            </p>
            <p>
              🛡️ <strong>Audit-Trail:</strong> Wichtige Logs bleiben für Compliance erhalten
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <UsersTable
          users={users}
          isLoading={loading}
          onToggleActive={toggleUserActive}
          onDeleteUser={deleteUser}
          onUserUpdated={fetchUsers}
          onHealthCheck={checkDeletionReadiness}
        />
      </div>
    </div>
  );
};

export default UsersPage;
