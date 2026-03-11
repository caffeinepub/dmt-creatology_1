# DMT Creatology — Phase 16: Venue Booking System

## Current State
- `/venues` (VenuesPage.tsx) is a fully static page with hardcoded venue cards and no backend connection.
- No venue management exists in the admin panel.
- Admin sidebar has nav items for Hotels, Transport, Jobs but not Venues.
- The App.tsx routing has `/venues` route pointing to the static VenuesPage.
- Backend has Hotel, HotelBooking, TransportBooking patterns to follow.
- All other modules (Events, Hotels, Transport, Vendor, Rankings, Staff Jobs, QR, Payments) remain untouched.

## Requested Changes (Diff)

### Add
- `Venue` type in backend: id, name, city, capacity, pricePerDay, photoUrls, amenities, description, createdAt
- `VenueBooking` type: id, venueId, venueName, eventDate, eventDetails, guestName, guestPhone, guestEmail, totalAmount, status, paymentStatus, createdAt
- Backend functions: createVenue, updateVenue, deleteVenue, getAllVenues, getVenue
- Backend functions: createVenueBooking, getAllVenueBookings, getVenueBooking, updateVenueBookingStatus, updateVenueBookingPaymentStatus
- Public `/venues` page — dynamic, fetches from backend, shows venue cards with Book Venue button
- `VenueBookingModal` component — 3-step: (1) Select date, (2) Enter event details, (3) Razorpay payment
- `/venue-confirmation/:bookingId` page — shows booking confirmation with all details
- `/admin/venues` page — CRUD for venue listings (add/edit/delete)
- `/admin/venue-bookings` page — table of all venue bookings with status management
- Admin sidebar nav items: "Venues" and "Venue Bookings"
- Routes in App.tsx: venueConfirmationRoute, adminVenuesRoute, adminVenueBookingsRoute

### Modify
- `VenuesPage.tsx` — replace static hardcoded data with backend fetch; add Book Venue button per card
- `AdminLayout.tsx` — add Venues and Venue Bookings nav items
- `App.tsx` — add venueConfirmationRoute, adminVenuesRoute, adminVenueBookingsRoute
- `backend/main.mo` — add Venue and VenueBooking types + all CRUD functions

### Remove
- Static hardcoded venue array from VenuesPage.tsx

## Implementation Plan
1. Extend backend main.mo with Venue + VenueBooking types and all CRUD/query functions
2. Create AdminVenuesPage.tsx — add/edit/delete venue listings
3. Create AdminVenueBookingsPage.tsx — list bookings, update status
4. Create VenueBookingModal.tsx — 3-step booking flow with Razorpay
5. Create VenueConfirmationPage.tsx — post-booking confirmation
6. Rewrite VenuesPage.tsx — live data from backend, Book Venue button per card
7. Update AdminLayout.tsx — insert Venues + Venue Bookings nav items after Transport Bookings
8. Update App.tsx — add all new routes
