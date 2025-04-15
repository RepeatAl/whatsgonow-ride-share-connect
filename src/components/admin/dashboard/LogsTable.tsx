
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminLogEntry } from "@/hooks/use-admin-logs";
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface LogsTableProps {
  logs: AdminLogEntry[];
  timeRange: number;
}

const LogsTable = ({ logs, timeRange }: LogsTableProps) => {
  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return 'n/a';
    return format(new Date(timestamp), 'dd. MMM yyyy, HH:mm', { locale: de });
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'delivery_confirmed':
        return <Badge className="bg-green-500">Lieferung bestätigt</Badge>;
      case 'payment_initiated':
        return <Badge className="bg-blue-500">Zahlung initiiert</Badge>;
      case 'payment_completed':
        return <Badge className="bg-emerald-500">Zahlung abgeschlossen</Badge>;
      case 'pickup_started':
        return <Badge className="bg-amber-500">Abholung gestartet</Badge>;
      case 'delivery_started':
        return <Badge className="bg-purple-500">Lieferung gestartet</Badge>;
      default:
        return <Badge>{action}</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableCaption>Lieferprotokolle der letzten {timeRange} Tage</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Log ID</TableHead>
            <TableHead>Auftrag</TableHead>
            <TableHead>Nutzer</TableHead>
            <TableHead>Aktion</TableHead>
            <TableHead>IP-Adresse</TableHead>
            <TableHead>Zeitpunkt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Keine Protokolldaten für den ausgewählten Zeitraum verfügbar
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log: AdminLogEntry) => (
              <TableRow key={log.log_id}>
                <TableCell className="font-mono text-xs">{log.log_id.slice(0, 8)}...</TableCell>
                <TableCell>
                  {log.order_id ? (
                    <Button variant="link" className="p-0 h-auto" onClick={() => window.open(`/deal/${log.order_id}`, '_blank')}>
                      {log.order_id.slice(0, 8)}...
                    </Button>
                  ) : (
                    'n/a'
                  )}
                </TableCell>
                <TableCell>{log.user_name || 'Unknown'}</TableCell>
                <TableCell>{getActionBadge(log.action)}</TableCell>
                <TableCell className="font-mono text-xs">{log.ip_address || 'n/a'}</TableCell>
                <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LogsTable;

