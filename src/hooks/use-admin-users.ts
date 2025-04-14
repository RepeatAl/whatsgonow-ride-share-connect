
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
}

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('user_id, name, email, role, region, active');

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

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.user_id === userId 
          ? { ...user, role: newRole } 
          : user
      ));

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

  const toggleUserActive = async (userId: string, activeStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ active: activeStatus })
        .eq('user_id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.user_id === userId 
          ? { ...user, active: activeStatus } 
          : user
      ));

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

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      setUsers(users.filter(user => user.user_id !== userId));

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
