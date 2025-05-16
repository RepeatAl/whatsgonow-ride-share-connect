
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Ban } from 'lucide-react';
import { format, formatDistanceToNow, isAfter } from 'date-fns';
import { de } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { useSuspension } from '@/hooks/use-suspension';

interface UserSuspensionNoticeProps {
  userId: string;
}

export const UserSuspensionNotice: React.FC<UserSuspensionNoticeProps> = ({ userId }) => {
  const { fetchUserSuspensionStatus, loading } = useSuspension();
  const [status, setStatus] = React.useState<any>(null);
  
  React.useEffect(() => {
    const loadSuspensionStatus = async () => {
      const suspensionStatus = await fetchUserSuspensionStatus(userId);
      setStatus(suspensionStatus);
    };
    
    loadSuspensionStatus();
  }, [userId]);
  
  if (loading || !status || !status.is_suspended) {
    return null;
  }
  
  const isPermanent = !status.suspended_until;
  const isActive = isPermanent || isAfter(new Date(status.suspended_until), new Date());
  
  if (!isActive) {
    return null;
  }
  
  // Format the expiry date if there is one
  const formattedDate = status.suspended_until ? 
    format(new Date(status.suspended_until), 'dd.MM.yyyy HH:mm', { locale: de }) : 
    null;
  
  // Time remaining
  const timeRemaining = status.suspended_until ? 
    formatDistanceToNow(new Date(status.suspended_until), { addSuffix: true, locale: de }) : 
    null;
  
  return (
    <Alert variant="destructive" className="mb-6">
      <Ban className="h-5 w-5" />
      <AlertTitle>Ihr Konto ist gesperrt</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-2">
          Ihr Konto wurde {isPermanent ? 'permanent' : 'temporär'} gesperrt. 
          {!isPermanent && formattedDate && (
            <span className="ml-1">Die Sperrung ist aktiv bis {formattedDate} ({timeRemaining}).</span>
          )}
        </p>
        
        {status.suspension_reason && (
          <p className="mb-2">
            <strong>Grund:</strong> {status.suspension_reason}
          </p>
        )}
        
        <p className="text-sm mb-4">
          Wenn Sie Fragen zu dieser Sperrung haben, wenden Sie sich bitte an unseren Support.
        </p>
        
        <Button variant="outline" size="sm" className="bg-white hover:bg-gray-100">
          Kontaktieren Sie den Support
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default UserSuspensionNotice;
