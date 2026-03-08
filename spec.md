# DMT Creatology

## Current State

The platform is at Version 11 and includes:
- Full public website with 14 pages including a static `/transport` page
- Admin dashboard with panels for Events, Hotels, Hotel Bookings, Vendors, Bookings, Payments, Users, Staff, Listings, Analytics, Configuration
- Hotel system: admin can create/edit/delete hotels with room types; public `/hotels` page shows live data; full hotel booking flow with Razorpay payment and confirmation page at `/hotel-confirmation/:bookingId`
- Event booking with QR ticket generation at `/ticket/:bookingId` and staff scanner at `/scan`
- Razorpay payment integration (test mode), payment transactions table in admin
- Staff login system at `/staff/login` protecting `/scan`
- Vendor marketplace with vendor registration, approval, and dashboard

The `/transport` page is currently static-only with hardcoded sample data and no backend connection.

## Requested Changes (Diff)

### Add

**Backend (Motoko):**
- `TransportOption` type: id, transportType (Car/Bus/Flight/Train/Helicopter/Cruise), operatorName, route, city, price, availableSeats, photoUrls, createdAt
- `TransportBooking` type: id, transportId, transportName, transportType, operatorName, route, passengerName, passengerPhone, passengerEmail, city, travelDate, seats, totalAmount, status (BookingStatus), paymentStatus (TransactionStatus), createdAt
- CRUD for TransportOption: createTransport (admin-only), updateTransport (admin-only), deleteTransport (admin-only), getAllTransports (public), getTransport (public)
- CRUD for TransportBooking: createTransportBooking (public), getAllTransportBookings (admin-only), getTransportBooking, updateTransportBookingStatus (admin-only), updateTransportBookingPaymentStatus

**Frontend:**
- `/admin/transport` — Admin page to add/edit/delete transport options with all fields including photo URLs
- `/admin/transport-bookings` — Admin panel showing all transport bookings with status management
- `/transport` — Updated public page that fetches live transport options from backend, falls back to static data; each card has a "Book Transport" button opening a booking modal
- Transport booking modal — multi-step: select route/date/seats → passenger details → Razorpay payment
- `/transport-confirmation/:bookingId` — Booking confirmation page after successful payment
- New hooks in `useAdminQueries.ts` for transport CRUD and booking management
- Admin sidebar: add "Transport" and "Transport Bookings" nav items
- `App.tsx`: add routes for `/admin/transport`, `/admin/transport-bookings`, `/transport-confirmation/:bookingId`

### Modify

- `TransportPage.tsx` — Replace static hardcoded categories with live data from backend; retain static fallback
- `AdminLayout.tsx` — Add "Transport" and "Transport Bookings" to NAV_ITEMS
- `App.tsx` — Register new routes for admin transport pages and transport confirmation page
- `useAdminQueries.ts` — Add transport-related hooks
- Backend `main.mo` — Add new transport types, state maps, ID counters, and functions

### Remove

Nothing removed. All existing systems untouched.

## Implementation Plan

1. Update `main.mo` to add TransportOption and TransportBooking types, state, and all CRUD/query functions
2. Add transport hooks to `useAdminQueries.ts`
3. Create `AdminTransportPage.tsx` (admin CRUD for transport options, mirrors AdminHotelsPage pattern)
4. Create `AdminTransportBookingsPage.tsx` (mirrors AdminHotelBookingsPage pattern)
5. Update `TransportPage.tsx` to fetch live transports and show booking modal per option
6. Create `TransportBookingModal.tsx` (3-step: details → passenger info → Razorpay payment)
7. Create `TransportConfirmationPage.tsx` (mirrors HotelConfirmationPage pattern)
8. Update `AdminLayout.tsx` to add Transport and Transport Bookings nav items
9. Update `App.tsx` to register all new routes
