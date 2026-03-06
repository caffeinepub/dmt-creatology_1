import PageHeader from "@/components/PageHeader";
import ServiceCard from "@/components/ServiceCard";
import { Badge } from "@/components/ui/badge";
import { Car, Coffee, Dumbbell, Utensils, Waves, Wifi } from "lucide-react";

const IMG = "/assets/generated/hotel-luxury.dim_600x400.jpg";

const hotels = [
  {
    title: "The Grand Palace Mumbai",
    subtitle: "Mumbai, Maharashtra",
    description:
      "Iconic 5-star luxury hotel with panoramic sea views, world-class spa, and three specialty restaurants.",
    details: "₹5,000/night",
    service: "The Grand Palace Mumbai Hotel",
    badge: "5-STAR",
    rating: 4.9,
    amenities: [Wifi, Car, Coffee, Utensils, Dumbbell, Waves],
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
    amenities: [Wifi, Car, Coffee, Utensils, Dumbbell],
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
    amenities: [Wifi, Car, Coffee, Utensils, Waves],
  },
  {
    title: "Business Inn Bangalore",
    subtitle: "Koramangala, Bangalore",
    description:
      "Modern business hotel with conference facilities, co-working spaces, and tech-enabled rooms.",
    details: "₹3,500/night",
    service: "Business Inn Bangalore Hotel",
    rating: 4.5,
    amenities: [Wifi, Car, Coffee, Utensils, Dumbbell],
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
    amenities: [Wifi, Car, Coffee, Utensils, Waves],
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
    amenities: [Wifi, Car, Coffee, Utensils, Dumbbell, Waves],
  },
];

export default function HotelsPage() {
  return (
    <div>
      <PageHeader
        title="Hotels"
        subtitle="Handpicked luxury accommodations for every occasion"
        breadcrumb="Accommodations"
      />

      <section className="py-10">
        <div className="container mx-auto px-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel, i) => (
              <div key={hotel.title} className="relative">
                <ServiceCard {...hotel} image={IMG} index={i + 1} />
                {/* Amenities */}
                <div className="mt-(-2) -mt-1 px-4 pb-2 flex gap-2 flex-wrap">
                  {hotel.amenities.map((Icon) => (
                    <div
                      key={Icon.displayName ?? Icon.name}
                      className="w-6 h-6 bg-muted rounded flex items-center justify-center"
                    >
                      <Icon className="w-3 h-3 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
