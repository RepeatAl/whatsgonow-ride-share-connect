
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Shield } from 'lucide-react';
import { useSuspension } from '@/hooks/use-suspension';

interface ReactivateUserDialogProps {
  userId: string;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
  onReactivated: () => void;
}

export const ReactivateUserDialog = ({ userId, userName, isOpen, onClose, onReactivated }: ReactivateUserDialogProps) => {
  const [notes, setNotes] = useState('');
  const { reactivateUser, loading } = useSuspension();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await reactivateUser(userId, notes);
    
    if (success) {
      onReactivated();
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            Nutzer reaktivieren
          </DialogTitle>
          <DialogDescription>
            Sie sind dabei, den Nutzer <span className="font-medium">{userName}</span> zu reaktivieren. 
            Der Nutzer erhält damit wieder vollen Zugriff auf die Plattform.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="notes">Anmerkungen zur Reaktivierung</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optionale Anmerkungen zur Reaktivierung des Nutzers"
              className="min-h-[100px]"
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={loading}
            >
              {loading ? "Wird reaktiviert..." : "Nutzer reaktivieren"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReactivateUserDialog;
