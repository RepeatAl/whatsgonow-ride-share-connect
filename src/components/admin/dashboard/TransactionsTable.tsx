
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TransactionEntry } from "@/hooks/use-admin-logs";
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface TransactionsTableProps {
  transactions: TransactionEntry[];
  timeRange: number;
}

const TransactionsTable = ({ transactions, timeRange }: TransactionsTableProps) => {
  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return 'n/a';
    return format(new Date(timestamp), 'dd. MMM yyyy, HH:mm', { locale: de });
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableCaption>Transaktionen der letzten {timeRange} Tage</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Transaktions-ID</TableHead>
            <TableHead>Auftrag</TableHead>
            <TableHead>Von</TableHead>
            <TableHead>An</TableHead>
            <TableHead>Betrag</TableHead>
            <TableHead>Zeitpunkt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Keine Transaktionen für den ausgewählten Zeitraum verfügbar
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((tx: TransactionEntry) => (
              <TableRow key={tx.tx_id}>
                <TableCell className="font-mono text-xs">{tx.tx_id.slice(0, 8)}...</TableCell>
                <TableCell>
                  {tx.order_id ? (
                    <Button variant="link" className="p-0 h-auto" onClick={() => window.open(`/deal/${tx.order_id}`, '_blank')}>
                      {tx.order_id.slice(0, 8)}...
                    </Button>
                  ) : (
                    'n/a'
                  )}
                </TableCell>
                <TableCell>{tx.payer_name || 'Unknown'}</TableCell>
                <TableCell>{tx.receiver_name || 'Unknown'}</TableCell>
                <TableCell className="font-medium">€{tx.amount.toFixed(2)}</TableCell>
                <TableCell>{formatTimestamp(tx.timestamp)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsTable;
