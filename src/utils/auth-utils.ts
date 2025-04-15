
import { toast } from "@/hooks/use-toast";
import { SUPER_ADMIN_ID, type UserRole } from "@/types/auth";

export const getRoleBasedRedirectPath = (role: string): string => {
  switch (role) {
    case 'sender_private':
    case 'sender_business':
      return '/create-order';
    case 'driver':
      return '/orders';
    case 'cm':
      return '/community-manager';
    case 'admin':
    case 'admin_limited':
      return '/admin-dashboard';
    default:
      return '/dashboard';
  }
};

export const handleAuthError = (error: Error, action: string) => {
  console.error(`Auth error during ${action}:`, error);
  toast({
    title: `${action} fehlgeschlagen`,
    description: error.message,
    variant: "destructive"
  });
  throw error;
};

export const canChangeUserRole = (currentUserId: string, currentUserRole: string): boolean => {
  // Only super admin or regular admin can change user roles
  return currentUserId === SUPER_ADMIN_ID || currentUserRole === 'admin';
};

export const canAssignAdminRole = (currentUserId: string): boolean => {
  // Only super admin can assign admin roles
  return currentUserId === SUPER_ADMIN_ID;
};

export const canViewSensitiveUserData = (currentUserRole: string): boolean => {
  // Admin_limited cannot view sensitive user data
  return currentUserRole !== 'admin_limited';
};

export const formatRoleForDisplay = (role: UserRole): string => {
  switch (role) {
    case 'sender_private':
      return 'Privater Versender';
    case 'sender_business':
      return 'Geschäftlicher Versender';
    case 'driver':
      return 'Fahrer';
    case 'cm':
      return 'Community Manager';
    case 'admin':
      return 'Administrator';
    case 'admin_limited':
      return 'Eingeschränkter Administrator';
    default:
      return role;
  }
};
