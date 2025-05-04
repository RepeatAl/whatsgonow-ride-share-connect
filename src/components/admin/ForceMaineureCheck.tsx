
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ForceMajeureCheckProps {
  orderId: string;
  adminId: string;
  onComplete: (success: boolean) => void;
  handleForceMajeure: (
    orderId: string,
    adminId: string,
    refundAmount?: number,
    reason?: string
  ) => Promise<{ success: boolean; error?: string }>;
}

export function ForceMajeureCheck({ 
  orderId, 
  adminId, 
  onComplete,
  handleForceMajeure
}: ForceMajeureCheckProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [reason, setReason] = useState('');
  const [refundAmount, setRefundAmount] = useState<number | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!isEnabled) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await handleForceMajeure(
        orderId,
        adminId,
        refundAmount,
        reason
      );
      
      if (result.success) {
        toast({
          title: 'Force Majeure aktiviert',
          description: 'Der Auftrag wurde erfolgreich durch Force Majeure storniert.',
        });
        onComplete(true);
      } else {
        toast({
          title: 'Fehler',
          description: `Fehler beim Aktivieren von Force Majeure: ${result.error}`,
          variant: 'destructive'
        });
        onComplete(false);
      }
    } catch (error) {
      toast({
        title: 'Fehler',
        description: `Unerwarteter Fehler: ${(error as Error).message}`,
        variant: 'destructive'
      });
      onComplete(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border p-4 rounded-md space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="force-majeure"
          checked={isEnabled}
          onCheckedChange={(checked) => setIsEnabled(checked === true)}
        />
        <label
          htmlFor="force-majeure"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Kulanz-Storno anwenden (Force Majeure)
        </label>
      </div>
      
      {isEnabled && (
        <div className="space-y-4 pl-6">
          <div>
            <label htmlFor="reason" className="text-sm font-medium">
              Grund
            </label>
            <Textarea
              id="reason"
              placeholder="Geben Sie einen Grund für das Force Majeure an"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <label htmlFor="refund" className="text-sm font-medium">
              Rückerstattungsbetrag (optional)
            </label>
            <Input
              id="refund"
              type="number"
              placeholder="0.00"
              value={refundAmount === undefined ? '' : refundAmount}
              onChange={(e) => setRefundAmount(e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Lassen Sie dieses Feld leer, wenn keine Rückerstattung erfolgen soll.
            </p>
          </div>
          
          <Button 
            variant="destructive" 
            onClick={handleSubmit} 
            disabled={!reason || isSubmitting}
          >
            {isSubmitting ? 'Wird ausgeführt...' : 'Force Majeure aktivieren'}
          </Button>
        </div>
      )}
    </div>
  );
}

export default ForceMajeureCheck;
