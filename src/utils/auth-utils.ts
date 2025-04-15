
import { toast } from "@/hooks/use-toast";

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
