
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Shield, User } from "lucide-react";
import UserRating from "@/components/rating/UserRating";

interface UserProfileHeaderProps {
  profile: {
    name: string;
    email: string;
    role?: string;
  };
  userId: string;
}

const UserProfileHeader = ({ profile, userId }: UserProfileHeaderProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`} />
          <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            {profile.role === "driver" && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Shield className="w-3 h-3 mr-1" />
                Fahrer
              </Badge>
            )}
          </div>
          
          <div className="text-sm text-muted-foreground mb-2">{profile.email}</div>
          
          <UserRating userId={userId} size="md" />
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
