# DMT Creatology

## Current State
The platform has a full static + dynamic hybrid website including:
- 14 public pages (Home, Events, Hotels, Food, Venues, Transport, Vendors, Artists, Staff Jobs, Digital Products, Business Services, Rankings, Advertise, Contact)
- Admin dashboard at /admin with: Events, Vendors, Bookings, Payments, Users, Staff, Listings, Analytics, Configuration panels
- Backend Motoko canister with: Events, Vendors, Bookings, Users, Listings, VendorApplications, ServiceListings, TicketCategories, EventBookings, StaffAccounts, PaymentTransactions
- Public /hotels page currently shows only static hardcoded sample data (no backend connection)
- No hotel management system in the admin panel

## Requested Changes (Diff)

### Add
- `Hotel` type in the Motoko backend with fields: id, name, city, address, description, roomTypes (array of {name, pricePerNight}), amenities (array of Text), photoUrls (array of Text), createdAt
- Backend functions: createHotel, updateHotel, deleteHotel, getAllHotels, getPublicHotels (always returns all hotels)
- Admin page `/admin/hotels` — full CRUD for hotels with:
  - Hotel list table showing name, city, price, action buttons
  - Add/Edit modal with all fields (name, city, address, description, room types with price, amenities, photo URLs)
  - Delete confirmation dialog
- "Hotels" nav link in AdminLayout sidebar
- Updated public `/hotels` page: fetches live hotels from backend, falls back to static samples when empty, each card shows hotel name, city, price per night, amenities icons, and a "Book Hotel" button (opens existing BookingModal with hotel name pre-filled as service type)

### Modify
- `main.mo` — add Hotel type, hotelId counter, hotels store, and hotel CRUD functions
- `AdminLayout.tsx` — add Hotels nav item pointing to /admin/hotels
- `App.tsx` — add adminHotelsRoute under adminLayoutRoute
- `HotelsPage.tsx` — replace static array with live backend data, keep fallback sample data, update card rendering to match backend hotel structure

### Remove
- Nothing removed; purely additive changes
