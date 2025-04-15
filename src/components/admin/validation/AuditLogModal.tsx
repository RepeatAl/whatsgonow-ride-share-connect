
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import type { AuditLogEntry } from "@/hooks/use-validation-dashboard";

interface AuditLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string | null;
  entries: AuditLogEntry[];
  loading: boolean;
}

export const AuditLogModal = ({
  open,
  onOpenChange,
  invoiceId,
  entries,
  loading
}: AuditLogModalProps) => {
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd.MM.yyyy HH:mm');
    } catch (e) {
      return 'Ungültiges Datum';
    }
  };

  const renderJsonDiff = (prev: any, next: any) => {
    if (!prev || !next) return null;
    
    return (
      <div className="bg-gray-50 p-3 rounded-md mt-2 text-xs overflow-auto max-h-40">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-1">Vorheriger Status:</h4>
            <pre>{JSON.stringify(prev, null, 2)}</pre>
          </div>
          <div>
            <h4 className="font-medium mb-1">Neuer Status:</h4>
            <pre>{JSON.stringify(next, null, 2)}</pre>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Audit-Log für Rechnung</DialogTitle>
          <DialogDescription>
            Rechnungs-ID: {invoiceId}
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="py-8 text-center">Lade Audit-Log...</div>
        ) : entries.length === 0 ? (
          <div className="py-8 text-center">Keine Audit-Log-Einträge gefunden.</div>
        ) : (
          <div className="max-h-[60vh] overflow-auto">
            {entries.map((entry) => (
              <div key={entry.log_id} className="border-b border-gray-200 py-4 last:border-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium">{entry.action}</h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(entry.timestamp)}
                    </p>
                  </div>
                  <Badge variant="outline">
                    Benutzer: {entry.user_id ? entry.user_id.substring(0, 8) : 'System'}
                  </Badge>
                </div>
                
                <div className="text-sm">
                  <p className="text-gray-600">
                    IP-Adresse: {entry.ip_address || 'Nicht verfügbar'}
                  </p>
                  
                  {(entry.previous_state || entry.new_state) && (
                    renderJsonDiff(entry.previous_state, entry.new_state)
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
