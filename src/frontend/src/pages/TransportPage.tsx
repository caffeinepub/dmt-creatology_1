import PageHeader from "@/components/PageHeader";
import ServiceCard from "@/components/ServiceCard";
import TransportBookingModal from "@/components/TransportBookingModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllTransportOptions } from "@/hooks/useAdminQueries";
import { FALLBACK_IMAGES } from "@/lib/fallbackImages";
import { Bus, Car, MapPin, Plane, Ship, Star, Train } from "lucide-react";
import { useState } from "react";
import { TransportType } from "../backend.d";
import type { TransportOption } from "../backend.d";

const IMG = FALLBACK_IMAGES.transport;

// ── Static fallback data ──────────────────────────────────────────────────────

const categories = [
  {
    icon: Car,
    title: "Road Transport",
    subtitle: "Cars, buses, and luxury vehicles",
    items: [
      {
        title: "Luxury Car Rental",
        subtitle: "Pan India",
        description:
          "Premium fleet including Mercedes E-Class, BMW 5 Series, and Audi A6 with professional chauffeurs.",
        details: "₹5,000/day",
        service: "Luxury Car Rental Service",
        badge: "PREMIUM",
        rating: 4.8,
      },
      {
        title: "Party Bus Service",
        subtitle: "Mumbai, Delhi, Bangalore",
        description:
          "Fully equipped party buses with professional sound systems, LED lighting, and air conditioning.",
        details: "₹15,000/event",
        service: "Party Bus Service",
        rating: 4.7,
      },
    ],
  },
  {
    icon: Plane,
    title: "Air Transport",
    subtitle: "Private jets, helicopters, and charters",
    items: [
      {
        title: "Private Jet Charter",
        subtitle: "Pan India",
        description:
          "Exclusive private jets for corporate travel, celebrity transfers, and destination weddings.",
        details: "₹3,00,000+",
        service: "Private Jet Charter Service",
        badge: "EXCLUSIVE",
        rating: 4.9,
      },
      {
        title: "Helicopter Tours",
        subtitle: "Mumbai, Goa, Shimla",
        description:
          "Scenic helicopter tours for sightseeing, aerial photography, and quick city hops.",
        details: "₹25,000/person",
        service: "Helicopter Tour Service",
        badge: "AERIAL",
        rating: 4.8,
      },
    ],
  },
  {
    icon: Ship,
    title: "Water Transport",
    subtitle: "Yachts, cruises, and boats",
    items: [
      {
        title: "Yacht Rental Goa",
        subtitle: "Goa",
        description:
          "Luxury yachts for private parties, sunset cruises, and corporate outings with full crew.",
        details: "₹50,000/day",
        service: "Yacht Rental Goa",
        badge: "LUXURY",
        rating: 4.9,
      },
      {
        title: "Cruise Package Mumbai",
        subtitle: "Mumbai Gateway",
        description:
          "Evening cruise packages with dinner, DJ, and live entertainment on Mumbai's harbor.",
        details: "₹5,000/person",
        service: "Cruise Package Mumbai",
        badge: "POPULAR",
        rating: 4.7,
      },
    ],
  },
  {
    icon: Train,
    title: "Rail Transport",
    subtitle: "Charter trains and luxury rail",
    items: [
      {
        title: "Charter Train Service",
        subtitle: "Pan India",
        description:
          "Exclusive charter trains for large groups, destination weddings, and corporate team outings.",
        details: "Custom pricing",
        service: "Charter Train Service",
        rating: 4.6,
      },
      {
        title: "Luxury Rail Packages",
        subtitle: "Rajasthan Routes",
        description:
          "Maharaja Express-style luxury rail journeys for premium corporate and wedding packages.",
        details: "₹1,20,000+",
        service: "Luxury Rail Package",
        badge: "HERITAGE",
        rating: 4.8,
      },
    ],
  },
];

// ── Transport type helpers ─────────────────────────────────────────────────────

function getTransportIcon(type: TransportType) {
  switch (type) {
    case TransportType.car:
      return Car;
    case TransportType.bus:
      return Bus;
    case TransportType.flight:
    case TransportType.helicopter:
      return Plane;
    case TransportType.train:
      return Train;
    case TransportType.cruise:
      return Ship;
    default:
      return Car;
  }
}

function getTransportLabel(type: TransportType): string {
  switch (type) {
    case TransportType.car:
      return "Car";
    case TransportType.bus:
      return "Bus";
    case TransportType.flight:
      return "Flight";
    case TransportType.train:
      return "Train";
    case TransportType.helicopter:
      return "Helicopter";
    case TransportType.cruise:
      return "Cruise";
    default:
      return String(type);
  }
}

function getTypeBadgeClass(type: TransportType): string {
  switch (type) {
    case TransportType.car:
      return "border-blue-400/30 text-blue-400 bg-blue-400/5";
    case TransportType.bus:
      return "border-green-400/30 text-green-400 bg-green-400/5";
    case TransportType.flight:
      return "border-sky-400/30 text-sky-400 bg-sky-400/5";
    case TransportType.train:
      return "border-orange-400/30 text-orange-400 bg-orange-400/5";
    case TransportType.helicopter:
      return "border-purple-400/30 text-purple-400 bg-purple-400/5";
    case TransportType.cruise:
      return "border-teal-400/30 text-teal-400 bg-teal-400/5";
    default:
      return "border-border text-muted-foreground";
  }
}

// ── Live transport card ───────────────────────────────────────────────────────

function LiveTransportCard({
  transport,
  index,
}: {
  transport: TransportOption;
  index: number;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const Icon = getTransportIcon(transport.transportType);
  const coverImage = transport.photoUrls[0] ?? IMG;

  return (
    <>
      <div
        className="relative bg-card rounded-2xl overflow-hidden border border-border shadow-md hover:shadow-lg transition-shadow"
        data-ocid={`transport.item.${index}`}
      >
        {/* Cover image */}
        <div className="relative h-48 overflow-hidden bg-muted">
          <img
            src={coverImage}
            alt={transport.operatorName}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = IMG;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-3 left-3">
            <span className="text-white font-bold text-lg drop-shadow">
              ₹{Number(transport.price).toLocaleString("en-IN")}
            </span>
            <span className="text-white/70 text-sm drop-shadow"> / seat</span>
          </div>
          {/* Type badge in top right */}
          <div className="absolute top-3 right-3">
            <span
              className={`text-[10px] font-semibold border px-2 py-0.5 rounded-full backdrop-blur-sm bg-black/30 flex items-center gap-1 ${getTypeBadgeClass(transport.transportType)}`}
            >
              <Icon size={10} />
              {getTransportLabel(transport.transportType)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-display font-bold text-foreground text-lg leading-tight line-clamp-1">
              {transport.operatorName}
            </h3>
            <p className="text-muted-foreground text-sm flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 shrink-0" />
              {transport.route}
            </p>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground text-xs">
              {transport.city}
            </span>
            <span className="text-muted-foreground text-xs flex items-center gap-1">
              <Star className="w-3 h-3 text-gold fill-gold" />
              {String(transport.availableSeats)} seats available
            </span>
          </div>

          <Button
            onClick={() => setModalOpen(true)}
            className="w-full gradient-gold text-[oklch(0.1_0.01_260)] font-bold hover:opacity-90 flex items-center gap-2 h-10"
            data-ocid={`transport.book.${index}`}
          >
            <Icon className="w-4 h-4" />
            Book Transport
          </Button>
        </div>
      </div>

      {/* Transport Booking Modal */}
      <TransportBookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        transport={transport}
      />
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function TransportPage() {
  const { data: liveTransports, isLoading } = useAllTransportOptions();

  const hasLiveTransports = liveTransports && liveTransports.length > 0;

  return (
    <div>
      <PageHeader
        title="Transport"
        subtitle="Premium transportation by road, air, water, and rail across India"
        breadcrumb="Transportation"
      />

      <section className="py-10">
        <div className="container mx-auto px-4">
          {/* Filter badges (decorative) */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              "All",
              "Car",
              "Bus",
              "Flight",
              "Train",
              "Helicopter",
              "Cruise",
            ].map((cat) => (
              <Badge
                key={cat}
                variant={cat === "All" ? "default" : "outline"}
                className={
                  cat === "All"
                    ? "gradient-gold text-[oklch(0.1_0.01_260)] border-0 cursor-pointer"
                    : "border-border text-muted-foreground cursor-pointer hover:border-gold hover:text-gold"
                }
              >
                {cat}
              </Badge>
            ))}
          </div>

          {/* Loading skeletons */}
          {isLoading && (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="transport.loading_state"
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
          )}

          {/* Live transport cards */}
          {!isLoading && hasLiveTransports && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveTransports.map((transport, i) => (
                <LiveTransportCard
                  key={String(transport.id)}
                  transport={transport}
                  index={i + 1}
                />
              ))}
            </div>
          )}

          {/* Static fallback — category-grouped cards */}
          {!isLoading && !hasLiveTransports && (
            <div className="space-y-14">
              {categories.map((cat) => (
                <div key={cat.title}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                      <cat.icon className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-xl text-foreground">
                        {cat.title}
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        {cat.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {cat.items.map((item, i) => (
                      <ServiceCard
                        key={item.title}
                        {...item}
                        image={IMG}
                        fallbackSrc={IMG}
                        index={i + 1}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
