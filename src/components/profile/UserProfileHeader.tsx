
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, Camera, BadgeCheck, Star, UserCog, 
  Building, UserRound, ShieldCheck 
} from "lucide-react";
import UserRating from "@/components/rating/UserRating";
import { Link } from "react-router-dom";
import { UserRole, UserProfile } from "@/types/auth";

interface UserProfileHeaderProps {
  profile: UserProfile;
  userId: string;
  onUploadClick?: () => void;
  showActions?: boolean;
}

const UserProfileHeader = ({ profile, userId, onUploadClick, showActions = true }: UserProfileHeaderProps) => {
  // Stelle sicher, dass wir einen Namen haben - entweder aus dem vorhandenen name-Feld
  // oder generiert aus first_name und last_name
  const displayName = profile.name || 
    `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 
    'Benutzer';

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case "driver":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Shield className="w-3 h-3 mr-1" />
            Fahrer
          </Badge>
        );
      case "sender_private":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <UserRound className="w-3 h-3 mr-1" />
            Privater Versender
          </Badge>
        );
      case "sender_business":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <Building className="w-3 h-3 mr-1" />
            Geschäftskunde
          </Badge>
        );
      case "admin":
      case "admin_limited":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <UserCog className="w-3 h-3 mr-1" />
            Administrator
          </Badge>
        );
      case "cm":
        return (
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
            <ShieldCheck className="w-3 h-3 mr-1" />
            Community Manager
          </Badge>
        );
      default:
        return null;
    }
  };

  const getQuickActions = (role?: string) => {
    if (!showActions) return null;

    const commonActions = (
      <Button 
        variant="outline" 
        size="sm" 
        className="ml-2"
        onClick={onUploadClick}
      >
        <Camera className="h-4 w-4 mr-1" />
        Profilbild ändern
      </Button>
    );

    switch (role) {
      case "admin":
      case "admin_limited":
        return (
          <div className="flex flex-wrap gap-2 mt-2">
            {commonActions}
            <Button 
              variant="outline" 
              size="sm" 
              asChild
            >
              <Link to="/admin">
                <UserCog className="h-4 w-4 mr-1" />
                Admin-Bereich
              </Link>
            </Button>
          </div>
        );
      case "cm":
        return (
          <div className="flex flex-wrap gap-2 mt-2">
            {commonActions}
            <Button 
              variant="outline" 
              size="sm" 
              asChild
            >
              <Link to="/community-manager">
                <ShieldCheck className="h-4 w-4 mr-1" />
                CM-Dashboard
              </Link>
            </Button>
          </div>
        );
      case "driver":
        return (
          <div className="flex flex-wrap gap-2 mt-2">
            {commonActions}
            <Button 
              variant="outline" 
              size="sm" 
              asChild
            >
              <Link to="/offer-transport">
                <Shield className="h-4 w-4 mr-1" />
                Transport anbieten
              </Link>
            </Button>
          </div>
        );
      default:
        return (
          <div className="flex flex-wrap gap-2 mt-2">
            {commonActions}
          </div>
        );
    }
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative group">
          <Avatar className="h-24 w-24">
            <AvatarImage 
              src={profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`} 
              alt={`${displayName}'s profile picture`}
              className="object-cover"
            />
            <AvatarFallback className="text-lg">{getInitials(displayName)}</AvatarFallback>
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
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold">{displayName}</h2>
            
            {getRoleBadge(profile.role)}
            
            {profile.verified && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <BadgeCheck className="w-3 h-3 mr-1" />
                Verifiziert
              </Badge>
            )}
          </div>
          
          <div className="text-sm text-gray-600 mb-2">
            {profile.email}
          </div>
          
          <UserRating userId={userId} size="md" />
          
          {getQuickActions(profile.role)}
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
