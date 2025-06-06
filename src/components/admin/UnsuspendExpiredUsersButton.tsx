
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';
import { RefreshCcw } from 'lucide-react';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';

interface UnsuspendExpiredUsersButtonProps {
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

const UnsuspendExpiredUsersButton: React.FC<UnsuspendExpiredUsersButtonProps> = ({
  className = '',
  variant = 'outline'
}) => {
  const [loading, setLoading] = useState(false);
  const { profile } = useOptimizedAuth();
  
  // Prüfen, ob der Nutzer Admin-Berechtigungen hat
  const canRunFunction = profile?.role && ['admin', 'super_admin'].includes(profile.role);
  
  if (!canRunFunction) return null;

  const handleRunFunction = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('unsuspend-expired-users');
      
      if (error) throw error;
      
      toast({
        title: 'Abgelaufene Sperren aufgehoben',
        description: `${data.affected_users} Nutzerkonten wurden automatisch entsperrt.`,
      });
      
    } catch (err) {
      console.error('Fehler beim Aufheben abgelaufener Sperren:', err);
      toast({
        title: 'Fehler',
        description: 'Die abgelaufenen Sperren konnten nicht aufgehoben werden.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Button
      onClick={handleRunFunction}
      disabled={loading}
      className={className}
      variant={variant}
      size="sm"
    >
      <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : 'mr-2'}`} />
      {!loading ? 'Abgelaufene Sperren aufheben' : 'Wird ausgeführt...'}
    </Button>
  );
};

export default UnsuspendExpiredUsersButton;
