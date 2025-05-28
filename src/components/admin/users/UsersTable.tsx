
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
import { Trash2 } from "lucide-react";
import { RoleManager } from '@/components/admin/users/RoleManager';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import type { AdminUser } from "@/types/admin";

interface UsersTableProps {
  users: AdminUser[];
  isLoading: boolean;
  onToggleActive: (userId: string, active: boolean) => void;
  onDeleteUser: (userId: string) => void;
  onUserUpdated: () => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  isLoading,
  onToggleActive,
  onDeleteUser,
  onUserUpdated
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
              <Button 
                variant="destructive" 
                size="icon" 
                onClick={() => onDeleteUser(user.user_id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
