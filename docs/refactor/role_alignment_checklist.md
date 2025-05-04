
# Role Alignment Refactoring Checklist

This document tracks the refactoring of code to align with the standards outlined in `/docs/conventions/roles_and_ids.md`.

## Renaming ID Fields

- [x] `ratings.from_user` → `ratings.from_user_id` (Applied via SQL migration)
- [x] `ratings.to_user` → `ratings.to_user_id` (Applied via SQL migration)

## Role Names Standardization

- [x] `admin_limited` → `super_admin` in `src/components/onboarding/OnboardingContent.tsx`
- [x] Update `UserRole` type in `src/types/auth.ts` to use standard role names
- [ ] Update role references in RLS policies

## Missing Convention Comments

- [ ] Add missing comments to SQL migration files
- [ ] Add references to convention doc in component files that use roles

## Community Manager (CM) Visibility

- [ ] Enhance CM region filtering in RLS test utility
- [ ] Add region-specific tests to `/rls-test` page
- [ ] Implement proper region filtering for CM in relevant components

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
