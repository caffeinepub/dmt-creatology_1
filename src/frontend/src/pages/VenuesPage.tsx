import PageHeader from "@/components/PageHeader";
import ServiceCard from "@/components/ServiceCard";
import { Badge } from "@/components/ui/badge";
import { FALLBACK_IMAGES } from "@/lib/fallbackImages";

const IMG = FALLBACK_IMAGES.venue;

const venues = [
  {
    title: "Grand Ballroom Mumbai",
    subtitle: "Bandra, Mumbai",
    description:
      "Magnificent 1000-capacity ballroom with crystal chandeliers, marble floors, and state-of-the-art AV.",
    details: "Capacity: 1,000",
    service: "Grand Ballroom Mumbai Venue",
    badge: "PREMIUM",
    rating: 4.9,
    type: "Banquet Hall",
  },
  {
    title: "The Lawn Delhi",
    subtitle: "Mehrauli, Delhi",
    description:
      "Lush green lawns amid ancient ruins. Perfect for outdoor weddings and cultural events.",
    details: "Capacity: 500",
    service: "The Lawn Delhi Venue",
    rating: 4.7,
    type: "Outdoor",
  },
  {
    title: "Skyline Terrace Bangalore",
    subtitle: "UB City, Bangalore",
    description:
      "Stunning rooftop terrace with 360° city panorama, ideal for corporate gatherings and cocktail parties.",
    details: "Capacity: 300",
    service: "Skyline Terrace Bangalore Venue",
    badge: "ROOFTOP",
    rating: 4.7,
    type: "Terrace",
  },
  {
    title: "Crystal Hall Pune",
    subtitle: "Koregaon Park, Pune",
    description:
      "Elegant 800-person hall with crystal décor, customizable lighting, and full catering kitchen.",
    details: "Capacity: 800",
    service: "Crystal Hall Pune Venue",
    rating: 4.6,
    type: "Banquet Hall",
  },
  {
    title: "Beach Venue Goa",
    subtitle: "Anjuna, Goa",
    description:
      "Breathtaking beachfront venue with natural backdrop, sunset views, and sea breeze.",
    details: "Capacity: 400",
    service: "Beach Venue Goa",
    badge: "BEACHFRONT",
    rating: 4.8,
    type: "Beach",
  },
  {
    title: "Convention Center Hyderabad",
    subtitle: "HITEC City, Hyderabad",
    description:
      "Modern convention facility for large-scale conferences, expos, and corporate mega-events.",
    details: "Capacity: 2,000",
    service: "Convention Center Hyderabad Venue",
    badge: "MEGA",
    rating: 4.5,
    type: "Convention",
  },
];

export default function VenuesPage() {
  return (
    <div>
      <PageHeader
        title="Party Venues"
        subtitle="Spectacular spaces for weddings, parties, conferences, and corporate events"
        breadcrumb="Event Venues"
      />

      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              "All",
              "Banquet Hall",
              "Outdoor",
              "Terrace",
              "Beach",
              "Convention",
            ].map((t) => (
              <Badge
                key={t}
                variant={t === "All" ? "default" : "outline"}
                className={
                  t === "All"
                    ? "gradient-gold text-[oklch(0.1_0.01_260)] border-0 cursor-pointer"
                    : "border-border text-muted-foreground cursor-pointer hover:border-gold hover:text-gold"
                }
              >
                {t}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue, i) => (
              <div key={venue.title} className="relative">
                <div className="absolute top-3 right-3 z-10">
                  <Badge className="bg-black/70 text-white/80 border-0 text-xs backdrop-blur-sm">
                    {venue.type}
                  </Badge>
                </div>
                <ServiceCard
                  {...venue}
                  image={IMG}
                  fallbackSrc={IMG}
                  index={i + 1}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
