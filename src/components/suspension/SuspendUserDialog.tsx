
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle } from 'lucide-react';
import { useSuspension } from '@/hooks/use-suspension';
import type { SuspensionType, SuspensionReasonCode } from '@/types/suspension';

interface SuspendUserDialogProps {
  userId: string;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuspended: () => void;
}

export const SuspendUserDialog = ({ userId, userName, isOpen, onClose, onSuspended }: SuspendUserDialogProps) => {
  const [reason, setReason] = useState('');
  const [reasonCode, setReasonCode] = useState<SuspensionReasonCode>('OTHER');
  const [duration, setDuration] = useState<string | null>(null);
  const [durationType, setDurationType] = useState('days');
  const [durationValue, setDurationValue] = useState('');
  const [suspensionType, setSuspensionType] = useState<SuspensionType>('hard');
  
  const { suspendUser, loading } = useSuspension();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate duration string if duration is set
    let durationString = null;
    if (durationValue && parseInt(durationValue) > 0) {
      durationString = `${durationValue} ${durationType}`;
    }
    
    const success = await suspendUser({
      user_id: userId,
      reason,
      reasonCode,
      suspension_type: suspensionType,
      duration: durationString
    });
    
    if (success) {
      onSuspended();
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Nutzer suspendieren
          </DialogTitle>
          <DialogDescription>
            Sie sind dabei, den Nutzer <span className="font-medium">{userName}</span> zu suspendieren. 
            Diese Aktion wird den Zugriff des Nutzers auf die Plattform einschränken.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="reasonCode">Grund (Kategorie)</Label>
            <Select value={reasonCode} onValueChange={(value) => setReasonCode(value as SuspensionReasonCode)}>
              <SelectTrigger>
                <SelectValue placeholder="Grund auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SPAM">Spam</SelectItem>
                <SelectItem value="ABUSE">Missbrauch</SelectItem>
                <SelectItem value="FRAUD">Betrug</SelectItem>
                <SelectItem value="TOS_VIOLATION">AGB-Verstoß</SelectItem>
                <SelectItem value="TRUST_SCORE_LOW">Niedriger Trust Score</SelectItem>
                <SelectItem value="MULTIPLE_FLAGS">Mehrfache Meldungen</SelectItem>
                <SelectItem value="MANUAL_REVIEW">Manuelle Prüfung</SelectItem>
                <SelectItem value="OTHER">Sonstiges</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="suspensionType">Suspendierungstyp</Label>
            <Select
              required
              value={suspensionType}
              onValueChange={(value) => setSuspensionType(value as SuspensionType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wählen Sie einen Typ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hard">Hart (vollständige Blockierung)</SelectItem>
                <SelectItem value="temporary">Temporär (zeitlich begrenzt)</SelectItem>
                <SelectItem value="soft">Soft (eingeschränkter Zugriff)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Dauer</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="durationValue"
                type="number"
                min="0"
                placeholder="Dauer"
                value={durationValue}
                onChange={(e) => setDurationValue(e.target.value)}
                className="w-24"
              />
              <Select
                value={durationType}
                onValueChange={setDurationType}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Zeiteinheit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hours">Stunden</SelectItem>
                  <SelectItem value="days">Tage</SelectItem>
                  <SelectItem value="weeks">Wochen</SelectItem>
                  <SelectItem value="months">Monate</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">
                Leer lassen für permanente Sperrung
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-red-500">Grund (verpflichtend)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Geben Sie den Grund für die Suspendierung an"
              required
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
              variant="destructive"
              disabled={loading || !reason}
            >
              {loading ? "Wird suspendiert..." : "Nutzer suspendieren"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SuspendUserDialog;
