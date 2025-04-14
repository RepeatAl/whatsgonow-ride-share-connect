
import React from "react";
import { User } from "@/hooks/use-fetch-users";

interface UserDetailsExpanderProps {
  user: User;
}

const UserDetailsExpander: React.FC<UserDetailsExpanderProps> = ({ user }) => {
  // This component will be used in the future for displaying expanded user details
  return (
    <div className="px-4 py-2 bg-gray-50">
      <h4 className="font-medium mb-2">Erweiterte Nutzerinformationen</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">User ID:</span> {user.user_id}
        </div>
        <div>
          <span className="text-muted-foreground">Email:</span> {user.email}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsExpander;
