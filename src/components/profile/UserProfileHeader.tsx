
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, User, Camera } from "lucide-react";
import UserRating from "@/components/rating/UserRating";

interface UserProfileHeaderProps {
  profile: {
    name: string;
    email: string;
    role?: string;
    verified?: boolean;
    avatar_url?: string;
  };
  userId: string;
  onUploadClick?: () => void;
}

const UserProfileHeader = ({ profile, userId, onUploadClick }: UserProfileHeaderProps) => {
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
        <div className="relative group">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`} />
            <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
          </Avatar>
          {onUploadClick && (
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onUploadClick}
            >
              <Camera className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            {profile.role === "driver" && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Shield className="w-3 h-3 mr-1" />
                Fahrer
              </Badge>
            )}
            {profile.verified && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Shield className="w-3 h-3 mr-1" />
                Verifiziert
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
