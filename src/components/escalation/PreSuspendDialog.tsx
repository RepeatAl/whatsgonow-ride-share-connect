
import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useEscalation } from '@/hooks/use-escalation';

interface PreSuspendDialogProps {
  userId: string;
  userName?: string;
  onEscalated?: () => void;
}

export const PreSuspendDialog: React.FC<PreSuspendDialogProps> = ({
  userId,
  userName,
  onEscalated
}) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const { preSuspendUser, loading, canPreSuspend } = useEscalation();
  
  const handlePreSuspend = async () => {
    const success = await preSuspendUser(userId, reason);
    if (success) {
      setOpen(false);
      setReason('');
      if (onEscalated) onEscalated();
    }
  };
  
  if (!canPreSuspend) return null;
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive" className="gap-1">
          <AlertTriangle className="h-4 w-4" />
          <span>Konto eskalieren</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Nutzer eskalieren {userName ? `(${userName})` : ''}
          </DialogTitle>
          <DialogDescription>
            Durch die Eskalation wird dieser Nutzer zur Prüfung durch einen Administrator markiert. 
            Das Konto kann vorübergehend eingeschränkt sein, bis eine Entscheidung getroffen wird.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-2">
            <label htmlFor="reason" className="block text-sm font-medium">
              Begründung für die Eskalation
            </label>
            <Textarea
              id="reason"
              placeholder="Bitte geben Sie den Grund für die Eskalation an"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-32"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Abbrechen
          </Button>
          <Button 
            variant="destructive" 
            onClick={handlePreSuspend}
            disabled={!reason.trim() || loading}
          >
            {loading ? 'Wird bearbeitet...' : 'Nutzer eskalieren'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreSuspendDialog;
