# DMT Creatology

## Current State
Version 14 is live with: Events, QR tickets, Staff scanner auth, Vendor marketplace, Hotel booking engine, Transport booking, Razorpay payments, Rankings engine, Admin dashboard. The public `/staff-jobs` page shows hardcoded static job cards using the existing BookingModal.

## Requested Changes (Diff)

### Add
- `JobListing` type in backend: id, title, category (Security/Bouncer/Bartender/Technician/Driver/Volunteer/Hotel Staff), city, eventCompanyName, workDate, dailyWage, requiredStaffCount, description, status (active/inactive), createdAt
- `JobApplication` type in backend: id, jobId, jobTitle, fullName, phone, city, skills, experience, availableDates, status (pending/approved/rejected), createdAt
- Backend functions: createJobListing, updateJobListing, deleteJobListing, getAllJobListings, createJobApplication, getAllJobApplications, updateJobApplicationStatus
- Admin page `/admin/jobs` — create/edit/delete job listings
- Admin page `/admin/job-applications` — view all applications with status management
- Public `/staff-jobs` page updated to fetch live job listings from backend; each card has "Apply for Job" button opening an application modal
- Admin sidebar links: Jobs, Job Applications
- App.tsx routes: adminJobsRoute, adminJobApplicationsRoute

### Modify
- `StaffJobsPage.tsx` — replace static data with live backend fetch; replace BookingModal with a dedicated JobApplicationModal
- `AdminLayout.tsx` — add "Jobs" and "Job Applications" nav items
- `App.tsx` — register two new admin routes

### Remove
- Nothing removed

## Implementation Plan
1. Add JobListing and JobApplication types + all CRUD functions to `main.mo`
2. Create `AdminJobsPage.tsx` — table with add/edit/delete modals
3. Create `AdminJobApplicationsPage.tsx` — table with status dropdown
4. Create `JobApplicationModal.tsx` component — 6-field form, saves to backend
5. Update `StaffJobsPage.tsx` — fetch live listings, open JobApplicationModal on Apply
6. Update `AdminLayout.tsx` — add Jobs and Job Applications nav items
7. Update `App.tsx` — register new admin routes
