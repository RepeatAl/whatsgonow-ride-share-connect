
import React from 'react';
import { format } from 'date-fns';
import { AlertTriangle, Shield } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface EscalationStatusProps {
  isPreSuspended: boolean;
  preSuspendReason?: string | null;
  preSuspendAt?: string | null;
  className?: string;
}

export const EscalationStatus: React.FC<EscalationStatusProps> = ({
  isPreSuspended,
  preSuspendReason,
  preSuspendAt,
  className
}) => {
  if (!isPreSuspended) return null;

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Unbekanntes Datum';
    try {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
    } catch (e) {
      return 'Ungültiges Datum';
    }
  };

  return (
    <Alert className={`border-red-400 bg-red-50 ${className}`}>
      <AlertTriangle className="h-5 w-5 text-red-600" />
      <AlertTitle className="text-red-700 flex items-center gap-2">
        <Shield className="h-4 w-4" />
        Eskaliertes Nutzerkonto
      </AlertTitle>
      <AlertDescription className="text-red-600">
        <div className="mt-1">
          <span className="font-semibold">Grund:</span> {preSuspendReason || 'Kein Grund angegeben'}
        </div>
        {preSuspendAt && (
          <div className="mt-1 text-xs text-red-500">
            Eskaliert am {formatDate(preSuspendAt)}
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default EscalationStatus;
