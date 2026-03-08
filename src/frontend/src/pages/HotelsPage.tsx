import HotelBookingModal from "@/components/HotelBookingModal";
import PageHeader from "@/components/PageHeader";
import ServiceCard from "@/components/ServiceCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllHotels } from "@/hooks/useAdminQueries";
import { FALLBACK_IMAGES } from "@/lib/fallbackImages";
import {
  BedDouble,
  Car,
  Coffee,
  Dumbbell,
  MapPin,
  Star,
  Utensils,
  Waves,
  Wifi,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import type { Hotel } from "../backend.d";

const IMG = FALLBACK_IMAGES.hotel;

// ── Static fallback data ──────────────────────────────────────────────────────

const STATIC_HOTELS = [
  {
    title: "The Grand Palace Mumbai",
    subtitle: "Mumbai, Maharashtra",
    description:
      "Iconic 5-star luxury hotel with panoramic sea views, world-class spa, and three specialty restaurants.",
    details: "₹5,000/night",
    service: "The Grand Palace Mumbai Hotel",
    badge: "5-STAR",
    rating: 4.9,
    amenities: ["WiFi", "Parking", "Coffee", "Restaurant", "Gym", "Pool"],
  },
  {
    title: "Taj Residency Delhi",
    subtitle: "Connaught Place, Delhi",
    description:
      "Heritage luxury in the heart of Delhi. Blend of colonial grandeur with modern amenities.",
    details: "₹8,000/night",
    service: "Taj Residency Delhi Hotel",
    badge: "LUXURY",
    rating: 4.8,
    amenities: ["WiFi", "Parking", "Coffee", "Restaurant", "Gym"],
  },
  {
    title: "Luxury Suites Goa",
    subtitle: "Calangute, Goa",
    description:
      "Beachfront suites with private plunge pools, sunset decks, and personalized butler service.",
    details: "₹6,500/night",
    service: "Luxury Suites Goa Hotel",
    badge: "BEACHFRONT",
    rating: 4.7,
    amenities: ["WiFi", "Parking", "Coffee", "Restaurant", "Pool"],
  },
  {
    title: "Business Inn Bangalore",
    subtitle: "Koramangala, Bangalore",
    description:
      "Modern business hotel with conference facilities, co-working spaces, and tech-enabled rooms.",
    details: "₹3,500/night",
    service: "Business Inn Bangalore Hotel",
    rating: 4.5,
    amenities: ["WiFi", "Parking", "Coffee", "Restaurant", "Gym"],
  },
  {
    title: "Heritage Resort Jaipur",
    subtitle: "Jaipur, Rajasthan",
    description:
      "Stunning heritage property set in a 19th-century palace with royal architecture and service.",
    details: "₹4,500/night",
    service: "Heritage Resort Jaipur Hotel",
    badge: "HERITAGE",
    rating: 4.8,
    amenities: ["WiFi", "Parking", "Coffee", "Restaurant", "Pool"],
  },
  {
    title: "Sea View Hotel Mumbai",
    subtitle: "Juhu Beach, Mumbai",
    description:
      "Premium beachside hotel with direct beach access, ocean-view rooms, and sunset dining.",
    details: "₹7,000/night",
    service: "Sea View Hotel Mumbai",
    badge: "RECOMMENDED",
    rating: 4.6,
    amenities: ["WiFi", "Parking", "Coffee", "Restaurant", "Gym", "Pool"],
  },
];

// ── Amenity icon mapping ──────────────────────────────────────────────────────

function getAmenityIcon(name: string): LucideIcon {
  const lower = name.toLowerCase();
  if (
    lower.includes("wifi") ||
    lower.includes("wi-fi") ||
    lower.includes("internet")
  )
    return Wifi;
  if (
    lower.includes("pool") ||
    lower.includes("swimming") ||
    lower.includes("water")
  )
    return Waves;
  if (
    lower.includes("gym") ||
    lower.includes("fitness") ||
    lower.includes("workout")
  )
    return Dumbbell;
  if (
    lower.includes("restaurant") ||
    lower.includes("food") ||
    lower.includes("dining")
  )
    return Utensils;
  if (
    lower.includes("parking") ||
    lower.includes("car") ||
    lower.includes("valet")
  )
    return Car;
  if (
    lower.includes("coffee") ||
    lower.includes("cafe") ||
    lower.includes("lounge")
  )
    return Coffee;
  return Star;
}

// ── Live hotel card ───────────────────────────────────────────────────────────

function LiveHotelCard({ hotel, index }: { hotel: Hotel; index: number }) {
  const [modalOpen, setModalOpen] = useState(false);
  const prices = hotel.roomTypes.map((rt) => Number(rt.pricePerNight));
  const minPrice = prices.length ? Math.min(...prices) : null;
  const priceText =
    minPrice !== null
      ? `₹${minPrice.toLocaleString("en-IN")}/night`
      : "Price on request";

  const coverImage = hotel.photoUrls[0] ?? IMG;

  return (
    <>
      <div
        className="relative bg-card rounded-2xl overflow-hidden border border-border shadow-md hover:shadow-lg transition-shadow"
        data-ocid={`hotels.item.${index}`}
      >
        {/* Cover image */}
        <div className="relative h-48 overflow-hidden bg-muted">
          <img
            src={coverImage}
            alt={hotel.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = IMG;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-3 left-3">
            <span className="text-white font-bold text-lg drop-shadow">
              {priceText}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-display font-bold text-foreground text-lg leading-tight line-clamp-1">
              {hotel.name}
            </h3>
            <p className="text-muted-foreground text-sm flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 shrink-0" />
              {hotel.city}
            </p>
          </div>

          {hotel.description && (
            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
              {hotel.description}
            </p>
          )}

          {/* Amenity icons */}
          {hotel.amenities.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {hotel.amenities.slice(0, 6).map((a) => {
                const Icon = getAmenityIcon(a);
                return (
                  <div
                    key={a}
                    className="w-7 h-7 bg-muted rounded-lg flex items-center justify-center"
                    title={a}
                  >
                    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                );
              })}
            </div>
          )}

          {/* Room types */}
          {hotel.roomTypes.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {hotel.roomTypes.slice(0, 3).map((rt) => (
                <span
                  key={rt.name}
                  className="text-[10px] font-medium text-gold border border-gold/30 bg-gold/5 px-2 py-0.5 rounded-full"
                >
                  {rt.name}
                </span>
              ))}
              {hotel.roomTypes.length > 3 && (
                <span className="text-[10px] text-muted-foreground px-2 py-0.5">
                  +{hotel.roomTypes.length - 3} more
                </span>
              )}
            </div>
          )}

          <Button
            onClick={() => setModalOpen(true)}
            className="w-full gradient-gold text-[oklch(0.1_0.01_260)] font-bold hover:opacity-90 flex items-center gap-2 h-10"
            data-ocid={`hotels.book.${index}`}
          >
            <BedDouble className="w-4 h-4" />
            Book Hotel
          </Button>
        </div>
      </div>

      {/* Hotel Booking Modal */}
      <HotelBookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        hotel={hotel}
      />
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function HotelsPage() {
  const { data: liveHotels, isLoading } = useAllHotels();

  // Use live hotels if available, otherwise fall back to static sample data
  const hasLiveHotels = liveHotels && liveHotels.length > 0;

  return (
    <div>
      <PageHeader
        title="Hotels"
        subtitle="Handpicked luxury accommodations for every occasion"
        breadcrumb="Accommodations"
      />

      <section className="py-10">
        <div className="container mx-auto px-4">
          {/* Filter badges (decorative) */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              "All",
              "5-Star",
              "Luxury",
              "Beachfront",
              "Heritage",
              "Business",
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
              data-ocid="hotels.loading_state"
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

          {/* Live hotel cards */}
          {!isLoading && hasLiveHotels && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveHotels.map((hotel, i) => (
                <LiveHotelCard
                  key={String(hotel.id)}
                  hotel={hotel}
                  index={i + 1}
                />
              ))}
            </div>
          )}

          {/* Static fallback cards */}
          {!isLoading && !hasLiveHotels && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {STATIC_HOTELS.map((hotel, i) => (
                <div key={hotel.title} className="relative">
                  <ServiceCard
                    {...hotel}
                    image={IMG}
                    index={i + 1}
                    buttonLabel="Book Hotel"
                  />
                  {/* Amenities */}
                  <div className="px-4 pb-3 flex gap-2 flex-wrap">
                    {hotel.amenities.map((a) => {
                      const Icon = getAmenityIcon(a);
                      return (
                        <div
                          key={a}
                          className="w-6 h-6 bg-muted rounded flex items-center justify-center"
                          title={a}
                        >
                          <Icon className="w-3 h-3 text-muted-foreground" />
                        </div>
                      );
                    })}
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
