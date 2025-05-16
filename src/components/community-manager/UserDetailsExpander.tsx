
import React from "react";
import { User } from "@/hooks/use-fetch-users";
import { TrustScoreHistoryDialog } from "@/components/trust/TrustScoreHistoryDialog";
import { useTrustScore } from "@/hooks/use-trust-score";
import { Separator } from "@/components/ui/separator";

interface UserDetailsExpanderProps {
  user: User;
}

const UserDetailsExpander: React.FC<UserDetailsExpanderProps> = ({ user }) => {
  const { score } = useTrustScore(user.user_id);
  
  return (
    <div className="px-4 py-3 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium">Erweiterte Nutzerinformationen</h4>
        {score !== null && (
          <TrustScoreHistoryDialog userId={user.user_id} userName={user.name} />
        )}
      </div>
      
      <Separator className="my-2" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-3">
        <div>
          <span className="text-muted-foreground">User ID:</span> {user.user_id}
        </div>
        <div>
          <span className="text-muted-foreground">Email:</span> {user.email}
        </div>
        <div>
          <span className="text-muted-foreground">Registriert am:</span> {new Date(user.created_at).toLocaleDateString('de-DE')}
        </div>
        <div>
          <span className="text-muted-foreground">Rolle:</span> {user.role}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsExpander;
