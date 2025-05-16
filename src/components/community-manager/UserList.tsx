import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableHead, 
  TableHeader, 
  TableRow,
  TableCell
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchUsers } from "@/hooks/use-fetch-users";
import UserRow from "./UserRow";
import EmptyState from "./EmptyState";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useTrustScore } from "@/hooks/use-trust-score";
import { Badge } from "@/components/ui/badge";

interface UserListProps {
  region: string;
}

const UserList = ({ region }: UserListProps) => {
  const { users, loading } = useFetchUsers(region);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [showOnlyLowTrustUsers, setShowOnlyLowTrustUsers] = useState(false);

  // Cache trust scores to avoid multiple hooks for the same user
  const [trustScoreCache, setTrustScoreCache] = useState<Record<string, number | null>>({});

  const toggleExpand = (userId: string) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
    } else {
      setExpandedUser(userId);
    }
  };

  // Cache trust score for a user when it's loaded
  const cacheTrustScore = (userId: string, score: number | null) => {
    if (!(userId in trustScoreCache)) {
      setTrustScoreCache(prev => ({
        ...prev,
        [userId]: score
      }));
    }
  };

  // Filter users based on trust score if filter is active
  const filteredUsers = showOnlyLowTrustUsers
    ? users.filter(user => {
        // If we have the score cached, use it directly
        if (user.user_id in trustScoreCache) {
          const score = trustScoreCache[user.user_id];
          return score !== null && score < 80;
        }
        // Otherwise, we'll show all users until scores are loaded
        return true;
      })
    : users;

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full mb-4" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!region) {
    return (
      <EmptyState message="Dir ist noch keine Region zugewiesen. Bitte kontaktiere einen Administrator." />
    );
  }

  // Helper component to load and cache trust scores
  const TrustScoreLoader = ({ userId }: { userId: string }) => {
    const { score } = useTrustScore(userId);
    cacheTrustScore(userId, score);
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Checkbox 
          id="show-low-trust" 
          checked={showOnlyLowTrustUsers}
          onCheckedChange={(checked) => setShowOnlyLowTrustUsers(checked as boolean)}
        />
        <Label htmlFor="show-low-trust" className="cursor-pointer">Nur Nutzer mit Trust Score unter 80 anzeigen</Label>
        
        {showOnlyLowTrustUsers && (
          <Badge variant="outline" className="ml-auto bg-amber-50 text-amber-800 border-amber-200">
            Gefiltert: {filteredUsers.length} von {users.length} Nutzern
          </Badge>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>Nutzer in der Region {region}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Rolle</TableHead>
              <TableHead>Registriert</TableHead>
              <TableHead>Aufträge</TableHead>
              <TableHead>Bewertung</TableHead>
              <TableHead>Kontakt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Load trust scores for all users to enable filtering */}
            {users.map(user => (
              <TrustScoreLoader key={`loader-${user.user_id}`} userId={user.user_id} />
            ))}
            
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  {showOnlyLowTrustUsers 
                    ? "Keine Nutzer mit niedrigem Trust Score gefunden" 
                    : "Keine Nutzer gefunden"}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <UserRow 
                  key={user.user_id}
                  user={user}
                  expandedUser={expandedUser}
                  toggleExpand={toggleExpand}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserList;
