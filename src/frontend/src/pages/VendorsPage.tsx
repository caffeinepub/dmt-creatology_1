import PageHeader from "@/components/PageHeader";
import ServiceCard from "@/components/ServiceCard";
import { Badge } from "@/components/ui/badge";

const IMG = "/assets/generated/vendor-photographer.dim_600x400.jpg";

const vendors = [
  {
    title: "Raj Photography Studio",
    subtitle: "Mumbai, Maharashtra",
    description:
      "Award-winning photography studio specializing in weddings, events, and fashion portfolios.",
    details: "₹30,000/event",
    service: "Raj Photography Studio",
    badge: "TOP RATED",
    rating: 4.9,
    category: "Photography",
    experience: "12 years",
  },
  {
    title: "Glam Makeup Artists",
    subtitle: "Delhi, Pan India",
    description:
      "Celebrity makeup artists for weddings, fashion shows, film shoots, and special events.",
    details: "₹8,000/session",
    service: "Glam Makeup Artists",
    badge: "CELEBRITY",
    rating: 4.8,
    category: "Makeup",
    experience: "8 years",
  },
  {
    title: "Dream Decorators",
    subtitle: "Mumbai, Delhi",
    description:
      "Creative event decoration services from floral arrangements to full venue transformation.",
    details: "₹50,000+",
    service: "Dream Decorators",
    rating: 4.7,
    category: "Decoration",
    experience: "10 years",
  },
  {
    title: "DJ Beats Productions",
    subtitle: "Bangalore, Pan India",
    description:
      "Professional DJ services with premium sound equipment for all types of events.",
    details: "₹25,000/event",
    service: "DJ Beats Productions",
    badge: "PREMIUM",
    rating: 4.8,
    category: "DJ",
    experience: "15 years",
  },
  {
    title: "Sound & Light Masters",
    subtitle: "Mumbai",
    description:
      "Complete sound and lighting solutions for concerts, weddings, conferences, and events.",
    details: "₹40,000/event",
    service: "Sound Light Masters",
    rating: 4.6,
    category: "Sound & Lights",
    experience: "9 years",
  },
  {
    title: "Wedding Planners India",
    subtitle: "Pan India",
    description:
      "Full-service wedding planning from venue selection to D-day coordination for dream weddings.",
    details: "₹2,00,000+",
    service: "Wedding Planners India",
    badge: "RECOMMENDED",
    rating: 4.9,
    category: "Wedding Planning",
    experience: "14 years",
  },
];

export default function VendorsPage() {
  return (
    <div>
      <PageHeader
        title="Vendors"
        subtitle="Trusted professionals for photography, decoration, DJ, and event production"
        breadcrumb="Service Vendors"
      />

      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              "All",
              "Photography",
              "Makeup",
              "Decoration",
              "DJ",
              "Sound & Lights",
              "Wedding Planning",
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
            {vendors.map((vendor, i) => (
              <div key={vendor.title} className="relative">
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 items-end">
                  <Badge className="bg-black/70 text-white/80 border-0 text-xs backdrop-blur-sm">
                    {vendor.category}
                  </Badge>
                  <Badge className="bg-black/70 text-gold/80 border-0 text-xs backdrop-blur-sm">
                    {vendor.experience}
                  </Badge>
                </div>
                <ServiceCard {...vendor} image={IMG} index={i + 1} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
