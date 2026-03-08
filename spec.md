# DMT Creatology

## Current State

Version 10 is live with:
- Full public website with 14 pages
- Admin dashboard (events, vendors, bookings, users, listings, analytics, staff, payments, config, hotels)
- Hotel management: Admin can create/edit/delete hotels with room types, amenities, photo URLs
- Public /hotels page fetches live hotels from backend and shows them with a generic "Book Hotel" button that opens a standard WhatsApp booking form
- Existing Razorpay payment flow works for event bookings
- PaymentModal component handles Razorpay checkout + saves PaymentTransaction to backend
- Event bookings flow: select ticket → EventBookingModal → PaymentModal → TicketPage
- Backend has Hotel, RoomType, EventBooking, PaymentTransaction types

## Requested Changes (Diff)

### Add
- `HotelBooking` type in Motoko backend with fields: id, hotelId, hotelName, roomType, guestName, guestPhone, guestEmail, checkInDate, checkOutDate, totalAmount, status (BookingStatus), paymentStatus (TransactionStatus), createdAt
- Backend functions: `createHotelBooking`, `getAllHotelBookings`, `updateHotelBookingStatus`, `getHotelBooking`
- `HotelBookingModal` frontend component: multi-step modal (1: room type + dates, 2: guest details, 3: Razorpay payment via existing PaymentModal pattern, 4: confirmation)
- `/hotel-confirmation/:bookingId` page: shows booking confirmation with details (no QR needed, just a styled confirmation card)
- `/admin/hotel-bookings` page: table showing all hotel bookings with hotel name, room type, guest name, check-in, check-out, payment status, booking status
- Hotel Bookings link in admin sidebar

### Modify
- `HotelsPage`: wire "Book Hotel" button on live hotel cards to open the new `HotelBookingModal` (passing hotel data + room types)
- `useAdminQueries.ts`: add hooks `useCreateHotelBooking`, `useAllHotelBookings`, `useUpdateHotelBookingStatus`
- `App.tsx`: add `/hotel-confirmation/:bookingId` public route and `/admin/hotel-bookings` admin route
- `AdminLayout.tsx`: add "Hotel Bookings" nav item pointing to `/admin/hotel-bookings`

### Remove
- Nothing removed

## Implementation Plan

1. Add `HotelBooking` type and CRUD functions to `main.mo` (createHotelBooking, getAllHotelBookings, updateHotelBookingStatus, getHotelBooking)
2. Add hotel booking hooks to `useAdminQueries.ts`
3. Create `HotelBookingModal.tsx` — multi-step: room+dates → guest details → Razorpay payment (reusing existing PaymentModal Razorpay logic inline) → redirect to /hotel-confirmation/:id
4. Update `HotelsPage.tsx` live hotel cards to use `HotelBookingModal` instead of generic `BookingModal`
5. Create `HotelConfirmationPage.tsx` at `/hotel-confirmation/:bookingId`
6. Create `AdminHotelBookingsPage.tsx` at `/admin/hotel-bookings`
7. Add hotel-bookings route to `App.tsx` and add nav item to `AdminLayout.tsx`
