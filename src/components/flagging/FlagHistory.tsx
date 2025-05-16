
import React from 'react';
import { format } from 'date-fns';
import { Flag, CheckCircle } from 'lucide-react';
import { FlagHistoryEntry } from '@/hooks/use-flag-history';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

interface FlagHistoryProps {
  history: FlagHistoryEntry[];
  loading: boolean;
  error: Error | null;
}

export const FlagHistory: React.FC<FlagHistoryProps> = ({
  history,
  loading,
  error
}) => {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-amber-300 p-4">
        <p className="text-sm text-amber-600">
          Fehler beim Laden der Flagging-Historie: {error.message}
        </p>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          Keine Flagging-Historieneinträge gefunden.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {history.map((entry) => (
        <FlagHistoryItem key={entry.id} entry={entry} />
      ))}
    </div>
  );
};

interface FlagHistoryItemProps {
  entry: FlagHistoryEntry;
}

const FlagHistoryItem: React.FC<FlagHistoryItemProps> = ({ entry }) => {
  const formatTimestamp = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
    } catch (e) {
      return 'Ungültiges Datum';
    }
  };

  return (
    <Card className={`p-3 ${entry.flagged ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-green-500'}`}>
      <div className="grid grid-cols-12 gap-2 text-sm">
        <div className="col-span-2 text-muted-foreground">
          {formatTimestamp(entry.created_at)}
        </div>
        <div className="col-span-2 flex items-center">
          {entry.flagged ? (
            <span className="text-red-500 flex items-center gap-1">
              <Flag className="h-4 w-4" /> Markiert
            </span>
          ) : (
            <span className="text-green-600 flex items-center gap-1">
              <CheckCircle className="h-4 w-4" /> Entmarkiert
            </span>
          )}
        </div>
        <div className="col-span-4">
          {entry.flagged && entry.reason ? (
            <span className="text-muted-foreground">{entry.reason}</span>
          ) : (
            <span className="text-muted-foreground italic">Keine Begründung</span>
          )}
        </div>
        <div className="col-span-4 text-right">
          <span className="font-medium">{entry.actor_name}</span>
          <span className="text-muted-foreground ml-1">({entry.role})</span>
        </div>
      </div>
    </Card>
  );
};

export default FlagHistory;
