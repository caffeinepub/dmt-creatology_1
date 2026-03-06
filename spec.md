# DMT Creatology

## Current State
New project. No existing pages or components.

## Requested Changes (Diff)

### Add
- 14-page static website: Home, Events, Hotels, Food, Venues, Transport, Vendors, Artists, Staff Jobs, Digital Products, Business Services, Rankings, Advertise, Contact
- Top navigation bar with links to all pages
- Footer with contact info (WhatsApp numbers, UPI/Google Pay payment instructions)
- Card-based sample listings on every page (with placeholder images and short descriptions)
- "Book Now" button on each card that opens a modal booking form
- Booking form fields: Name, Phone, City, Service, Date, Message
- On form submit, redirect to WhatsApp with pre-filled booking message (rotates or shows all 3 numbers: +91 9317906033, +91 9821432904, +91 8626880603)
- Payment instructions section (UPI / Google Pay: 9821432904)
- Mobile-responsive design

### Modify
- Nothing (new project)

### Remove
- Nothing

## Implementation Plan
1. Build a React SPA with React Router for 14 pages
2. Create shared Navbar component with mobile hamburger menu
3. Create shared Footer component with contact details and payment info
4. Create reusable ServiceCard component with image, title, description, Book Now button
5. Create BookingModal component with the 6-field form; on submit construct WhatsApp message and open wa.me link
6. Populate each page with 4-6 sample cards using relevant category data
7. Home page: hero section + category highlights + featured cards from multiple sections
8. Rankings page: leaderboard-style cards
9. Advertise page: listing plans and ad plans with pricing
10. Contact page: WhatsApp buttons, payment QR placeholder, contact details
11. Apply mobile-responsive Tailwind CSS throughout
12. Add deterministic data-ocid markers to all interactive elements
