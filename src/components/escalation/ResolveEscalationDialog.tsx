
import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
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

interface ResolveEscalationDialogProps {
  escalationId: string;
  onResolved?: () => void;
}

export const ResolveEscalationDialog: React.FC<ResolveEscalationDialogProps> = ({
  escalationId,
  onResolved
}) => {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const { resolveEscalation, loading } = useEscalation();
  
  const handleResolve = async () => {
    const success = await resolveEscalation(escalationId, notes);
    if (success) {
      setOpen(false);
      setNotes('');
      if (onResolved) onResolved();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="gap-1">
          <CheckCircle className="h-4 w-4" />
          <span>Lösen</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Eskalation auflösen</DialogTitle>
          <DialogDescription>
            Fügen Sie Notizen zur Auflösung dieser Eskalation hinzu. 
            Wenn keine anderen aktiven Eskalationen für diesen Benutzer vorhanden sind, 
            wird sein Pre-Suspend-Status aufgehoben.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-2">
            <label htmlFor="notes" className="block text-sm font-medium">
              Notizen zur Auflösung
            </label>
            <Textarea
              id="notes"
              placeholder="Beschreiben Sie, wie diese Eskalation bearbeitet wurde"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-32"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Abbrechen
          </Button>
          <Button 
            variant="default" 
            onClick={handleResolve}
            disabled={!notes.trim() || loading}
          >
            {loading ? 'Wird bearbeitet...' : 'Eskalation auflösen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResolveEscalationDialog;
