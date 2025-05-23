import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";

export interface AdminUser {
  user_id: string;
  name: string;
  email: string;
  role: string;
  region: string;
  active: boolean;
  banned_until?: string;
}

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Lade alle Nutzer aus der Tabelle "profiles"
  const fetchUsers = async (): Promise<void> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, name, email, role, region, active, banned_until');
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Fehler",
        description: "Nutzer konnten nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Nutzerrolle ändern
  const updateUserRole = async (userId: string, newRole: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', userId);
      if (error) throw error;

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.user_id === userId
            ? { ...user, role: newRole }
            : user
        )
      );
      toast({
        title: "Erfolg",
        description: "Nutzerrolle wurde aktualisiert.",
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Fehler",
        description: "Rolle konnte nicht geändert werden.",
        variant: "destructive"
      });
    }
  };

  // Nutzerkonto aktivieren/deaktivieren
  const toggleUserActive = async (userId: string, activeStatus: boolean): Promise<void> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ active: activeStatus })
        .eq('user_id', userId);
      if (error) throw error;

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.user_id === userId
            ? { ...user, active: activeStatus }
            : user
        )
      );
      toast({
        title: "Erfolg",
        description: activeStatus
          ? "Nutzerkonto aktiviert."
          : "Nutzerkonto deaktiviert.",
      });
    } catch (error) {
      console.error('Error toggling user active status:', error);
      toast({
        title: "Fehler",
        description: "Status konnte nicht geändert werden.",
        variant: "destructive"
      });
    }
  };

  // Nutzer löschen
  const deleteUser = async (userId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);
      if (error) throw error;

      setUsers(prevUsers => prevUsers.filter(user => user.user_id !== userId));
      toast({
        title: "Erfolg",
        description: "Nutzer wurde gelöscht.",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Fehler",
        description: "Nutzer konnte nicht gelöscht werden.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    fetchUsers,
    updateUserRole,
    toggleUserActive,
    deleteUser
  };
};
