# DMT Creatology

## Current State

Phase 5 is complete. The platform has:
- 14 public pages with Book Now flow → WhatsApp
- Backend admin panel at /admin (Internet Identity auth)
- Vendor marketplace with self-registration and admin approval
- Event publishing system with ticket categories
- Event booking form that saves to backend and redirects to WhatsApp
- QR ticket page at /ticket/:bookingId
- Staff scan page at /scan — camera QR scanner + manual input, verifies tickets against backend, marks confirmed

The /scan page currently has NO authentication guard. Any visitor can access it.

## Requested Changes (Diff)

### Add
- `StaffAccount` Motoko type: id, username, passwordHash, role (GateStaff | EventManager | Admin), status (active | inactive), createdAt
- Backend functions: `createStaffAccount`, `getAllStaffAccounts`, `updateStaffAccountStatus`, `updateStaffAccountRole`, `deleteStaffAccount`, `staffLogin` (username + password → returns session token / bool + role)
- Simple password hashing using a deterministic approach (SHA-256-like via text encoding, since Motoko lacks a native bcrypt — store hashed passwords)
- `/staff/login` page: email/username field + password field, login button, on success saves staff session to localStorage, redirects to /scan
- `useStaffAuth` hook: reads staff session from localStorage, exposes `staffAccount`, `isAuthenticated`, `login(username, password)`, `logout()`
- Auth guard component `StaffProtectedRoute`: wraps /scan, redirects to /staff/login if not authenticated
- `/admin/staff` page: table of all staff accounts, Create Staff button (modal: username, password, role), activate/deactivate toggle, role selector, delete button
- Staff Management link in AdminLayout sidebar

### Modify
- `App.tsx`: add `/staff/login` route (public layout — no Navbar/Footer, standalone), add `/scan` route guard using `StaffProtectedRoute`
- Admin sidebar (`AdminLayout.tsx`): add "Staff" nav link → /admin/staff
- `ScanPage.tsx`: add logout button in header so staff can sign out after use; show logged-in staff name/role badge
- Backend `main.mo`: add StaffAccount data store and all staff functions

### Remove
- Nothing removed

## Implementation Plan

1. Update `main.mo` backend with StaffAccount type + all staff CRUD + staffLogin function (username+password check, returns staff info on success or traps on failure)
2. Regenerate `backend.d.ts` (TypeScript types will include new staff interfaces)
3. Create `useStaffAuth.ts` hook — manages staff session in localStorage (staffId, username, role, token)
4. Create `StaffProtectedRoute.tsx` component — checks useStaffAuth, if not authenticated redirects to /staff/login
5. Create `/staff/login` page — username/password form, calls backend staffLogin, on success stores session and navigates to /scan
6. Update `/scan` (ScanPage.tsx) — add staff session badge (name + role) and logout button in header
7. Create `/admin/staff` page — lists all staff accounts, create/edit/delete/toggle
8. Add admin Staff link to AdminLayout sidebar
9. Update App.tsx — add staff login route (standalone, no nav), wrap scan route in StaffProtectedRoute
10. Validate and deploy
