
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Plus, Clock, Mail, Phone } from "lucide-react";
import RoleBadge from "./RoleBadge";
import UserRating from "./UserRating";
import { User } from "@/hooks/use-fetch-users";
import UserDetailsExpander from "./UserDetailsExpander";

interface UserRowProps {
  user: User;
  expandedUser: string | null;
  toggleExpand: (userId: string) => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, expandedUser, toggleExpand }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  const isExpanded = expandedUser === user.user_id;

  return (
    <>
      <TableRow key={user.user_id}>
        <TableCell>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => toggleExpand(user.user_id)}
          >
            {isExpanded ? 
              <Eye className="h-4 w-4 text-blue-500" /> : 
              <Plus className="h-4 w-4" />
            }
          </Button>
        </TableCell>
        <TableCell className="font-medium">{user.name}</TableCell>
        <TableCell><RoleBadge role={user.role} /></TableCell>
        <TableCell className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          {formatDate(user.created_at)}
        </TableCell>
        <TableCell>{user.orders_count}</TableCell>
        <TableCell>
          <UserRating rating={user.rating_avg} />
        </TableCell>
        <TableCell>
          <div className="flex space-x-2">
            <Button size="icon" variant="ghost" title={user.email}>
              <Mail className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" title="Anrufen">
              <Phone className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={7} className="p-0 border-t-0">
            <UserDetailsExpander user={user} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default UserRow;
