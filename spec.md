# DMT Creatology — Phase 14: India Top 100 Rankings Engine

## Current State

Version 13 is live with the following modules all intact and working:
- Public static website (14 pages)
- Event creation + ticket booking + QR ticket generation
- Staff scanner with authentication
- Vendor self-registration + approval flow
- Hotel listing management + hotel booking engine
- Transport listing management + transport booking
- Razorpay payment integration
- Admin dashboard with full management panels (events, vendors, hotels, transport, bookings, staff, payments, config)
- `/rankings` page exists but is fully static (hardcoded sample data only, no backend, no voting)

## Requested Changes (Diff)

### Add
- **RankingProfile** backend type: id, name, city, category, photoUrl, description, rating (float as Nat*100), totalVotes, adminScore, linkedVendorId (optional), createdAt
- **VoteRecord** backend type: id, profileId, voterIdentifier (IP/session hash), votedAt — one vote per profile per voter per day
- Backend function: `createRankingProfile` (admin only)
- Backend function: `updateRankingProfile` (admin only)
- Backend function: `deleteRankingProfile` (admin only)
- Backend function: `getAllRankingProfiles` (public query)
- Backend function: `getRankingProfilesByCategory` (public query)
- Backend function: `voteForProfile(profileId, voterIdentifier)` — checks duplicate vote per day, increments totalVotes, returns ok/err
- Backend function: `getVoteCount(profileId)` (admin query)
- Backend function: `adjustAdminScore(profileId, score)` (admin only)
- Backend function: `linkVendorToProfile(profileId, vendorId)` (admin only)
- **Public `/rankings` page** — replace static page with live backend data; tab categories: Top DJs, Top Event Photographers, Top Makeup Artists, Top Event Planners, Top Wedding Venues, Top Hotels, Top Caterers, Top Music Artists, Top Production Companies, Top Event Management Companies; leaderboard cards with profile photo, name, city, category, rating, total votes, Vote button; voting sends voterIdentifier (fingerprint from localStorage UUID + IP hash)
- **Admin `/admin/rankings` page** — add/edit/delete profiles, view vote counts, manually adjust admin score, link vendor marketplace profile; "Rankings" link in admin sidebar

### Modify
- `/rankings` public page — replace all static hardcoded data with live backend queries; keep the same layout and tab structure but replace 5 old categories with the 10 new specified categories
- Admin sidebar — add "Rankings" nav link

### Remove
- Hardcoded `rankingData` static object from `RankingsPage.tsx` (replaced by backend data)

## Implementation Plan

1. Add `RankingProfile`, `VoteRecord` types and counter variables to `main.mo`
2. Add backend functions: createRankingProfile, updateRankingProfile, deleteRankingProfile, getAllRankingProfiles, getRankingProfilesByCategory, voteForProfile, getVoteCount, adjustAdminScore, linkVendorToProfile
3. Vote spam prevention: voterIdentifier is a string (localStorage UUID + client IP hash); backend checks if same voterIdentifier voted for same profileId within the same calendar day (nanosecond timestamp divided to day bucket)
4. Ranking order: profiles sorted by computed score = (totalVotes * 0.6) + (adminScore * 0.4), descending
5. Frontend: New `AdminRankingsPage.tsx` at `/admin/rankings` with add/edit/delete profile form modal, vote count column, admin score input, vendor link dropdown
6. Frontend: Rewrite `RankingsPage.tsx` to fetch from `getAllRankingProfiles`, group by category into 10 tabs, render leaderboard cards with Vote button that calls `voteForProfile`
7. Wire new admin route in `App.tsx` and add sidebar link in `AdminLayout`
8. No modifications to any existing module files
