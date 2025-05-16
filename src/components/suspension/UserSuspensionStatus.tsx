
import React from 'react';
import { format, formatDistanceToNow, isAfter } from 'date-fns';
import { de } from 'date-fns/locale';
import { Ban, Clock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { SuspensionStatus } from '@/types/suspension';

interface UserSuspensionStatusProps {
  status: SuspensionStatus;
  className?: string;
}

export const UserSuspensionStatus: React.FC<UserSuspensionStatusProps> = ({
  status,
  className = ""
}) => {
  if (!status.is_suspended) return null;

  const isPermanent = !status.suspended_until;
  const isActive = isPermanent || isAfter(new Date(status.suspended_until!), new Date());
  
  // Format the expiry date if there is one
  const formattedDate = status.suspended_until ? format(new Date(status.suspended_until), 'dd.MM.yyyy HH:mm', { locale: de }) : null;
  
  // Time remaining
  const timeRemaining = status.suspended_until ? 
    formatDistanceToNow(new Date(status.suspended_until), { addSuffix: true, locale: de }) : 
    null;

  return (
    <Alert className={`border-red-500 bg-red-50 ${className}`}>
      <Ban className="h-5 w-5 text-red-600" />
      <AlertTitle className="text-red-700 flex items-center gap-2">
        Suspendiertes Nutzerkonto
      </AlertTitle>
      <AlertDescription className="text-red-600">
        <div className="mt-1">
          <span className="font-semibold">Grund:</span> {status.suspension_reason || 'Kein Grund angegeben'}
        </div>
        {formattedDate && (
          <div className="mt-1 flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>
              Suspendierung aktiv bis: {formattedDate} ({timeRemaining})
            </span>
          </div>
        )}
        {isPermanent && (
          <div className="mt-1 flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            <span className="font-medium">Permanente Suspendierung</span>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default UserSuspensionStatus;
