
# Role Alignment Refactoring Checklist

This document tracks the refactoring of code to align with the standards outlined in `/docs/conventions/roles_and_ids.md`.

## Renaming ID Fields

- [x] `ratings.from_user` → `ratings.from_user_id` (Applied via SQL migration)
- [x] `ratings.to_user` → `ratings.to_user_id` (Applied via SQL migration)
- [x] `RatingsTabContent.tsx` updated to correctly handle the from_user_id structure

## Role Names Standardization

- [x] `admin_limited` → `super_admin` in `src/components/onboarding/OnboardingContent.tsx`
- [x] Update `UserRole` type in `src/types/auth.ts` to use standard role names
- [x] Update role references in RLS policies

## Missing Convention Comments

- [x] Add missing comments to SQL migration files
- [x] Add references to convention doc in component files that use roles

## Community Manager (CM) Visibility

- [x] Enhance CM region filtering in RLS test utility
- [x] Add region-specific tests to `/rls-test` page
- [x] Implement proper region filtering for CM in relevant components

## Visibility and Access Control

- [x] Create comprehensive visibility matrix in `/docs/system/visibility_matrix.md`
- [x] Ensure consistency between routes.tsx and visibility matrix
- [x] Document special access rules for complex routes
- [x] Create check-visibility-consistency.ts script
- [ ] Run accessibility audit against visibility matrix

## Files Updated

| File | Changes | Status |
|------|---------|--------|
| `src/types/auth.ts` | Updated `UserRole` type | Complete |
| `src/components/onboarding/OnboardingContent.tsx` | Replaced `admin_limited` with `super_admin` | Complete |
| `src/hooks/useRoleRedirect.ts` | Updated role references | Complete |
| `src/components/admin/AdminLayout.tsx` | Updated admin role checks | Complete |
| `src/pages/Admin.tsx` | Updated admin role references | Complete |
| `src/components/profile/UserProfileHeader.tsx` | Updated role references | Complete |
| `src/utils/auth-utils.ts` | Updated getRoleBasedRedirectPath function | Complete |
| `src/components/profile/tabs/RatingsTabContent.tsx` | Fixed from_user_id handling | Complete |
| `src/utils/rls-testing/role-access-tester.ts` | Enhanced CM region filtering tests | Complete |
| `docs/system/visibility_matrix.md` | Created visibility matrix document | Complete |
| `scripts/check-visibility-consistency.ts` | Created consistency check script | Complete |

## Profile ID to User ID Conversion

All direct profile_id references have been replaced with user_id throughout the codebase. The following components and hooks have been verified:

- [x] All components in `src/components/admin/`
- [x] All hooks in `src/hooks/`
- [x] All database queries and mutations
- [x] Auth context and profile-related utilities

## Functionality Verification

- [x] `assign_role()` function works correctly with super_admin permissions
- [x] Role changes appear in role_change_logs table
- [x] CM region filtering restricts data access properly
- [x] RLS test utility successfully tests all roles and permissions
- [x] Route protection is consistent with visibility matrix

## Related Components and Files

### related: Rating System
- [x] `src/components/profile/tabs/RatingsTabContent.tsx`
- [x] `src/components/rating/RateUser.tsx`
- [x] `src/utils/rls-testing/test-operations.ts`

### related: Community Manager
- [x] `src/pages/CommunityManager.tsx`
- [x] `src/components/community-manager/UserList.tsx`
- [x] `src/utils/rls-testing/role-access-tester.ts`

### related: Role Management
- [x] `src/components/admin/users/RoleManager.tsx`
- [x] `src/pages/RLSTest.tsx`
- [x] `src/utils/rls-testing/types.ts`

### related: Visibility Control
- [x] `docs/system/visibility_matrix.md`
- [x] `scripts/check-visibility-consistency.ts`
- [x] `src/components/routing/ProtectedRoute.tsx`
- [x] `src/components/routing/PublicRoute.tsx`
