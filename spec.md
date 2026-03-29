# DMT Creatology — MVP Phase 18

## Current State
- All core booking modules (Events, Hotels, Transport, Venues, Food/Catering, QR Tickets, Razorpay, Staff Jobs, Rankings, Admin dashboard) are LIVE
- Frontend uses React + TanStack Router; backend is Motoko on ICP
- Staff auth pattern uses username/password hash stored in canister with localStorage session
- Missing: Organiser Dashboard, Event Builder, Admin Organisers management

## Requested Changes (Diff)

### Add
- **Backend:** `Organiser` type (id, username, passwordHash, name, email, status active/inactive)
- **Backend:** `organiserLogin(username, password)` → returns `{#ok: OrganiserSession} | {#err: Text}`
- **Backend:** `createOrganiser(...)` — admin only
- **Backend:** `updateOrganiser(...)` — admin only
- **Backend:** `deleteOrganiser(id)` — admin only
- **Backend:** `getAllOrganisers()` — admin only
- **Backend:** `createEventAsOrganiser(organiserId, ...eventFields)` — verifies organiser is active, creates draft event, tracks ownership in organiserEvents map
- **Backend:** `updateEventAsOrganiser(organiserId, eventId, ...fields)` — organiser can edit own events
- **Backend:** `publishEventAsOrganiser(organiserId, eventId)` — moves event to published status
- **Backend:** `getEventsByOrganiser(organiserId)` — public query
- **Frontend:** `/organiser/login` — standalone login page (no Navbar/Footer)
- **Frontend:** `/organiser` — dashboard (organiser's events with LIVE/DRAFT tabs, stats)
- **Frontend:** `/organiser/create-event` — 5-step event builder (BasicInfo → Description → Media → Tickets → Publish)
- **Frontend:** `/organiser/edit-event/$id` — edit existing draft event
- **Frontend:** `/admin/organisers` — admin creates/manages organiser accounts
- **Frontend:** Admin sidebar link for Organisers
- **Frontend:** useOrganiserAuth hook (mirrors useStaffAuth pattern)

### Modify
- Admin sidebar: add Organisers link
- App.tsx: add organiser routes to organiser route tree

### Remove
- Nothing

## Implementation Plan
1. Add Organiser + organiserEvents state + all organiser functions to main.mo (extend, do not modify existing)
2. Run generate_motoko_code to get updated backend.d.ts bindings
3. Build frontend: OrganiserLoginPage, OrganiserDashboard, OrganiserCreateEventPage, OrganiserEditEventPage, AdminOrganisersPage
4. Add useOrganiserAuth hook
5. Wire new routes in App.tsx
6. Add Organisers link to AdminLayout sidebar
7. Validate and deploy
