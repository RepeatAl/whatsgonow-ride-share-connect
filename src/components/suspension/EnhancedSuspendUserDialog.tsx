
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Ban, Calendar } from 'lucide-react';
import { useSuspensionEnhanced } from '@/hooks/use-suspension-enhanced';
import { type SuspensionReasonCode, type SuspensionType } from '@/types/suspension';

interface EnhancedSuspendUserDialogProps {
  userId: string;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuspended: () => void;
}

export const EnhancedSuspendUserDialog = ({ 
  userId, 
  userName, 
  isOpen, 
  onClose, 
  onSuspended 
}: EnhancedSuspendUserDialogProps) => {
  const [reason, setReason] = useState('');
  const [reasonCode, setReasonCode] = useState<SuspensionReasonCode>('OTHER');
  const [suspensionType, setSuspensionType] = useState<SuspensionType>('temporary');
  const [duration, setDuration] = useState('7 days');
  const [auditNotes, setAuditNotes] = useState('');
  
  const { suspendUser, loading } = useSuspensionEnhanced();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await suspendUser({
      user_id: userId,
      reason,
      reasonCode: reasonCode,
      suspension_type: suspensionType,
      duration: suspensionType === 'permanent' ? null : duration,
      auditNotes: auditNotes
    });
    
    if (success) {
      onSuspended();
      onClose();
      // Reset form
      setReason('');
      setReasonCode('OTHER');
      setSuspensionType('temporary');
      setDuration('7 days');
      setAuditNotes('');
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ban className="h-5 w-5 text-red-500" />
            Nutzer suspendieren
          </DialogTitle>
          <DialogDescription>
            Sie sind dabei, den Nutzer <span className="font-medium">{userName}</span> zu suspendieren. 
            Diese Aktion wird im Audit-Log protokolliert.
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
            <Label htmlFor="reason">Detaillierte Begründung</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Beschreiben Sie den Grund für die Suspendierung"
              required
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="suspensionType">Art der Suspendierung</Label>
            <Select value={suspensionType} onValueChange={(value) => setSuspensionType(value as SuspensionType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="temporary">Temporär</SelectItem>
                <SelectItem value="permanent">Permanent</SelectItem>
                <SelectItem value="soft">Soft (Warnung)</SelectItem>
                <SelectItem value="hard">Hart (Vollsperre)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {suspensionType !== 'permanent' && (
            <div className="space-y-2">
              <Label htmlFor="duration" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Dauer
              </Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 hour">1 Stunde</SelectItem>
                  <SelectItem value="24 hours">24 Stunden</SelectItem>
                  <SelectItem value="3 days">3 Tage</SelectItem>
                  <SelectItem value="7 days">7 Tage</SelectItem>
                  <SelectItem value="30 days">30 Tage</SelectItem>
                  <SelectItem value="90 days">90 Tage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="auditNotes">Audit-Notizen (optional)</Label>
            <Textarea
              id="auditNotes"
              value={auditNotes}
              onChange={(e) => setAuditNotes(e.target.value)}
              placeholder="Zusätzliche Informationen für das Audit-Log"
              className="min-h-[60px]"
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
              disabled={loading || !reason.trim()}
            >
              {loading ? "Wird suspendiert..." : "Nutzer suspendieren"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedSuspendUserDialog;
