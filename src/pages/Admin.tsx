
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/lib/supabaseClient";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { useAdminUsers } from "@/hooks/use-admin-users";
import RoleBadge from "@/components/community-manager/RoleBadge";
import { 
  ChevronDown, 
  Trash2, 
  User as UserIcon 
} from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const { 
    users, 
    loading, 
    updateUserRole, 
    toggleUserActive, 
    deleteUser 
  } = useAdminUsers();
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const handleDeleteConfirm = () => {
    if (deletingUserId) {
      deleteUser(deletingUserId);
      setDeletingUserId(null);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <UserIcon className="h-8 w-8" />
        Nutzerverwaltung
      </h1>

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
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Laden...
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.user_id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <RoleBadge role={user.role} />
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Rolle ändern</DropdownMenuLabel>
                      {['admin', 'driver', 'sender', 'cm'].map((role) => (
                        <DropdownMenuItem 
                          key={role} 
                          onSelect={() => updateUserRole(user.user_id, role)}
                        >
                          {role}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell>{user.region}</TableCell>
                <TableCell>
                  <Switch 
                    checked={user.active}
                    onCheckedChange={(checked) => 
                      toggleUserActive(user.user_id, checked)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => setDeletingUserId(user.user_id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {deletingUserId && (
        <AlertDialog 
          open={!!deletingUserId} 
          onOpenChange={() => setDeletingUserId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Nutzer wirklich löschen?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Diese Aktion kann nicht rückgängig gemacht werden.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                Abbrechen
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Löschen
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default Admin;
