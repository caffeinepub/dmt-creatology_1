# DMT Creatology

## Current State

The public "Book Now" form (`BookingModal.tsx`) collects Name, Phone, City, Service, Date, and Message. On submit, it only redirects the user to WhatsApp — no data is saved to the backend. The backend already has a `createBookingRequest` function that accepts all required fields and stores them with a `createdAt` timestamp and `#new` status. The Admin Bookings panel (`AdminBookingsPage.tsx`) fetches and displays bookings from the backend using `useAllBookings`. There is a `useAdminQueries.ts` hook file with React Query mutations for admin actions, but no public-facing mutation for creating a booking.

## Requested Changes (Diff)

### Add
- A `useCreateBookingRequest` React Query mutation hook in `useAdminQueries.ts` (or a new `useBookingMutations.ts`) that calls `actor.createBookingRequest(...)` using an anonymous actor (no auth required, public).
- Saving logic in `BookingModal.tsx`: on form submit, call `createBookingRequest` first, then (regardless of backend result) proceed with the WhatsApp redirect so the user experience is unaffected.
- Loading state in the submit button while the backend call is in flight.
- Error handling that silently falls back to WhatsApp redirect if the backend call fails (so public UX is never broken).

### Modify
- `BookingModal.tsx`: update `handleSubmit` to call the backend mutation before opening WhatsApp. The date field (string from `<input type="date">`) must be converted to a `bigint` nanosecond timestamp for the backend. Keep all existing form fields and UI unchanged.

### Remove
- Nothing removed.

## Implementation Plan

1. Add `useCreateBookingRequest` mutation to `useAdminQueries.ts`. It uses `useActor` (anonymous actor works for public calls) and calls `actor.createBookingRequest(name, phone, serviceType, city, dateNs, message)`.
2. In `BookingModal.tsx`, import and use `useCreateBookingRequest`. In `handleSubmit`:
   a. Convert the date string to nanoseconds bigint: `BigInt(new Date(form.date).getTime()) * 1_000_000n` (use 0n if date is empty).
   b. Call `mutateAsync(...)` wrapped in try/catch — always proceed to WhatsApp redirect after.
   c. Show a loading spinner on the submit button while the call is pending.
3. No changes to public page layouts, service cards, or any admin pages.
