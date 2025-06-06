
import type { UserProfile } from "@/types/auth";

/**
 * Checks if a user profile has admin privileges
 * @param profile User profile object
 * @returns true if user is admin or super_admin
 */
export const isAdmin = (profile: UserProfile | null | undefined): boolean => {
  if (!profile?.role) return false;
  return ['admin', 'super_admin'].includes(profile.role);
};

/**
 * Checks if a user profile has community manager privileges
 * @param profile User profile object
 * @returns true if user is cm, admin, or super_admin
 */
export const isCommunityManager = (profile: UserProfile | null | undefined): boolean => {
  if (!profile?.role) return false;
  return ['cm', 'admin', 'super_admin'].includes(profile.role);
};

/**
 * Checks if a user profile has elevated privileges (CM or Admin)
 * @param profile User profile object
 * @returns true if user has cm, admin, or super_admin role
 */
export const hasElevatedPrivileges = (profile: UserProfile | null | undefined): boolean => {
  return isCommunityManager(profile);
};
