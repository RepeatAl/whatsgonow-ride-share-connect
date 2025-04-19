
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminUser } from "@/hooks/use-admin-users";

interface UsersTableProps {
  users: AdminUser[];
  isLoading: boolean;
}

export const UsersTable: React.FC<UsersTableProps> = ({ users, isLoading }) => {
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
            <TableCell>{user.role}</TableCell>
            <TableCell>{user.region}</TableCell>
            <TableCell>
              {user.banned_until ? (
                <span className="text-red-500">Gesperrt</span>
              ) : user.active ? (
                <span className="text-green-500">Aktiv</span>
              ) : (
                <span className="text-yellow-500">Inaktiv</span>
              )}
            </TableCell>
            <TableCell>
              {/* TODO: Add action buttons */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
