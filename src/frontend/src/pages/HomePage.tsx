import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { FALLBACK_IMAGES } from "@/lib/fallbackImages";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, MapPin, Star, Users } from "lucide-react";

const HERO_IMG = FALLBACK_IMAGES.event;
const HOTEL_IMG = FALLBACK_IMAGES.hotel;
const FOOD_IMG = FALLBACK_IMAGES.food;
const VENUE_IMG = FALLBACK_IMAGES.venue;
const ARTIST_IMG = FALLBACK_IMAGES.artist;
const TRANSPORT_IMG = FALLBACK_IMAGES.transport;

const stats = [
  { icon: Users, label: "Happy Clients", value: "50,000+" },
  { icon: Calendar, label: "Events Managed", value: "5,000+" },
  { icon: MapPin, label: "Cities Covered", value: "100+" },
  { icon: Star, label: "5-Star Reviews", value: "12,000+" },
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

interface SectionProps {
  title: string;
  subtitle: string;
  viewAllPath: string;
  children: React.ReactNode;
}

function Section({ title, subtitle, viewAllPath, children }: SectionProps) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display font-black text-2xl md:text-3xl text-foreground">
              {title}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
          </div>
          <Link
            to={viewAllPath}
            className="flex items-center gap-1 text-gold hover:text-gold-bright transition-colors text-sm font-medium shrink-0"
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
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt="DMT Creatology Events"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 mb-6">
              <Star className="w-3.5 h-3.5 text-gold fill-gold" />
              <span className="text-gold text-xs font-bold uppercase tracking-wider">
                India's Premier Platform
              </span>
            </div>

            <h1 className="font-display font-black text-4xl md:text-6xl lg:text-7xl text-white leading-tight mb-6">
              India's Premier{" "}
              <span className="text-gradient-gold">Event &</span>
              <br />
              Entertainment Platform
            </h1>

            <p className="text-white/80 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
              Book events, hotels, venues, artists, transport, and services —
              all in one place. Your complete entertainment ecosystem.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="gradient-gold text-[oklch(0.1_0.01_260)] font-bold text-base px-8 hover:opacity-90"
              >
                <Link to="/events">Explore Events</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 text-base px-8"
              >
                <Link to="/vendors">Book Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 border-y border-border/50 bg-[oklch(0.14_0.02_255)]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                  <stat.icon className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="font-display font-black text-xl text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground text-xs">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
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

      <div className="border-t border-border/30 mx-4" />

      {/* Popular Hotels */}
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

      <div className="border-t border-border/30 mx-4" />

      {/* Food & Beverage */}
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

      <div className="border-t border-border/30 mx-4" />

      {/* Party Venues */}
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

      <div className="border-t border-border/30 mx-4" />

      {/* Top Artists */}
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

      <div className="border-t border-border/30 mx-4" />

      {/* Transport */}
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

      {/* CTA Banner */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 gradient-gold opacity-10" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, oklch(0.78 0.17 75 / 15%) 0%, transparent 60%)",
          }}
        />
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="font-display font-black text-3xl md:text-4xl text-foreground mb-4">
            Ready to Create Something{" "}
            <span className="text-gradient-gold">Unforgettable?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            From intimate gatherings to mega festivals — DMT Creatology has
            everything you need.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="gradient-gold text-[oklch(0.1_0.01_260)] font-bold px-8"
            >
              <Link to="/contact">Get In Touch</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-gold/50 text-gold hover:bg-gold/10 px-8"
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
