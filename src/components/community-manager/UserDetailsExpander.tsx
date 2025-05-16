
import React, { useState, useEffect } from "react";
import { User } from "@/hooks/use-fetch-users";
import { TrustScoreHistoryDialog } from "@/components/trust/TrustScoreHistoryDialog";
import { useTrustScore } from "@/hooks/use-trust-score";
import { Separator } from "@/components/ui/separator";
import { Flag, AlertCircle, Ban } from "lucide-react";
import { format } from "date-fns";
import UserFlaggingControls from "./UserFlaggingControls";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTrustScoreHistory } from "@/hooks/use-trust-score-history";
import FlagHistoryDialog from "../flagging/FlagHistoryDialog";
import { EscalationStatus } from "../escalation/EscalationStatus";
import { PreSuspendDialog } from "../escalation/PreSuspendDialog";
import { useEscalation, EscalationStatus as EscalationStatusType } from "@/hooks/use-escalation";
import { useSuspension } from "@/hooks/use-suspension";
import { UserSuspensionStatus } from "../suspension/UserSuspensionStatus";
import { SuspendUserDialog } from "../suspension/SuspendUserDialog";
import { SuspensionHistoryDialog } from "../suspension/SuspensionHistoryDialog";
import { Button } from "../ui/button";

interface UserDetailsExpanderProps {
  user: User;
  onUserUpdated?: () => void;
}

const UserDetailsExpander: React.FC<UserDetailsExpanderProps> = ({ user, onUserUpdated }) => {
  const { score } = useTrustScore(user.user_id);
  const { history } = useTrustScoreHistory(user.user_id, 30);
  const [showFlaggingControls, setShowFlaggingControls] = useState(true);
  const { fetchUserEscalationStatus, evaluateUser } = useEscalation();
  const [escalationStatus, setEscalationStatus] = useState<EscalationStatusType>({
    hasActiveEscalation: false,
    isPreSuspended: false,
    preSuspendReason: null,
    preSuspendAt: null
  });
  
  const { fetchUserSuspensionStatus } = useSuspension();
  const [suspensionStatus, setSuspensionStatus] = useState({
    is_suspended: false,
    suspended_until: null,
    suspension_reason: null
  });
  
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  
  // Count disputes/conflicts (in a real app this would be a proper query)
  // For demo purposes, we'll count significant trust score drops as "disputes"
  const significantDrops = history.filter(entry => entry.delta < -15).length;
  const needsEscalation = (score !== null && score < 50) && significantDrops > 1;
  
  useEffect(() => {
    loadEscalationStatus();
    loadSuspensionStatus();
  }, [user.user_id]);

  const loadEscalationStatus = async () => {
    const status = await fetchUserEscalationStatus(user.user_id);
    setEscalationStatus(status);
  };

  const loadSuspensionStatus = async () => {
    const status = await fetchUserSuspensionStatus(user.user_id);
    setSuspensionStatus(status);
  };

  const handleUserEscalated = () => {
    loadEscalationStatus();
    if (onUserUpdated) onUserUpdated();
  };

  const handleEvaluateEscalation = async () => {
    await evaluateUser(user.user_id);
    loadEscalationStatus();
  };

  const handleUserSuspended = () => {
    loadSuspensionStatus();
    if (onUserUpdated) onUserUpdated();
  };
  
  return (
    <div className="px-4 py-3 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium">Erweiterte Nutzerinformationen</h4>
        <div className="space-x-2">
          {score !== null && (
            <TrustScoreHistoryDialog userId={user.user_id} userName={user.name} />
          )}
          <FlagHistoryDialog userId={user.user_id} userName={user.name} />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsHistoryDialogOpen(true)}
          >
            <Ban className="h-3.5 w-3.5 mr-1" />
            Suspendierungen
          </Button>
        </div>
      </div>
      
      <Separator className="my-2" />
      
      {/* Suspension Status */}
      {suspensionStatus.is_suspended && (
        <UserSuspensionStatus 
          status={suspensionStatus}
          className="mb-3"
        />
      )}
      
      {/* Escalation Status */}
      {escalationStatus.isPreSuspended && !suspensionStatus.is_suspended && (
        <EscalationStatus 
          isPreSuspended={escalationStatus.isPreSuspended}
          preSuspendReason={escalationStatus.preSuspendReason}
          preSuspendAt={escalationStatus.preSuspendAt}
          className="mb-3"
        />
      )}
      
      {user.flagged_by_cm && (
        <div className="mb-3 flex items-center gap-2 text-red-500">
          <Flag className="h-4 w-4" />
          <span className="text-sm font-medium">
            Markiert am {user.flagged_at ? format(new Date(user.flagged_at), 'dd.MM.yyyy HH:mm') : 'unbekannt'}
          </span>
          {user.flag_reason && (
            <span className="text-sm text-red-400 ml-2">
              Grund: {user.flag_reason}
            </span>
          )}
        </div>
      )}
      
      {needsEscalation && !escalationStatus.isPreSuspended && !suspensionStatus.is_suspended && (
        <Alert className="mb-3 border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-700 flex justify-between items-center">
            <span>Dieser Nutzer erfüllt die Kriterien für eine Eskalation. Bitte prüfen Sie eine manuelle Markierung.</span>
            <button 
              onClick={handleEvaluateEscalation}
              className="text-xs underline text-amber-800 hover:text-amber-900"
            >
              Automatisch prüfen
            </button>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-3">
        <div>
          <span className="text-muted-foreground">User ID:</span> {user.user_id}
        </div>
        <div>
          <span className="text-muted-foreground">Email:</span> {user.email}
        </div>
        <div>
          <span className="text-muted-foreground">Telefon:</span> {user.phone || 'Nicht angegeben'}
        </div>
        <div>
          <span className="text-muted-foreground">Registriert am:</span> {new Date(user.created_at).toLocaleDateString('de-DE')}
        </div>
        <div>
          <span className="text-muted-foreground">Rolle:</span> {user.role}
        </div>
        {score !== null && (
          <div>
            <span className="text-muted-foreground">Trust Score:</span> {score} 
            {score < 50 && <span className="text-red-500 ml-1">(Kritisch)</span>}
          </div>
        )}
      </div>

      <Separator className="my-4" />
      
      {showFlaggingControls && (
        <div className="mt-4 flex justify-between items-start">
          <UserFlaggingControls 
            userId={user.user_id}
            isFlagged={!!user.flagged_by_cm}
            flagReason={user.flag_reason}
            onFlagChange={onUserUpdated}
          />
          
          <div className="space-x-2">
            {!suspensionStatus.is_suspended && escalationStatus.isPreSuspended && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => setIsSuspendDialogOpen(true)}
              >
                <Ban className="h-3.5 w-3.5 mr-1" />
                Suspendieren
              </Button>
            )}
            
            {!suspensionStatus.is_suspended && !escalationStatus.isPreSuspended && (
              <PreSuspendDialog 
                userId={user.user_id}
                userName={user.name}
                onEscalated={handleUserEscalated}
              />
            )}
          </div>
        </div>
      )}
      
      {/* Suspension Dialog */}
      <SuspendUserDialog
        userId={user.user_id}
        userName={user.name}
        isOpen={isSuspendDialogOpen}
        onClose={() => setIsSuspendDialogOpen(false)}
        onSuspended={handleUserSuspended}
      />
      
      {/* Suspension History Dialog */}
      <SuspensionHistoryDialog
        userId={user.user_id}
        userName={user.name}
        open={isHistoryDialogOpen}
        onOpenChange={setIsHistoryDialogOpen}
      />
    </div>
  );
};

export default UserDetailsExpander;
