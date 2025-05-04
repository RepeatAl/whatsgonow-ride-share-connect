
import { useState } from 'react';
import { supabase } from "@/lib/supabaseClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { UserRole } from "@/types/auth";
import { Loader2 } from "lucide-react";

// This component follows the conventions from /docs/conventions/roles_and_ids.md
interface RoleManagerProps {
  userId: string;
  currentRole: string;
  onRoleChanged: () => void;
  userEmail: string;
}

export function RoleManager({ userId, currentRole, onRoleChanged, userEmail }: RoleManagerProps) {
  const [selectedRole, setSelectedRole] = useState<string>(currentRole);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const availableRoles: UserRole[] = [
    "sender_private",
    "sender_business", 
    "driver", 
    "cm", 
    "admin", 
    "super_admin"
  ];

  const handleRoleChange = async () => {
    if (selectedRole === currentRole) {
      setIsConfirmOpen(false);
      return;
    }
    
    setIsLoading(true);
    try {
      // Call the assign_role function
      const { data, error } = await supabase.rpc('assign_role', {
        target_user_id: userId,
        new_role: selectedRole
      });
      
      if (error) throw error;
      
      toast({
        title: "Rolle geändert",
        description: `Benutzer ${userEmail} ist jetzt ${selectedRole}`,
      });
      
      onRoleChanged();
    } catch (error) {
      console.error("Error changing role:", error);
      toast({
        title: "Fehler",
        description: `Konnte Rolle nicht ändern: ${(error as Error).message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsConfirmOpen(false);
    }
  };
  
  const roleChanged = selectedRole !== currentRole;
  
  return (
    <>
      <div className="flex items-center gap-2">
        <Select
          value={selectedRole}
          onValueChange={setSelectedRole}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={currentRole} />
          </SelectTrigger>
          <SelectContent>
            {availableRoles.map(role => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          size="sm" 
          variant={roleChanged ? "default" : "ghost"}
          onClick={() => setIsConfirmOpen(true)}
          disabled={!roleChanged || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Speichern...
            </>
          ) : (
            'Speichern'
          )}
        </Button>
      </div>
      
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rolle ändern</AlertDialogTitle>
            <AlertDialogDescription>
              Möchtest du die Rolle von <strong>{userEmail}</strong> wirklich von <strong>{currentRole}</strong> zu <strong>{selectedRole}</strong> ändern?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleRoleChange}>Bestätigen</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
