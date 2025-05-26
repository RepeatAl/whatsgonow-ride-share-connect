
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabaseClient';
import { Ban, Shield, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { EnhancedSuspendUserDialog } from './EnhancedSuspendUserDialog';
import { useSuspensionEnhanced } from '@/hooks/use-suspension-enhanced';

interface SuspendedUser {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_suspended: boolean;
  suspended_until: string | null;
  suspension_reason: string | null;
  role: string;
}

export const EnhancedSuspendedUsersTab = () => {
  const [suspendedUsers, setSuspendedUsers] = useState<SuspendedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<SuspendedUser | null>(null);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  
  const { unsuspendUser } = useSuspensionEnhanced();

  const fetchSuspendedUsers = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          user_id,
          first_name,
          last_name,
          email,
          is_suspended,
          suspended_until,
          suspension_reason,
          role
        `)
        .eq('is_suspended', true)
        .order('first_name');

      if (error) throw error;
      setSuspendedUsers(data || []);
    } catch (error) {
      console.error('Error fetching suspended users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuspendedUsers();
  }, []);

  const handleUnsuspend = async (user: SuspendedUser) => {
    const success = await unsuspendUser(user.user_id, 'Entsperrung durch Admin');
    if (success) {
      await fetchSuspendedUsers();
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p>Lade suspendierte Nutzer...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ban className="h-5 w-5 text-red-500" />
            Enhanced Suspendierte Nutzer
          </CardTitle>
          <CardDescription>
            Verwalte suspendierte Nutzerkonten mit erweiterten Audit-Funktionen
          </CardDescription>
        </CardHeader>
        <CardContent>
          {suspendedUsers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Keine suspendierten Nutzer gefunden.
            </p>
          ) : (
            <div className="space-y-4">
              {suspendedUsers.map((user) => (
                <div key={user.user_id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {user.first_name} {user.last_name}
                      </span>
                      <Badge variant="outline">{user.role}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    {user.suspension_reason && (
                      <p className="text-sm text-red-600 mt-1">
                        <strong>Grund:</strong> {user.suspension_reason}
                      </p>
                    )}
                    {user.suspended_until && (
                      <p className="text-sm text-orange-600">
                        <strong>Bis:</strong> {format(new Date(user.suspended_until), 'dd.MM.yyyy HH:mm', { locale: de })}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnsuspend(user)}
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      Entsperren
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedUser && (
        <EnhancedSuspendUserDialog
          userId={selectedUser.user_id}
          userName={`${selectedUser.first_name} ${selectedUser.last_name}`}
          isOpen={showSuspendDialog}
          onClose={() => {
            setShowSuspendDialog(false);
            setSelectedUser(null);
          }}
          onSuspended={() => {
            fetchSuspendedUsers();
          }}
        />
      )}
    </div>
  );
};

export default EnhancedSuspendedUsersTab;
