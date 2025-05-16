
import React from 'react';
import { format } from 'date-fns';
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from 'lucide-react';
import { useTrustScoreHistory } from '@/hooks/use-trust-score-history';
import { TrustScoreAuditEntry } from '@/services/trustService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface TrustScoreHistoryProps {
  userId: string;
  limit?: number;
}

export const TrustScoreHistory: React.FC<TrustScoreHistoryProps> = ({
  userId,
  limit = 10
}) => {
  const { history, loading, error } = useTrustScoreHistory(userId, limit);

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-amber-300">
        <CardContent className="p-4 text-sm text-amber-600">
          Fehler beim Laden des Vertrauensverlaufs: {error.message}
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 text-sm text-muted-foreground">
          Keine Vertrauenswert-Änderungen aufgezeichnet.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {history.map((entry) => (
        <TrustScoreHistoryItem key={entry.id} entry={entry} />
      ))}
    </div>
  );
};

interface TrustScoreHistoryItemProps {
  entry: TrustScoreAuditEntry;
}

const TrustScoreHistoryItem: React.FC<TrustScoreHistoryItemProps> = ({ entry }) => {
  const formatTimestamp = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
    } catch (e) {
      return 'Ungültig';
    }
  };

  // Delta styling and icon
  const getDeltaDisplay = () => {
    if (entry.delta > 0) {
      return (
        <span className="text-green-600 flex items-center">
          <ArrowUpIcon className="h-4 w-4 mr-1" /> +{entry.delta}
        </span>
      );
    } else if (entry.delta < 0) {
      return (
        <span className="text-red-600 flex items-center">
          <ArrowDownIcon className="h-4 w-4 mr-1" /> {entry.delta}
        </span>
      );
    } else {
      return (
        <span className="text-gray-500 flex items-center">
          <MinusIcon className="h-4 w-4 mr-1" /> 0
        </span>
      );
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-3 grid grid-cols-5 gap-2 text-sm">
        <div className="col-span-1 text-muted-foreground">
          {formatTimestamp(entry.created_at)}
        </div>
        <div className="col-span-2 font-medium">
          {entry.old_score ?? '–'} → {entry.new_score ?? '–'}
        </div>
        <div className="col-span-1">
          {getDeltaDisplay()}
        </div>
        <div className="col-span-1 text-muted-foreground truncate" title={entry.reason}>
          {entry.reason || 'Aktualisierung'}
        </div>
      </div>
    </Card>
  );
};
