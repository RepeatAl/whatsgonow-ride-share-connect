
import React, { useState } from 'react';
import { useUserFlagging } from '@/hooks/use-user-flagging';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Loader2, Flag } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface UserFlaggingProps {
  userId: string;
  isFlagged: boolean;
  flagReason?: string;
  onFlagChange?: () => void;
}

export const UserFlaggingControls: React.FC<UserFlaggingProps> = ({
  userId,
  isFlagged,
  flagReason = '',
  onFlagChange
}) => {
  const { flagUser, unflagUser, loading, canFlag } = useUserFlagging();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reason, setReason] = useState(flagReason || '');
  
  if (!canFlag) return null;
  
  const handleFlaggingChange = async (checked: boolean) => {
    if (checked) {
      // Open dialog to input reason
      setIsDialogOpen(true);
    } else {
      // Unflag directly
      const success = await unflagUser(userId);
      if (success && onFlagChange) {
        onFlagChange();
      }
    }
  };
  
  const handleSubmitFlag = async () => {
    if (!reason.trim()) {
      toast({
        title: "Begründung fehlt",
        description: "Bitte geben Sie eine Begründung für die Markierung an",
        variant: "destructive"
      });
      return;
    }
    
    const success = await flagUser(userId, { reason });
    if (success) {
      setIsDialogOpen(false);
      if (onFlagChange) {
        onFlagChange();
      }
    }
  };
  
  return (
    <>
      <div className="flex items-center gap-2">
        <Switch 
          checked={isFlagged} 
          disabled={loading}
          onCheckedChange={handleFlaggingChange} 
        />
        <div className="flex items-center">
          <Label htmlFor="flag-user" className="cursor-pointer">
            {isFlagged ? (
              <span className="text-red-500 flex items-center gap-1">
                <Flag className="h-4 w-4" /> Markiert
              </span>
            ) : (
              <span className="text-muted-foreground">
                Als kritisch markieren
              </span>
            )}
          </Label>
          {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nutzer als kritisch markieren</DialogTitle>
            <DialogDescription>
              Geben Sie eine Begründung für die Markierung an. Diese Information ist nur für Community Manager und Administratoren sichtbar.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="flag-reason">Begründung</Label>
            <Textarea 
              id="flag-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="z.B. Mehrfache Beschwerden, Verdacht auf Betrug, etc."
              className="mt-2"
              rows={4}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Abbrechen</Button>
            <Button 
              onClick={handleSubmitFlag} 
              disabled={loading || !reason.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird verarbeitet...
                </>
              ) : (
                <>Nutzer markieren</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserFlaggingControls;
