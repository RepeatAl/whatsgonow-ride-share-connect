
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';

interface RoleManagerProps {
  userId: string;
  currentRole: string;
  userEmail: string;
  onRoleChanged: () => void;
}

const AVAILABLE_ROLES = [
  { value: 'super_admin', label: 'Super Admin', color: 'destructive' },
  { value: 'admin', label: 'Admin', color: 'default' },
  { value: 'cm', label: 'Community Manager', color: 'secondary' },
  { value: 'sender_private', label: 'Sender (Privat)', color: 'outline' },
  { value: 'sender_business', label: 'Sender (Business)', color: 'outline' },
  { value: 'driver', label: 'Driver', color: 'outline' }
] as const;

export const RoleManager: React.FC<RoleManagerProps> = ({
  userId,
  currentRole,
  userEmail,
  onRoleChanged
}) => {
  const [isChanging, setIsChanging] = useState(false);

  const changeRole = async (newRole: string) => {
    if (newRole === currentRole) return;
    
    setIsChanging(true);
    try {
      // Use the assign_role function for secure role changes
      const { data, error } = await supabase.rpc('assign_role', {
        target_user_id: userId,
        new_role: newRole
      });

      if (error) throw error;

      toast({
        title: "Rolle geändert",
        description: `${userEmail} ist jetzt ${newRole}`,
      });
      
      onRoleChanged();
    } catch (error) {
      console.error('Error changing role:', error);
      toast({
        title: "Fehler",
        description: "Rolle konnte nicht geändert werden.",
        variant: "destructive"
      });
    } finally {
      setIsChanging(false);
    }
  };

  const currentRoleInfo = AVAILABLE_ROLES.find(role => role.value === currentRole);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isChanging}>
          <Badge variant={currentRoleInfo?.color || 'outline'} className="mr-2">
            {currentRoleInfo?.label || currentRole}
          </Badge>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {AVAILABLE_ROLES.map((role) => (
          <DropdownMenuItem
            key={role.value}
            onClick={() => changeRole(role.value)}
            disabled={role.value === currentRole || isChanging}
          >
            <Badge variant={role.color} className="mr-2">
              {role.label}
            </Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
