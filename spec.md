# DMT Creatology — Phase 3: Vendor Marketplace

## Current State

The platform has:
- A full 14-page public static website (Home, Events, Hotels, Food, Venues, Transport, Vendors, Artists, Staff Jobs, Digital Products, Business Services, Rankings, Advertise, Contact)
- An admin dashboard at `/admin` with: Events, Vendors, Bookings, Users, Listings, Analytics panels
- A live booking system: public Book Now form saves to backend with status "Pending", visible in Admin → Bookings
- Backend Vendor type: id, name, businessName, city, services, experience, phone, email, status (pending/approved/rejected/suspended), createdAt
- `createVendor` is admin-only. No public vendor registration exists.
- `getAllVendors` is admin-only. The public Vendors page uses hardcoded static data.
- Authorization component installed (Internet Identity login for admin)

## Requested Changes (Diff)

### Add

1. **VendorApplication type** in backend: businessName, ownerName, city, serviceCategory, description, phone, email, portfolioImages (array of text URLs), status (pending/approved/rejected), createdAt, principal (submitter)
2. **ServiceListing type** in backend: id, vendorId (principal), title, category, description, price, createdAt
3. **Backend functions**:
   - `submitVendorApplication(...)` — public, no auth required, saves with status pending
   - `getMyVendorApplication()` — caller-only, returns their own application
   - `updateMyVendorApplication(...)` — caller can update their own pending application
   - `getAllVendorApplications()` — admin only
   - `reviewVendorApplication(id, status)` — admin only, approve/reject
   - `getApprovedVendors()` — public query, returns only approved vendor applications
   - `addServiceListing(title, category, description, price)` — authenticated vendor only (must have approved application)
   - `updateServiceListing(id, title, category, description, price)` — vendor can update their own listings
   - `deleteServiceListing(id)` — vendor can delete their own listings
   - `getMyServiceListings()` — returns service listings for caller's vendor
   - `getBookingsForMyVendor()` — returns bookings where serviceType matches vendor's serviceCategory
4. **Public Vendor Signup page** at `/vendor/register`:
   - Form fields: Business name, Owner name, City, Service category (dropdown), Description, Phone, Email, Portfolio images (up to 5 image URLs or file upload)
   - Submits to `submitVendorApplication`
   - Shows success confirmation with next steps message
5. **Vendor Dashboard** at `/vendor/dashboard`:
   - Requires Internet Identity login (same auth system as admin)
   - Tabs: Profile, Services, Bookings
   - Profile tab: shows current application status (pending/approved/rejected), edit form if pending or approved
   - Services tab: add/edit/delete service listings with title, category, description, price
   - Bookings tab: list of bookings related to their service category
6. **Vendor Login page** at `/vendor/login`:
   - Internet Identity login button
   - Redirects to `/vendor/dashboard` on success
7. **Public Vendors page update**: Replace hardcoded static data with live data from `getApprovedVendors()`. Show "Register as Vendor" CTA button linking to `/vendor/register`. Maintain existing card layout.
8. **Admin Vendors page update**: Show vendor applications (not just legacy vendor records). Show all fields including email, phone, serviceCategory, description. Approve/reject actions call `reviewVendorApplication`.

### Modify

- `VendorsPage.tsx`: Replace static vendor array with live `getApprovedVendors()` data. Add "Become a Vendor" CTA at top of page.
- `AdminVendorsPage.tsx`: Extend to display vendor applications with full details and approve/reject controls.
- `App.tsx`: Add routes for `/vendor/login`, `/vendor/register`, `/vendor/dashboard`.

### Remove

- Nothing removed. All existing public pages and admin panels remain unchanged.

## Implementation Plan

1. Extend `main.mo` with VendorApplication and ServiceListing types and all new backend functions
2. Select `blob-storage` component for portfolio image uploads
3. Regenerate `backend.d.ts` via `generate_motoko_code`
4. Create `VendorRegisterPage.tsx` — public signup form
5. Create `VendorLoginPage.tsx` — Internet Identity login
6. Create `VendorDashboardPage.tsx` — vendor authenticated area with 3 tabs
7. Update `VendorsPage.tsx` — fetch live approved vendors, add CTA
8. Update `AdminVendorsPage.tsx` — show vendor applications with full review controls
9. Update `App.tsx` — add vendor routes under a new vendor router (same pattern as admin)
10. Add `useVendorQueries.ts` hook file for React Query integration
11. Validate (typecheck + lint + build), fix errors
