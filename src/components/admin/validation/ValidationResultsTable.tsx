
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X } from "lucide-react";
import { format } from 'date-fns';
import type { ValidationResult } from "@/hooks/use-validation-dashboard";

interface ValidationResultsTableProps {
  results: ValidationResult[];
  loading: boolean;
  onViewAuditLog: (invoiceId: string) => void;
}

export const ValidationResultsTable = ({
  results,
  loading,
  onViewAuditLog
}: ValidationResultsTableProps) => {
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd.MM.yyyy HH:mm');
    } catch (e) {
      return 'Ungültiges Datum';
    }
  };

  if (loading) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="text-center py-8">
          Lade Validierungsergebnisse...
        </TableCell>
      </TableRow>
    );
  }

  if (results.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="text-center py-8">
          Keine Validierungsergebnisse gefunden.
        </TableCell>
      </TableRow>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Rechnungs-ID</TableHead>
          <TableHead>Validierungstyp</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Datum</TableHead>
          <TableHead>Warnungen</TableHead>
          <TableHead>Fehler</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map((result) => (
          <TableRow key={result.validation_id}>
            <TableCell>
              <Button
                variant="link"
                onClick={() => onViewAuditLog(result.invoice_id)}
                className="p-0 h-auto font-medium text-blue-600 hover:text-blue-800"
              >
                {result.invoice_id.substring(0, 8)}...
              </Button>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="capitalize">
                {result.validation_type === 'digital_signature' 
                  ? 'Digitale Signatur' 
                  : result.validation_type === 'xrechnung'
                  ? 'XRechnung'
                  : result.validation_type === 'gobd'
                  ? 'GoBD'
                  : result.validation_type === 'format'
                  ? 'Format'
                  : result.validation_type === 'tax'
                  ? 'Steuer'
                  : result.validation_type}
              </Badge>
            </TableCell>
            <TableCell>
              {result.passed ? (
                <Badge className="bg-green-500 text-white flex items-center space-x-1 w-fit">
                  <Check className="h-3 w-3" />
                  <span>Bestanden</span>
                </Badge>
              ) : (
                <Badge className="bg-red-500 text-white flex items-center space-x-1 w-fit">
                  <X className="h-3 w-3" />
                  <span>Nicht bestanden</span>
                </Badge>
              )}
            </TableCell>
            <TableCell>{formatDate(result.validation_date)}</TableCell>
            <TableCell>
              {result.warning_messages && result.warning_messages.length > 0 ? (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                  {result.warning_messages.length}
                </Badge>
              ) : (
                '0'
              )}
            </TableCell>
            <TableCell>
              {result.error_messages && result.error_messages.length > 0 ? (
                <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                  {result.error_messages.length}
                </Badge>
              ) : (
                '0'
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
