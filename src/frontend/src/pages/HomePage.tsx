import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { FALLBACK_IMAGES } from "@/lib/fallbackImages";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, MapPin, Star, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const HERO_IMG = FALLBACK_IMAGES.event;
const HOTEL_IMG = FALLBACK_IMAGES.hotel;
const FOOD_IMG = FALLBACK_IMAGES.food;
const VENUE_IMG = FALLBACK_IMAGES.venue;
const ARTIST_IMG = FALLBACK_IMAGES.artist;
const TRANSPORT_IMG = FALLBACK_IMAGES.transport;

const statsData = [
  { icon: Users, label: "Happy Clients", value: "50,000+", numValue: 50000 },
  { icon: Calendar, label: "Events Managed", value: "5,000+", numValue: 5000 },
  { icon: MapPin, label: "Cities Covered", value: "100+", numValue: 100 },
  { icon: Star, label: "5-Star Reviews", value: "12,000+", numValue: 12000 },
];

const services = [
  { title: "Event Ticket Booking", subtitle: "", icon: "🎟️" },
  {
    title: "Wedding & Party Service Booking",
    subtitle:
      "Venue | Catering | DJ | Photographer | Makeup Artist | Decoration | Lighting | Sound",
    icon: "💒",
  },
  {
    title: "Artist & Celebrity Booking",
    subtitle:
      "DJ's | Singers | Music Bands | Comedians | Anchors / Hosts | Dancers | Influencers | Celebrities | Models",
    icon: "🎤",
  },
  { title: "Studio & Production Booking", subtitle: "", icon: "🎬" },
  { title: "Creator Services", subtitle: "", icon: "✨" },
  {
    title: "Travel & Experience Booking",
    subtitle: "Hotels • Venues • Artists • Transport • Business Services",
    icon: "✈️",
  },
];

const platformNames = [
  "BookMyShow",
  "WedMeGood",
  "Cameo",
  "Artist Celebrity Models Booking Engine",
  "MakeMyTrip",
  "OYO Hotels",
  "MagicBricks",
  "99acres",
  "Ola",
  "Uber",
  "RedBus",
  "Flights Booking Engine (DMT – GDS AMADEUS)",
  "Business Services Marketplace",
];

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

const transport = [
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

/* Custom hook for intersection observer */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* Animated stat counter */
function AnimatedCounter({
  value,
  numValue,
}: { value: string; numValue: number }) {
  const [display, setDisplay] = useState("0");
  const { ref, visible } = useInView(0.5);

  useEffect(() => {
    if (!visible) return;
    const suffix = value.replace(/[0-9,]/g, "");
    const duration = 1500;
    const steps = 40;
    const increment = numValue / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= numValue) {
        setDisplay(value);
        clearInterval(interval);
      } else {
        setDisplay(Math.floor(current).toLocaleString("en-IN") + suffix);
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [visible, value, numValue]);

  return <span ref={ref as React.RefObject<HTMLSpanElement>}>{display}</span>;
}

interface SectionProps {
  title: string;
  subtitle: string;
  viewAllPath: string;
  children: React.ReactNode;
}

function Section({ title, subtitle, viewAllPath, children }: SectionProps) {
  const { ref, visible } = useInView();
  return (
    <section
      ref={ref}
      className={`py-12 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display font-black text-2xl md:text-3xl text-white">
              {title}
            </h2>
            <p className="text-white/40 text-sm mt-1">{subtitle}</p>
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
  const { ref: servicesRef, visible: servicesVisible } = useInView();
  const { ref: founderRef, visible: founderVisible } = useInView();
  const { ref: academyRef, visible: academyVisible } = useInView();

  return (
    <div className="bg-black">
      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt="DMT Creatology Events"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          {/* Subtle red glow overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 20% 50%, rgba(255,0,0,0.08) 0%, transparent 60%)",
            }}
          />
        </div>

        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-3xl">
            <p
              className="text-red-500 font-bold text-sm uppercase tracking-[0.3em] mb-3"
              style={{
                animation: "fadeSlideUp 0.6s 0s ease forwards",
                opacity: 0,
              }}
            >
              DMT CREATOLOGY
            </p>

            <h1
              className="font-display font-black text-5xl md:text-7xl lg:text-8xl text-white leading-[1.05] mb-4"
              style={{
                animation: "fadeSlideUp 0.8s 0.2s ease forwards",
                opacity: 0,
              }}
            >
              BOOK ALL-IN-ONE
              <br />
              <span style={{ color: "#FF0000" }}>ECOSYSTEM</span>
            </h1>

            <p
              className="text-white/90 font-bold text-xl md:text-2xl mb-2"
              style={{
                animation: "fadeSlideUp 0.8s 0.4s ease forwards",
                opacity: 0,
              }}
            >
              🌍 World Top 100 Bookings Platform
            </p>
            <p
              className="text-white/70 text-lg md:text-xl mb-1"
              style={{
                animation: "fadeSlideUp 0.8s 0.5s ease forwards",
                opacity: 0,
              }}
            >
              Global Asset Booking &amp; Marketplace Platform
            </p>
            <p
              className="text-white/70 text-lg md:text-xl mb-6"
              style={{
                animation: "fadeSlideUp 0.8s 0.6s ease forwards",
                opacity: 0,
              }}
            >
              All Assets Booking &amp; Management Super Platform
            </p>
            <p
              className="text-white/60 text-base max-w-2xl mb-8"
              style={{
                animation: "fadeSlideUp 0.8s 0.7s ease forwards",
                opacity: 0,
              }}
            >
              You can book 100+ types of multi-billion dollar business
              industries products and services on one platform.
            </p>

            <div
              className="flex flex-wrap gap-4"
              style={{
                animation: "fadeSlideUp 0.8s 0.85s ease forwards",
                opacity: 0,
              }}
            >
              <Button
                asChild
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-base px-8 red-glow-hover transition-all"
                data-ocid="hero.primary_button"
              >
                <Link to="/events">Explore Events</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 hover:border-red-500 text-base px-8"
                data-ocid="hero.secondary_button"
              >
                <Link to="/vendors">Book Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── PLATFORM TICKER ── */}
      <section className="py-4 bg-black border-y border-red-900/40 overflow-hidden">
        <div
          className="flex whitespace-nowrap gap-0"
          style={{
            width: "max-content",
            animation: "marquee 40s linear infinite",
          }}
        >
          {[...platformNames, ...platformNames].map((item) => (
            <span
              key={item}
              className="text-white/50 text-sm font-medium px-5 inline-flex items-center"
            >
              <span className="text-red-500 mr-2">•</span>
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-10 border-b border-white/5 bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statsData.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                  <stat.icon className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="font-display font-black text-xl text-white">
                    <AnimatedCounter
                      value={stat.value}
                      numValue={stat.numValue}
                    />
                  </p>
                  <p className="text-white/40 text-xs">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section
        ref={servicesRef as React.RefObject<HTMLElement>}
        className={`py-16 bg-black transition-all duration-700 ${
          servicesVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        <div className="container mx-auto px-4">
          <h2 className="font-display font-black text-3xl md:text-4xl text-white text-center mb-2">
            Our <span className="text-red-500">Services</span>
          </h2>
          <p className="text-white/40 text-center mb-10">
            Everything you need on one platform
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, i) => (
              <div
                key={svc.title}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 card-3d-hover"
                style={
                  servicesVisible
                    ? {
                        animation: `fadeIn 0.5s ${i * 0.1}s ease forwards`,
                        opacity: 0,
                      }
                    : {}
                }
              >
                <div className="text-3xl mb-3">{svc.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">
                  {svc.title}
                </h3>
                {svc.subtitle && (
                  <p className="text-white/40 text-sm leading-relaxed">
                    {svc.subtitle}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOUNDER & LEADERSHIP ── */}
      <section
        ref={founderRef as React.RefObject<HTMLElement>}
        className={`py-16 bg-zinc-950 transition-all duration-700 ${
          founderVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        <div className="container mx-auto px-4">
          <h2 className="font-display font-black text-3xl md:text-4xl text-white text-center mb-2">
            Founder &amp; <span className="text-red-500">Leadership</span>
          </h2>
          <p className="text-white/40 text-center mb-10">
            The vision behind DMT Creatology
          </p>
          <div className="flex justify-center">
            <div className="bg-zinc-900 border border-zinc-800 border-l-4 border-l-red-600 rounded-xl p-8 max-w-md w-full card-3d-hover">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-white font-black text-2xl mb-4">
                UK
              </div>
              <h3 className="text-white font-black text-2xl mb-1">
                Ujjwal Kapur <span className="text-red-500">(UK)</span>
              </h3>
              <div className="space-y-4 mt-4">
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">
                    HR Manager
                  </p>
                  <p className="text-white font-medium">
                    SUNBURN FESTIVAL | VH1 SUPERSONIC | IPL
                  </p>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">
                    National Sales Manager
                  </p>
                  <p className="text-white font-medium">SUNBURN FESTIVAL GOA</p>
                </div>
                <div className="pt-3 border-t border-zinc-700">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">
                    Coverage
                  </p>
                  <p className="text-red-400 font-bold tracking-wide">
                    PAN INDIA
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED EVENTS ── */}
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

      {/* ── POPULAR HOTELS ── */}
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

      {/* ── FOOD & BEVERAGE ── */}
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

      {/* ── PARTY VENUES ── */}
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

      {/* ── TOP ARTISTS ── */}
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

      {/* ── TRANSPORT ── */}
      <Section
        title="Transport Services"
        subtitle="Premium transportation for your events"
        viewAllPath="/transport"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {transport.map((item, i) => (
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

      {/* ── ACADEMY ── */}
      <section
        ref={academyRef as React.RefObject<HTMLElement>}
        className={`py-16 bg-black transition-all duration-700 ${
          academyVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display font-black text-3xl md:text-4xl text-white mb-2">
              DMT Creatology <span className="text-red-500">Academy</span>
            </h2>
            <p className="text-white/60 text-lg mb-4">
              India's No.1 Tuition Academy & Event Management Company
            </p>
            <div className="inline-block bg-red-600/20 border border-red-600/40 rounded-full px-6 py-2">
              <span className="text-red-400 font-bold">
                100% Practical Training + Job Assistance
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {[
              {
                title: "Cooking Course",
                icon: "👨‍🍳",
                desc: "Professional culinary training with hands-on kitchen experience and industry certifications.",
              },
              {
                title: "Event Management Course",
                icon: "🎪",
                desc: "Complete event planning curriculum covering budgeting, logistics, vendor management, and live execution.",
              },
            ].map((course, i) => (
              <div
                key={course.title}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 card-3d-hover group cursor-pointer"
                data-ocid={`academy.item.${i + 1}`}
              >
                <div className="text-4xl mb-4">{course.icon}</div>
                <h3 className="text-white font-black text-xl mb-2 group-hover:text-red-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-white/50 text-sm mb-4">{course.desc}</p>
                <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
                  <span>Learn More</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-16 relative overflow-hidden bg-zinc-950">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,0,0,0.08) 0%, transparent 60%)",
          }}
        />
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="font-display font-black text-3xl md:text-4xl text-white mb-4">
            Ready to Create Something{" "}
            <span className="text-red-500">Unforgettable?</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto mb-8">
            From intimate gatherings to mega festivals — DMT Creatology has
            everything you need.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 red-glow-hover"
              data-ocid="cta.primary_button"
            >
              <Link to="/contact">Get In Touch</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10 px-8"
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
