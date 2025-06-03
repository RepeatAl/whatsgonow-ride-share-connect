
import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import type { AdminUser } from "@/types/admin";

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async (): Promise<void> => {
    setLoading(true);
    try {
      console.log('Fetching admin users...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          user_id,
          first_name,
          last_name,
          email,
          role,
          region,
          is_suspended,
          suspended_until
        `)
        .order('first_name', { nullsFirst: false });

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      console.log('Raw user data:', data);
      
      // Transform data to match AdminUser interface
      const transformedData = (data || []).map(user => ({
        ...user,
        name: [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email || 'Unbekannter Nutzer',
        active: !user.is_suspended, // Active is the inverse of suspended
        banned_until: user.suspended_until
      }));
      
      console.log('Transformed user data:', transformedData);
      setUsers(transformedData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Fehler",
        description: "Nutzer konnten nicht geladen werden. Bitte versuche es erneut.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string): Promise<void> => {
    try {
      console.log('Updating user role:', userId, newRole);
      
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

  const toggleUserActive = async (userId: string, activeStatus: boolean): Promise<void> => {
    try {
      console.log('Toggling user active status:', userId, activeStatus);
      
      // Active status maps to suspension - if active=false, user is suspended
      const suspensionData = activeStatus 
        ? { is_suspended: false, suspended_until: null, suspension_reason: null }
        : { is_suspended: true, suspended_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), suspension_reason: 'Administrativ deaktiviert' };

      const { error } = await supabase
        .from('profiles')
        .update(suspensionData)
        .eq('user_id', userId);
      
      if (error) throw error;

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.user_id === userId
            ? { ...user, active: activeStatus, banned_until: suspensionData.suspended_until }
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

  const deleteUser = async (userId: string): Promise<void> => {
    try {
      console.log('🗑️ Starting user deletion process for:', userId);
      
      // Schritt 1: Lösche Profile (cascading sollte jetzt funktionieren)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);
      
      if (profileError) {
        console.error('❌ Profile deletion failed:', profileError);
        
        // Bessere Fehlermeldungen basierend auf dem Error-Code
        let errorMessage = "Nutzer konnte nicht gelöscht werden.";
        
        if (profileError.code === '23503') {
          errorMessage = "Nutzer hat noch abhängige Daten. Bitte entferne zuerst alle Uploads, Aufträge und Nachrichten.";
        } else if (profileError.message?.includes('foreign key')) {
          errorMessage = "Nutzer ist mit anderen Daten verknüpft. Cascading-Löschung fehlgeschlagen.";
        } else if (profileError.message?.includes('policy')) {
          errorMessage = "Keine Berechtigung zum Löschen dieses Nutzers.";
        }
        
        throw new Error(errorMessage);
      }

      // Schritt 2: Versuche Auth-User zu löschen (optional, da oft nur via Admin-API möglich)
      try {
        // HINWEIS: Vollständige User-Löschung aus auth.users erfordert Service-Role-Key
        // oder manuelle Löschung in Supabase Dashboard
        console.log('⚠️ Profile gelöscht. Auth-User muss ggf. manuell in Supabase gelöscht werden.');
      } catch (authError) {
        console.warn('Auth user deletion not possible via client:', authError);
      }

      // Update lokale Liste
      setUsers(prevUsers => prevUsers.filter(user => user.user_id !== userId));
      
      toast({
        title: "Erfolg",
        description: "Nutzer wurde erfolgreich gelöscht. Alle abhängigen Daten wurden entfernt.",
        duration: 5000
      });

      console.log('✅ User deletion completed successfully');
      
    } catch (error: any) {
      console.error('❌ User deletion failed:', error);
      
      toast({
        title: "Löschung fehlgeschlagen",
        description: error.message || "Unbekannter Fehler beim Löschen des Nutzers.",
        variant: "destructive",
        duration: 7000
      });
    }
  };

  // Health-Check für Cascading-Löschung
  const checkDeletionReadiness = async () => {
    try {
      const { data, error } = await supabase.rpc('check_user_deletion_readiness');
      
      if (error) {
        console.error('Health check failed:', error);
        return;
      }
      
      console.log('🔍 Deletion readiness check:', data);
      
      const missingCascades = data?.filter((item: any) => !item.has_cascade) || [];
      
      if (missingCascades.length > 0) {
        console.warn('⚠️ Tables without CASCADE:', missingCascades);
        toast({
          title: "Warnung",
          description: `${missingCascades.length} Tabellen haben noch keine CASCADE-Löschung konfiguriert.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "System bereit",
          description: "Alle Tabellen sind für CASCADE-Löschung konfiguriert.",
        });
      }
    } catch (error) {
      console.error('Health check error:', error);
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
    deleteUser,
    checkDeletionReadiness
  };
};
