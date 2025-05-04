
# 🔐 Whatsgonow Visibility Matrix

This document defines the visibility and access control rules for all routes and API endpoints in Whatsgonow. It serves as the single source of truth for determining:

1. Which routes are publicly accessible vs. protected
2. What roles can access specific routes
3. What special filtering rules apply (e.g., region, ownership)
4. Which API endpoints have specific access controls

## Routes and Pages

| Route | Public | Login Required | Allowed Roles | Special Access Rules |
|-------|--------|---------------|---------------|----------------------|
| **Home & Auth** |
| `/` | ✅ | ❌ | All | Landing page visible to everyone |
| `/login` | ✅ | ❌ | All | Redirects authenticated users to dashboard |
| `/register` | ✅ | ❌ | All | Redirects authenticated users to dashboard |
| `/register/success` | ✅ | ❌ | All | Registration success page |
| `/forgot-password` | ✅ | ❌ | All | Password reset request page |
| `/reset-password` | ✅ | ❌ | All | Password reset page with token |
| `/pre-register` | ✅ | ❌ | All | Pre-registration form |
| `/pre-register/success` | ✅ | ❌ | All | Pre-registration success page |
| **Public Information** |
| `/faq` | ✅ | ❌ | All | Public FAQ page |
| `/support` | ✅ | ❌ | All | Public support contact page |
| **Mobile & Public Token Features** |
| `/mobile-upload/:sessionId` | ✅ | ❌ | All | Mobile upload with secure session ID |
| `/upload-complete` | ✅ | ❌ | All | Upload completion page |
| `/delivery/:token` | ✅ | ❌ | All | Delivery confirmation with secure token |
| `/invoice-download/:token` | ✅ | ❌ | All | Invoice download with secure token |
| **Profile & Onboarding** |
| `/dashboard` | ❌ | ✅ | All | Redirects to role-specific dashboard |
| `/dashboard/sender` | ❌ | ✅ | sender_private, sender_business | Sender-specific dashboard |
| `/dashboard/driver` | ❌ | ✅ | driver | Driver-specific dashboard |
| `/dashboard/cm` | ❌ | ✅ | cm | Community manager dashboard |
| `/dashboard/admin` | ❌ | ✅ | admin, super_admin | Admin dashboard |
| `/profile` | ❌ | ✅ | All | Users see their own profile only |
| `/complete-profile` | ❌ | ✅ | All | Profile completion form |
| **Orders & Delivery** |
| `/orders` | ❌ | ✅ | All | Filtered by role: drivers see available orders, senders see their orders, admins/CMs see all (CM region-limited) |
| `/orders/drafts` | ❌ | ✅ | sender_private, sender_business | User's own draft orders only |
| `/orders/drafts/:draftId/edit` | ❌ | ✅ | sender_private, sender_business | Only draft owner can access |
| `/orders/mine` | ❌ | ✅ | All | Filtered by role: drivers see assigned orders, senders see their created orders |
| `/create-order` | ❌ | ✅ | sender_private, sender_business | Order creation page |
| `/deal/:orderId` | ❌ | ✅ | All | Only participating users (sender, driver, admin) can access specific deals |
| **Transport & Logistics** |
| `/offer-transport` | ❌ | ✅ | driver | Transport offer creation page |
| **Feedback** |
| `/feedback` | ❌ | ✅ | All | Feedback submission page |
| **Admin & CM Tools** |
| `/community-manager` | ❌ | ✅ | cm | CM tools, region-filtered |
| `/admin` | ❌ | ✅ | admin, super_admin | Admin home |
| `/admin/dashboard` | ❌ | ✅ | admin, super_admin | Admin dashboard |
| `/admin/validation` | ❌ | ✅ | admin, super_admin | KYC validation tools |
| `/admin/feedback` | ❌ | ✅ | admin, super_admin | Feedback management |
| `/admin/pre-registrations` | ❌ | ✅ | admin, super_admin | Pre-registration management |
| `/admin/users` | ❌ | ✅ | admin, super_admin | User management |
| **Development/Testing Routes** 📝 |
| `/admin/invoice-test` | ❌ | ✅ | admin, super_admin | *DEVELOPMENT* Invoice testing tool |
| `/email-test` | ❌ | ✅ | admin, super_admin | *DEVELOPMENT* Email template testing tool |
| `/rls-test` | ❌ | ✅ | admin, super_admin | *DEVELOPMENT* RLS policy testing tool |
| **Error Pages** |
| `*` (404) | ✅ | ❌ | All | Not found page - public |

## API Endpoints and Database Tables

| Endpoint/Table | Auth Required | Allowed Roles | Authentication Mode | Special Access Rules |
|---------------|---------------|---------------|---------------------|----------------------|
| **Users & Profiles** |
| `profiles` | ✅ | All | Auth Session | Users see own profile, CM see region-filtered, admin/super_admin see all |
| `users` | ✅ | cm, admin, super_admin | Auth Session | CM see region-filtered profiles, admin/super_admin see all |
| **Orders & Transactions** |
| `orders` | ✅ | All | Auth Session | Senders see own orders, drivers see available/assigned orders, CM see region-filtered, admin see all |
| `orders/:id` | ✅ | All | Auth Session | Allowed if user is sender, assigned driver, admin, or CM (with region match) |
| `offers` | ✅ | All | Auth Session | Drivers see own offers, senders see offers for their orders, CM see region-filtered, admin see all |
| `transactions` | ✅ | All | Auth Session | Users see own transactions, CM see region-filtered, admin see all |
| **Reviews & Feedback** |
| `ratings` | ✅ | All | Auth Session | Users see ratings for/by them, CM see region-filtered, admin see all |
| `feedback` | ✅ | cm, admin, super_admin | Auth Session | CM see region-filtered feedback, admin/super_admin see all |
| **Community Management** |
| `community_managers` | ✅ | cm, admin, super_admin | Auth Session | CM see own region, admin/super_admin see all |
| **Admin-Only** |
| `role_change_logs` | ✅ | super_admin | Auth Session | Only super_admin can view |
| `assign_role` function | ✅ | super_admin | Auth Session | Only super_admin can execute |

## Special Access Rules

### Profile Visibility
- Users can only see and edit their own profile data
- Community Managers can see profiles in their assigned region
- Admins can see all profiles

### Order Filtering
- Senders (private/business) can only see and manage their own orders
- Drivers can see all available orders matching their vehicle type and location, plus orders assigned to them
- Community Managers can only see orders in their assigned region
- Senders cannot see other senders' orders

### Deal Management
- A deal can only be accessed by:
  - The sender who created the order
  - The driver assigned to the order
  - Community Managers for the region
  - Admins

### Token-Based Access
- Public token-based routes (`/delivery/:token`, `/invoice-download/:token`) use secure one-time tokens
- These routes validate the token before displaying any data
- Tokens expire after use or after a specified time period

### Region Filtering for Community Managers
- Community Managers see data only for their assigned region
- This is enforced by RLS policies at the database level using:
```sql
EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'cm' 
  AND profiles.region = target_table.region
)
```

## Authentication Implementation

- Session management via Supabase Auth and protected routes
- Row Level Security (RLS) policies for database tables
- Frontend route protection via `PublicRoute` and `ProtectedRoute` components
- Automatic redirects based on authentication state via `useAuthRedirect` hook
- Role-based redirects via `useRoleRedirect` hook

## Verification

This visibility matrix is enforced through:
1. Frontend route protection (via React Router and AuthContext)
2. Supabase Row Level Security (RLS) policies
3. Component-level access checks
4. Automated testing via the RLS test page (`/rls-test`)
5. Automated consistency checks (see `scripts/check-visibility-consistency.ts`)

## Related Documentation

- [Role & ID Conventions](/docs/conventions/roles_and_ids.md)
- [Role Dependencies](/docs/system/role_dependencies.md)
- [Refactoring Checklist](/docs/refactor/role_alignment_checklist.md)
