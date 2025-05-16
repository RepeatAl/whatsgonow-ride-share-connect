
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
import FlagHistory from './FlagHistory';
import { useFlagHistory } from '@/hooks/use-flag-history';

interface FlagHistoryDialogProps {
  userId: string;
  userName?: string;
}

export const FlagHistoryDialog: React.FC<FlagHistoryDialogProps> = ({
  userId,
  userName
}) => {
  const { history, loading, error } = useFlagHistory(userId);
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1">
          <HistoryIcon className="h-4 w-4" />
          <span>Flagging-Verlauf anzeigen</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Flagging-Verlauf {userName ? `für ${userName}` : ''}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <FlagHistory history={history} loading={loading} error={error} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FlagHistoryDialog;
