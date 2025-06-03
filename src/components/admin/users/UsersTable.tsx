
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2, Shield } from "lucide-react";
import { RoleManager } from '@/components/admin/users/RoleManager';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import type { AdminUser } from "@/types/admin";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UsersTableProps {
  users: AdminUser[];
  isLoading: boolean;
  onToggleActive: (userId: string, active: boolean) => void;
  onDeleteUser: (userId: string) => void;
  onUserUpdated: () => void;
  onHealthCheck?: () => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  isLoading,
  onToggleActive,
  onDeleteUser,
  onUserUpdated,
  onHealthCheck
}) => {
  const { profile } = useSimpleAuth();
  const isSuperAdmin = profile?.role === 'super_admin';

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Lade Benutzerdaten...
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Keine Benutzer gefunden
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Health-Check Button für Admins */}
      {isSuperAdmin && onHealthCheck && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onHealthCheck}
            className="flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            System-Health prüfen
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>E-Mail</TableHead>
            <TableHead>Rolle</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.user_id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {isSuperAdmin ? (
                  <RoleManager 
                    userId={user.user_id} 
                    currentRole={user.role}
                    onRoleChanged={onUserUpdated}
                    userEmail={user.email}
                  />
                ) : (
                  user.role
                )}
              </TableCell>
              <TableCell>{user.region}</TableCell>
              <TableCell>
                <Switch 
                  checked={user.active}
                  onCheckedChange={(checked) => 
                    onToggleActive(user.user_id, checked)
                  }
                />
              </TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="icon"
                      disabled={!isSuperAdmin}
                      title={isSuperAdmin ? "Nutzer löschen" : "Nur Super-Admins können Nutzer löschen"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Nutzer wirklich löschen?</AlertDialogTitle>
                      <AlertDialogDescription className="space-y-2">
                        <p>
                          <strong>{user.name}</strong> ({user.email}) wird <strong>permanent gelöscht</strong>.
                        </p>
                        <p className="text-sm text-amber-600">
                          ⚠️ <strong>Alle zugehörigen Daten werden ebenfalls gelöscht:</strong>
                        </p>
                        <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                          <li>Profile und Kontodaten</li>
                          <li>Upload-Sessions und Dateien</li>
                          <li>Nachrichten und Benachrichtigungen</li>
                          <li>Audit-Logs und Aktivitätsprotokoll</li>
                          <li>Adressbuch und Analytics</li>
                        </ul>
                        <p className="text-sm font-medium text-red-600">
                          Diese Aktion kann nicht rückgängig gemacht werden!
                        </p>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDeleteUser(user.user_id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Permanent löschen
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
