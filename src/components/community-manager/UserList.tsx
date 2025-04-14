
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

interface UserListProps {
  region: string;
}

const UserList = ({ region }: UserListProps) => {
  const { users, loading } = useFetchUsers(region);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const toggleExpand = (userId: string) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
    } else {
      setExpandedUser(userId);
    }
  };

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

  return (
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
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                Keine Nutzer gefunden
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
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
  );
};

export default UserList;
