
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Ban, Clock, CheckCircle2 } from 'lucide-react';
import { useSuspension } from '@/hooks/use-suspension';
import type { UserSuspension } from '@/types/suspension';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SuspensionHistoryDialogProps {
  userId: string;
  userName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SuspensionHistoryDialog: React.FC<SuspensionHistoryDialogProps> = ({
  userId,
  userName,
  open,
  onOpenChange
}) => {
  const [suspensionHistory, setSuspensionHistory] = useState<UserSuspension[]>([]);
  const { fetchUserSuspensionHistory, loading } = useSuspension();

  useEffect(() => {
    if (open && userId) {
      loadSuspensionHistory();
    }
  }, [open, userId]);

  const loadSuspensionHistory = async () => {
    const history = await fetchUserSuspensionHistory(userId);
    setSuspensionHistory(history);
  };

  const getSuspensionTypeLabel = (type: string) => {
    switch (type) {
      case 'hard': return 'Hart';
      case 'soft': return 'Soft';
      case 'temporary': return 'Temporär';
      default: return type;
    }
  };

  const getSuspensionTypeBadge = (type: string) => {
    switch (type) {
      case 'hard':
        return <Badge variant="destructive">Hart</Badge>;
      case 'soft':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Soft</Badge>;
      case 'temporary':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Temporär</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'dd.MM.yyyy HH:mm', { locale: de });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ban className="h-5 w-5 text-gray-500" />
            Suspendierungsverlauf
          </DialogTitle>
          <DialogDescription>
            Suspendierungsverlauf für Nutzer <span className="font-medium">{userName}</span>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="history">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history">Vollständiger Verlauf</TabsTrigger>
            <TabsTrigger value="active">Aktive Suspendierung</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="pt-4">
            {loading ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Lade Verlauf...</p>
              </div>
            ) : suspensionHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Keine Suspendierungen gefunden.
              </div>
            ) : (
              <ScrollArea className="h-[350px] pr-4">
                <div className="space-y-4">
                  {suspensionHistory.map((suspension) => (
                    <div key={suspension.id} className="border rounded-md p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Ban className="h-4 w-4 text-red-500" />
                          <span className="font-medium">
                            {formatDate(suspension.suspended_at)}
                          </span>
                        </div>
                        {getSuspensionTypeBadge(suspension.suspension_type)}
                      </div>
                      <p className="text-sm mb-2">{suspension.reason}</p>
                      
                      <div className="text-xs text-muted-foreground mb-1">
                        <span className="font-medium">Dauer:</span> {suspension.duration || 'Permanent'}
                      </div>
                      
                      {suspension.unblocked_at && (
                        <>
                          <Separator className="my-2" />
                          <div className="flex items-center gap-2 text-green-600 text-sm">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Reaktiviert am {formatDate(suspension.unblocked_at)}</span>
                          </div>
                          {suspension.notes && (
                            <p className="text-xs mt-1">{suspension.notes}</p>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
          
          <TabsContent value="active" className="pt-4">
            {loading ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Lade Daten...</p>
              </div>
            ) : (
              <>
                {suspensionHistory.some(s => !s.unblocked_at) ? (
                  suspensionHistory.filter(s => !s.unblocked_at).map(suspension => (
                    <div key={suspension.id} className="border-l-4 border-l-red-500 pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Aktive Suspendierung</span>
                        {getSuspensionTypeBadge(suspension.suspension_type)}
                      </div>
                      
                      <p className="text-sm mb-3">{suspension.reason}</p>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          Seit: {formatDate(suspension.suspended_at)}
                          {suspension.duration ? ` (${suspension.duration})` : ' (Permanent)'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Keine aktive Suspendierung.
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SuspensionHistoryDialog;
