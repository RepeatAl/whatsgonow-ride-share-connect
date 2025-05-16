
import React, { useState } from 'react';
import { HistoryIcon, AlertTriangle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TrustScoreHistory } from './TrustScoreHistory';
import { useTrustScoreHistory } from '@/hooks/use-trust-score-history';
import { useTrustScore } from '@/hooks/use-trust-score';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TrustScoreHistoryDialogProps {
  userId: string;
  userName?: string;
}

export const TrustScoreHistoryDialog: React.FC<TrustScoreHistoryDialogProps> = ({
  userId,
  userName
}) => {
  const { score } = useTrustScore(userId);
  const { isTrendingDown, hasRecentDrop } = useTrustScoreHistory(userId, 15);
  const [checkedByManager, setCheckedByManager] = useState(false);
  
  // Determine if an alert should be shown
  const shouldShowAlert = score !== null && score < 60 && (isTrendingDown || hasRecentDrop);
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1">
          <HistoryIcon className="h-4 w-4" />
          <span>Vertrauensverlauf</span>
          {shouldShowAlert && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="ml-1">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-64">Drastischer Vertrauensverlust – bitte prüfen Sie Bewertungen und Konflikte.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Vertrauensverlauf {userName ? `für ${userName}` : ''}
            {shouldShowAlert && (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <TrustScoreHistory userId={userId} limit={15} />
        </div>
        
        {shouldShowAlert && (
          <Alert className="mt-4 border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700">
              Dieser Nutzer zeigt Anzeichen eines kritischen Vertrauensverfalls. Eine manuelle Überprüfung wird empfohlen.
            </AlertDescription>
          </Alert>
        )}
        
        {shouldShowAlert && (
          <DialogFooter className="mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="checked" 
                checked={checkedByManager} 
                onCheckedChange={(checked) => setCheckedByManager(checked as boolean)}
              />
              <label
                htmlFor="checked"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Als geprüft markieren
              </label>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
