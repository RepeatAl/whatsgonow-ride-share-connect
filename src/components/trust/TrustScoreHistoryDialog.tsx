
import React from 'react';
import { HistoryIcon } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TrustScoreHistory } from './TrustScoreHistory';

interface TrustScoreHistoryDialogProps {
  userId: string;
  userName?: string;
}

export const TrustScoreHistoryDialog: React.FC<TrustScoreHistoryDialogProps> = ({
  userId,
  userName
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1">
          <HistoryIcon className="h-4 w-4" />
          <span>Vertrauensverlauf</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Vertrauensverlauf {userName ? `für ${userName}` : ''}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <TrustScoreHistory userId={userId} limit={15} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
