import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { FALLBACK_IMAGES } from "@/lib/fallbackImages";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Calendar,
  ChefHat,
  Clapperboard,
  MapPin,
  Star,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const HERO_IMG = FALLBACK_IMAGES.event;
const HOTEL_IMG = FALLBACK_IMAGES.hotel;
const FOOD_IMG = FALLBACK_IMAGES.food;
const VENUE_IMG = FALLBACK_IMAGES.venue;
const ARTIST_IMG = FALLBACK_IMAGES.artist;
const TRANSPORT_IMG = FALLBACK_IMAGES.transport;

const statsData = [
  { icon: Users, label: "Happy Clients", value: 50000, suffix: "+" },
  { icon: Calendar, label: "Events Managed", value: 5000, suffix: "+" },
  { icon: MapPin, label: "Cities Covered", value: 100, suffix: "+" },
  { icon: Star, label: "5-Star Reviews", value: 12000, suffix: "+" },
];

const services = [
  {
    title: "Event Ticket Booking",
    sub: "",
  },
  {
    title: "Wedding & Party Service Booking",
    sub: "Venue | Catering | DJ | Photographer | Makeup Artist | Decoration | Lighting | Sound",
  },
  {
    title: "Artist & Celebrity Booking",
    sub: "DJ's | Singers | Music Bands | Comedians | Anchors / Hosts | Dancers | Influencers | Celebrities | Models",
  },
  {
    title: "Studio & Production Booking",
    sub: "",
  },
  {
    title: "Creator Services",
    sub: "",
  },
  {
    title: "Travel & Experience Booking",
    sub: "",
  },
  {
    title: "Hotels • Venues • Artists • Transport • Business Services",
    sub: "",
  },
];

const TICKER_TEXT =
  "BookMyShow  •  WedMeGood  •  Cameo  •  Artist Celebrity Models Booking Engine  •  MakeMyTrip  •  OYO Hotels  •  MagicBricks  •  99acres  •  Ola  •  Uber  •  RedBus  •  Flights Booking Engine (DMT – GDS AMADEUS)  •  Business Services Marketplace";

const featuredEvents = [
  {
    title: "Sunburn Arena Mumbai",
    subtitle: "Mumbai, Maharashtra",
    description:
      "India's biggest EDM festival returns with world-class DJs and spectacular production.",
    details: "₹2,000 onwards",
    service: "Sunburn Arena Mumbai Event",
    badge: "FEATURED",
    rating: 4.9,
  },
  {
    title: "NH7 Weekender Pune",
    subtitle: "Pune, Maharashtra",
    description:
      "Multi-genre music festival across multiple stages with indie, folk and electronic acts.",
    details: "₹1,500 onwards",
    service: "NH7 Weekender Pune Event",
    badge: "TRENDING",
    rating: 4.8,
  },
  {
    title: "Bollywood Night Delhi",
    subtitle: "Delhi",
    description:
      "A spectacular evening of Bollywood hits with celebrity performances and dance.",
    details: "₹1,200 onwards",
    service: "Bollywood Night Delhi",
    rating: 4.7,
  },
];

const popularHotels = [
  {
    title: "The Grand Palace Mumbai",
    subtitle: "Mumbai, Maharashtra",
    description: "5-star luxury with ocean views, spa, and world-class dining.",
    details: "₹5,000/night",
    service: "The Grand Palace Mumbai Hotel",
    rating: 4.9,
  },
  {
    title: "Taj Residency Delhi",
    subtitle: "Delhi",
    description:
      "Heritage elegance meets modern luxury in the heart of the capital.",
    details: "₹8,000/night",
    service: "Taj Residency Delhi Hotel",
    badge: "LUXURY",
    rating: 4.8,
  },
  {
    title: "Luxury Suites Goa",
    subtitle: "Goa",
    description:
      "Beachside suites with private pools, sunset views, and premium amenities.",
    details: "₹6,500/night",
    service: "Luxury Suites Goa Hotel",
    rating: 4.7,
  },
];

const foodItems = [
  {
    title: "Royal Caterers Mumbai",
    subtitle: "Mumbai",
    description:
      "Premium event catering with authentic Indian cuisine for 50-5000 guests.",
    details: "₹500/plate",
    service: "Royal Caterers Mumbai Catering",
    badge: "POPULAR",
    rating: 4.8,
  },
  {
    title: "Spice Garden Restaurant Delhi",
    subtitle: "Delhi",
    description:
      "Award-winning restaurant specializing in North Indian and Mughlai cuisine.",
    details: "₹800-1500/head",
    service: "Spice Garden Restaurant Delhi",
    rating: 4.7,
  },
  {
    title: "The Food Truck Co.",
    subtitle: "Bangalore",
    description:
      "Trendy food trucks for corporate events, weddings, and street festivals.",
    details: "₹300-600/plate",
    service: "The Food Truck Co. Bangalore",
    rating: 4.6,
  },
];

const venues = [
  {
    title: "Grand Ballroom Mumbai",
    subtitle: "Mumbai",
    description:
      "Magnificent 1000-capacity ballroom for weddings, galas, and corporate events.",
    details: "Capacity: 1,000",
    service: "Grand Ballroom Mumbai Venue",
    badge: "PREMIUM",
    rating: 4.9,
  },
  {
    title: "Skyline Terrace Bangalore",
    subtitle: "Bangalore",
    description:
      "Stunning rooftop terrace with city panorama for intimate gatherings.",
    details: "Capacity: 300",
    service: "Skyline Terrace Bangalore Venue",
    rating: 4.7,
  },
  {
    title: "Beach Venue Goa",
    subtitle: "Goa",
    description:
      "Breathtaking beachside venue perfect for destination weddings and parties.",
    details: "Capacity: 400",
    service: "Beach Venue Goa",
    rating: 4.8,
  },
];

const artists = [
  {
    title: "DJ Arjun Singh",
    subtitle: "Mumbai",
    description:
      "Top-rated DJ with 10+ years of experience in EDM, Bollywood, and Fusion music.",
    details: "₹50,000/event",
    service: "DJ Arjun Singh Performance",
    badge: "TOP RATED",
    rating: 5.0,
  },
  {
    title: "Priya Sharma",
    subtitle: "Delhi",
    description:
      "Professional model and brand ambassador for luxury and fashion events.",
    details: "₹25,000/event",
    service: "Priya Sharma Model Booking",
    rating: 4.9,
  },
  {
    title: "Raaga Band",
    subtitle: "Pune",
    description:
      "6-piece fusion band blending classical Indian with contemporary sounds.",
    details: "₹80,000/event",
    service: "Raaga Band Performance",
    rating: 4.8,
  },
];

const transportItems = [
  {
    title: "Luxury Car Rental",
    subtitle: "Pan India",
    description:
      "Mercedes, BMW, and Audi fleet with professional chauffeurs for events.",
    details: "₹5,000/day",
    service: "Luxury Car Rental Service",
    badge: "PREMIUM",
    rating: 4.8,
  },
  {
    title: "Party Bus Service",
    subtitle: "Mumbai, Delhi",
    description:
      "Fully equipped party buses with sound systems for group celebrations.",
    details: "₹15,000/event",
    service: "Party Bus Service",
    rating: 4.7,
  },
  {
    title: "Yacht Rental Goa",
    subtitle: "Goa",
    description:
      "Luxury yacht experiences for private parties and corporate outings.",
    details: "₹50,000/day",
    service: "Yacht Rental Goa",
    badge: "EXCLUSIVE",
    rating: 4.9,
  },
];

// ── Animated counter hook ──
function useCounter(target: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [active, target]);
  return count;
}

// ── Section animate hook ──
function useSectionAnimation() {
  useEffect(() => {
    const els = document.querySelectorAll(".section-animate");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        }
      },
      { threshold: 0.1 },
    );
    for (const el of els) observer.observe(el);
    return () => observer.disconnect();
  }, []);
}

// ── Stat Counter Item ──
function StatItem({
  icon: Icon,
  label,
  value,
  suffix,
  active,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  suffix: string;
  active: boolean;
}) {
  const count = useCounter(value, active);
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-red-600/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-red-500" />
      </div>
      <div>
        <p className="font-display font-black text-xl text-white">
          {count.toLocaleString()}
          {suffix}
        </p>
        <p className="text-white/50 text-xs">{label}</p>
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  subtitle: string;
  viewAllPath: string;
  children: React.ReactNode;
}

function Section({ title, subtitle, viewAllPath, children }: SectionProps) {
  return (
    <section className="py-12 section-animate">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display font-black text-2xl md:text-3xl text-white">
              {title}
            </h2>
            <p className="text-white/50 text-sm mt-1">{subtitle}</p>
          </div>
          <Link
            to={viewAllPath}
            className="flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors text-sm font-medium shrink-0"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {children}
      </div>
    </section>
  );
}

export default function HomePage() {
  useSectionAnimation();

  // Stats counter activation via intersection observer
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsActive, setStatsActive] = useState(false);
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="bg-black">
      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt="DMT Creatology Events"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
          {/* Cinematic vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
            }}
          />
        </div>

        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl">
            {/* Title badge */}
            <div
              className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/40 rounded-full px-4 py-1.5 mb-4"
              style={{
                animationDelay: "0.1s",
                opacity: 0,
                animation: "fadeSlideUp 0.8s ease-out 0.1s forwards",
              }}
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-500 text-xs font-black uppercase tracking-widest">
                DMT CREATOLOGY
              </span>
            </div>

            {/* Main headline */}
            <h1
              className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-none mb-4 uppercase"
              style={{
                opacity: 0,
                animation: "fadeSlideUp 0.8s ease-out 0.3s forwards",
              }}
            >
              BOOK{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #ff0000 0%, #ff4444 60%, #ff6666 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                ALL-IN-ONE
              </span>
              <br />
              ECOSYSTEM
            </h1>

            {/* World ranking */}
            <p
              className="text-white/70 text-base md:text-lg font-medium mb-4 tracking-wide"
              style={{
                opacity: 0,
                animation: "fadeSlideUp 0.8s ease-out 0.45s forwards",
              }}
            >
              🌍 World Top 100 Bookings Platform
            </p>

            {/* Subheadlines */}
            <div
              className="mb-4 space-y-1"
              style={{
                opacity: 0,
                animation: "fadeSlideUp 0.8s ease-out 0.5s forwards",
              }}
            >
              <p className="text-white text-xl md:text-2xl font-bold">
                Global Asset Booking & Marketplace Platform
              </p>
              <p className="text-white/80 text-lg md:text-xl">
                All Assets Booking & Management Super Platform
              </p>
            </div>

            {/* Description */}
            <p
              className="text-white/60 text-base md:text-lg max-w-2xl mb-8 leading-relaxed"
              style={{
                opacity: 0,
                animation: "fadeSlideUp 0.8s ease-out 0.7s forwards",
              }}
            >
              You can book 100+ types of multi-billion dollar business
              industries products and services on one platform.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-wrap gap-4"
              style={{
                opacity: 0,
                animation: "fadeSlideUp 0.8s ease-out 0.9s forwards",
              }}
            >
              <Button
                asChild
                size="lg"
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-base px-8 btn-red-glow transition-all"
                data-ocid="hero.primary_button"
              >
                <Link to="/events">Explore Events</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-red-600/10 hover:border-red-500/50 text-base px-8 transition-all"
                data-ocid="hero.secondary_button"
              >
                <Link to="/vendors">Book Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Business Platform Ticker ── */}
      <div className="bg-[#0a0a0a] border-y border-red-600/30 py-3 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="text-white/70 text-sm font-medium px-8">
            {TICKER_TEXT}
          </span>
          <span className="text-white/70 text-sm font-medium px-8" aria-hidden>
            {TICKER_TEXT}
          </span>
        </div>
      </div>

      {/* ── Services Grid ── */}
      <section className="py-12 bg-black section-animate">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-black text-2xl md:text-3xl text-white mb-2 text-center">
            What We Offer
          </h2>
          <p className="text-white/50 text-sm text-center mb-8">
            100+ business categories on one platform
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((svc, i) => (
              <div
                key={svc.title}
                className="card-3d-hover bg-[#111] border border-red-600/20 hover:border-red-600/50 rounded-xl p-5 transition-colors"
                data-ocid={`services.item.${i + 1}`}
              >
                <div className="w-2 h-2 rounded-full bg-red-500 mb-3" />
                <h3 className="text-white font-bold text-sm leading-snug">
                  {svc.title}
                </h3>
                {svc.sub && (
                  <p className="text-white/40 text-xs mt-2 leading-relaxed">
                    {svc.sub}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section
        ref={statsRef}
        className="py-10 border-y border-white/5 bg-[#0a0a0a] section-animate"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statsData.map((stat) => (
              <StatItem
                key={stat.label}
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                active={statsActive}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Events ── */}
      <Section
        title="Featured Events"
        subtitle="Handpicked events across India"
        viewAllPath="/events"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map((item, i) => (
            <ServiceCard
              key={item.title}
              {...item}
              image={HERO_IMG}
              fallbackSrc={FALLBACK_IMAGES.event}
              index={i + 1}
            />
          ))}
        </div>
      </Section>

      <div className="border-t border-white/5 mx-4" />

      {/* ── Popular Hotels ── */}
      <Section
        title="Popular Hotels"
        subtitle="Luxury stays for every occasion"
        viewAllPath="/hotels"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularHotels.map((item, i) => (
            <ServiceCard
              key={item.title}
              {...item}
              image={HOTEL_IMG}
              fallbackSrc={FALLBACK_IMAGES.hotel}
              index={i + 1}
            />
          ))}
        </div>
      </Section>

      <div className="border-t border-white/5 mx-4" />

      {/* ── Food & Beverage ── */}
      <Section
        title="Food & Beverage"
        subtitle="Catering and dining experiences"
        viewAllPath="/food"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {foodItems.map((item, i) => (
            <ServiceCard
              key={item.title}
              {...item}
              image={FOOD_IMG}
              fallbackSrc={FALLBACK_IMAGES.food}
              index={i + 1}
            />
          ))}
        </div>
      </Section>

      <div className="border-t border-white/5 mx-4" />

      {/* ── Party Venues ── */}
      <Section
        title="Party Venues"
        subtitle="Spectacular spaces for every event"
        viewAllPath="/venues"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((item, i) => (
            <ServiceCard
              key={item.title}
              {...item}
              image={VENUE_IMG}
              fallbackSrc={FALLBACK_IMAGES.venue}
              index={i + 1}
            />
          ))}
        </div>
      </Section>

      <div className="border-t border-white/5 mx-4" />

      {/* ── Top Artists ── */}
      <Section
        title="Top Artists"
        subtitle="Performers and talent for hire"
        viewAllPath="/artists"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((item, i) => (
            <ServiceCard
              key={item.title}
              {...item}
              image={ARTIST_IMG}
              fallbackSrc={FALLBACK_IMAGES.artist}
              index={i + 1}
            />
          ))}
        </div>
      </Section>

      <div className="border-t border-white/5 mx-4" />

      {/* ── Transport Services ── */}
      <Section
        title="Transport Services"
        subtitle="Premium transportation for your events"
        viewAllPath="/transport"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {transportItems.map((item, i) => (
            <ServiceCard
              key={item.title}
              {...item}
              image={TRANSPORT_IMG}
              fallbackSrc={FALLBACK_IMAGES.transport}
              index={i + 1}
            />
          ))}
        </div>
      </Section>

      {/* ── Founder & Leadership ── */}
      <section className="py-16 bg-[#0a0a0a] section-animate">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display font-black text-2xl md:text-3xl text-white mb-2">
              Founder &amp; Leadership
            </h2>
            <div className="w-16 h-0.5 bg-red-600 mx-auto" />
          </div>
          <div
            className="card-3d-hover border border-red-500/30 bg-[#111] rounded-xl p-8 max-w-md mx-auto text-center"
            data-ocid="founder.card"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-3xl font-black text-white mx-auto mb-4 shadow-lg">
              UK
            </div>
            <h3 className="text-2xl font-black text-white">
              Ujjwal Kapur (UK)
            </h3>
            <div className="mt-5 space-y-2 text-left">
              <div className="bg-[#1a1a1a] rounded-lg p-3">
                <p className="text-red-500 text-xs font-bold uppercase tracking-wider">
                  HR Manager
                </p>
                <p className="text-white text-sm mt-1">
                  SUNBURN FESTIVAL | VH1 SUPERSONIC | IPL
                </p>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-3">
                <p className="text-red-500 text-xs font-bold uppercase tracking-wider">
                  National Sales Manager
                </p>
                <p className="text-white text-sm mt-1">SUNBURN FESTIVAL GOA</p>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-3">
                <p className="text-red-500 text-xs font-bold uppercase tracking-wider">
                  Coverage
                </p>
                <p className="text-white text-sm font-bold mt-1">PAN INDIA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DMT Creatology Academy ── */}
      <section className="py-16 bg-black section-animate">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display font-black text-2xl md:text-3xl text-white mb-2">
              DMT Creatology Academy
            </h2>
            <div className="w-16 h-0.5 bg-red-600 mx-auto mb-4" />
            <p className="text-white/60 text-base">
              India's No.1 Tuition Academy &amp; Event Management Company
            </p>
            <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/30 rounded-full px-4 py-1.5 mt-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="text-red-400 text-xs font-bold uppercase tracking-wider">
                100% Practical Training + Job Assistance
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Cooking Course */}
            <div
              className="card-3d-hover bg-[#111] border border-red-600/20 hover:border-red-600/50 rounded-xl p-6 text-center"
              data-ocid="academy.item.1"
            >
              <div className="w-14 h-14 rounded-full bg-red-600/10 flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-white font-black text-lg mb-2">
                Cooking Course
              </h3>
              <p className="text-white/50 text-sm mb-4 leading-relaxed">
                Master culinary arts with hands-on training from professional
                chefs. From basics to advanced techniques.
              </p>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-500 text-white font-bold btn-red-glow"
                data-ocid="academy.primary_button.1"
              >
                Learn More
              </Button>
            </div>

            {/* Event Management Course */}
            <div
              className="card-3d-hover bg-[#111] border border-red-600/20 hover:border-red-600/50 rounded-xl p-6 text-center"
              data-ocid="academy.item.2"
            >
              <div className="w-14 h-14 rounded-full bg-red-600/10 flex items-center justify-center mx-auto mb-4">
                <Clapperboard className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-white font-black text-lg mb-2">
                Event Management Course
              </h3>
              <p className="text-white/50 text-sm mb-4 leading-relaxed">
                Learn to plan and execute world-class events. From concerts to
                weddings — become a certified event professional.
              </p>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-500 text-white font-bold btn-red-glow"
                data-ocid="academy.primary_button.2"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 relative overflow-hidden bg-[#0a0a0a]">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: "linear-gradient(135deg, #cc0000 0%, #ff0000 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, rgba(255,0,0,0.08) 0%, transparent 60%)",
          }}
        />
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="font-display font-black text-3xl md:text-4xl text-white mb-4">
            Ready to Create Something{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #ff0000 0%, #ff4444 60%, #ff6666 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Unforgettable?
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto mb-8">
            From intimate gatherings to mega festivals — DMT Creatology has
            everything you need.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 btn-red-glow"
              data-ocid="cta.primary_button"
            >
              <Link to="/contact">Get In Touch</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-red-500/50 text-red-400 hover:bg-red-600/10 hover:text-red-300 px-8"
              data-ocid="cta.secondary_button"
            >
              <a
                href="https://wa.me/919821432904"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp Us
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
