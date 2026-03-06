# DMT Creatology

## Current State

Phase 1 is a fully static React frontend with 14 public pages (Home, Events, Hotels, Food, Venues, Transport, Vendors, Artists, Staff Jobs, Digital Products, Business Services, Rankings, Advertise, Contact). Each page displays card-style sample listings with Book Now buttons that open a WhatsApp-redirect booking form. The backend is a minimal Motoko actor with only a `ping()` function. There are no user accounts, authentication, or data persistence.

## Requested Changes (Diff)

### Add

- **Admin authentication**: Secure login at `/admin/login` with hardcoded credentials (username: admin, password: MindMatrix). Session stored client-side using backend-issued session token.
- **Admin dashboard layout**: Sidebar navigation with 6 sections, accessible only when authenticated. Public Navbar/Footer must NOT appear on admin pages.
- **Event creation panel**: Form to create events (name, category, venue, city, date, time, description, poster URL, ticket categories). Events stored in backend and retrievable for public pages.
- **Vendor management**: List all vendors, approve/reject/suspend vendor accounts, view vendor details.
- **Booking requests list**: View all booking form submissions (name, phone, service, city, date, message, timestamp). Mark bookings as reviewed/confirmed/cancelled.
- **User management**: List registered users (name, phone, role, status), ability to activate/deactivate accounts.
- **Listings approval system**: Queue of pending listings submitted by vendors/users. Admin can approve or reject each listing.
- **Basic analytics panel**: Summary cards showing total events, total bookings, total vendors, total users, and a simple recent-activity feed.
- **Backend data models**: Motoko types and stable storage for Events, Vendors, BookingRequests, Users, Listings.
- **Backend API**: CRUD endpoints for all five data types plus admin authentication (`adminLogin`, `getAdminSession`).

### Modify

- **App.tsx**: Add `/admin` route subtree that renders an `AdminLayout` (no public Navbar/Footer). Admin pages are nested under this layout. All existing public routes remain unchanged.
- **Backend main.mo**: Expanded with admin auth, event, vendor, booking, user, and listing management functions.

### Remove

Nothing removed from the existing public website.

## Implementation Plan

1. Expand `main.mo` with stable variables and functions for: admin auth (session tokens), Events CRUD, Vendors CRUD, BookingRequests (create + list + status update), Users CRUD, Listings (create + approve/reject).
2. Regenerate `backend.d.ts` bindings.
3. Create `AdminLayout` component — sidebar + header, no public Navbar/Footer, route guard redirecting unauthenticated users to `/admin/login`.
4. Create `AdminLoginPage` at `/admin/login`.
5. Create `AdminDashboardPage` (analytics overview — counts + recent activity).
6. Create `AdminEventsPage` — event list + create event form/modal.
7. Create `AdminVendorsPage` — vendor list with approve/reject/suspend actions.
8. Create `AdminBookingsPage` — booking requests list with status controls.
9. Create `AdminUsersPage` — user list with activate/deactivate controls.
10. Create `AdminListingsPage` — pending listings queue with approve/reject actions.
11. Wire all admin routes into `App.tsx` under `/admin` prefix, keeping all existing public routes intact.
