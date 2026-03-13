# DMT CREATOLOGY

## Current State
- Dark navy + gold color theme throughout the site
- Hero section shows generic "India's Premier Event & Entertainment Platform" headline
- No founder/leadership section
- No academy section
- No scroll animations, counter animations, or cinematic effects
- Gold text, gold buttons, gold gradients used everywhere
- Footer and navbar use gold accent colors

## Requested Changes (Diff)

### Add
- Founder & Leadership section below hero: profile card for Ujjwal Kapur (UK) — HR Manager at Sunburn Festival / VH1 Supersonic / IPL, National Sales Manager at Sunburn Festival Goa, Coverage: PAN INDIA
- DMT Creatology Academy section: India's No.1 Tuition Academy & Event Management Company, 100% Practical Training + Job Assistance, animated cards for Cooking Course and Event Management Course
- Scroll-triggered fade-in animations for all sections
- Counter animation (0 to value) for stats section
- Hero text fade-in + slide-up cinematic animation
- Red glow hover effect on buttons
- 3D hover lift effect on cards
- Subtle dark cinematic gradient background animation
- Business platform combination ticker/marquee: BookMyShow • WedMeGood • Cameo • Artist Celebrity Models Booking Engine • MakeMyTrip • OYO Hotels • MagicBricks • 99acres • Ola • Uber • RedBus • Flights Booking Engine (DMT – GDS AMADEUS) • Business Services Marketplace
- Services line section in hero area

### Modify
- Color theme: replace all gold/yellow with RED (#FF0000) as accent, BLACK (#000000) as background, WHITE (#FFFFFF) as text
- index.css: replace gold/navy tokens with red/black tokens; update background, primary, accent variables
- Hero headline: "BOOK ALL-IN-ONE ECOSYSTEM" (very large bold) with subtitle "(World 🌍 Top 100 Bookings Platform)"
- Hero subheadline: "Global Asset Booking & Marketplace Platform / All Assets Booking & Management Super Platform"
- Hero description: "You can book 100+ types of multi-billion dollar business industries products and services on one platform."
- Hero badge: change from "India's Premier Platform" to "DMT CREATOLOGY" as title
- Keep "Explore Events" and "Book Services" buttons but style them red background + white text
- Navbar: replace gold active/hover colors with red
- Footer: replace gold colors with red, update brand description
- All card hover effects: replace gold glow with red glow
- ServiceCard component: update badge/rating colors from gold to red
- Section "View All" links: change from gold to red
- CTA banner: change from gold to red

### Remove
- All yellow/gold color references from CSS variables, utility classes, and component styles
- Gold gradient buttons, gold text gradients

## Implementation Plan
1. Update `index.css`: redefine theme tokens (background → true black, primary/accent → red #FF0000), add animation keyframes (fadeSlideUp, countUp, redGlow, cinematicGradient, sectionFadeIn)
2. Update `HomePage.tsx`: new hero content, business ticker, services line, founder section, academy section, counter animation on stats, scroll animations on sections
3. Update `Navbar.tsx`: replace gold classes with red equivalents
4. Update `Footer.tsx`: replace gold classes with red equivalents  
5. Update `ServiceCard.tsx`: replace gold badge/rating with red
