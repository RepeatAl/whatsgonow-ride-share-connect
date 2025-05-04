
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { useAdminUsers } from "@/hooks/use-admin-users";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { RoleChangeLogViewer } from "@/components/admin/RoleChangeLogViewer";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Trash2, 
  User as UserIcon,
  ClipboardCheck,
  RefreshCw
} from "lucide-react";
import { Link } from "react-router-dom";

// This component follows the conventions from /docs/conventions/roles_and_ids.md
const Admin = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { 
    users, 
    loading,
    fetchUsers,
    updateUserRole, 
    toggleUserActive, 
    deleteUser 
  } = useAdminUsers();
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const isSuperAdmin = profile?.role === 'super_admin';

  const handleDeleteConfirm = () => {
    if (deletingUserId) {
      deleteUser(deletingUserId);
      setDeletingUserId(null);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <UserIcon className="h-8 w-8" />
          {isSuperAdmin ? 'Super-Admin Dashboard' : 'Admin Dashboard'}
        </h1>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={fetchUsers}
          >
            <RefreshCw className="h-4 w-4" />
            Aktualisieren
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            asChild
          >
            <Link to="/admin/validation">
              <ClipboardCheck className="h-4 w-4" />
              Validierungs-Dashboard
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <UsersTable
          users={users}
          isLoading={loading}
          onToggleActive={toggleUserActive}
          onDeleteUser={setDeletingUserId}
          onUserUpdated={fetchUsers}
        />
      </div>

      {/* Show role change logs only to super admins */}
      {isSuperAdmin && (
        <div className="mt-12">
          <RoleChangeLogViewer />
        </div>
      )}

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
