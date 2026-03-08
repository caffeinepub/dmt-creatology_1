import PageHeader from "@/components/PageHeader";
import ServiceCard from "@/components/ServiceCard";
import { Badge } from "@/components/ui/badge";
import { FALLBACK_IMAGES } from "@/lib/fallbackImages";

const IMG = FALLBACK_IMAGES.food;

const categories = [
  "All",
  "Catering",
  "Restaurant",
  "Food Truck",
  "Cloud Kitchen",
  "Bar",
  "Beverage",
];

const foodItems = [
  {
    title: "Royal Caterers Mumbai",
    subtitle: "Mumbai, Maharashtra",
    description:
      "Premium event catering with authentic Indian, Continental, and Chinese cuisine. Serving 50–5000 guests.",
    details: "₹500/plate",
    service: "Royal Caterers Mumbai Catering",
    badge: "POPULAR",
    rating: 4.8,
    category: "Catering",
  },
  {
    title: "Spice Garden Restaurant Delhi",
    subtitle: "Connaught Place, Delhi",
    description:
      "Award-winning restaurant specializing in North Indian and Mughlai cuisine with live tandoor cooking.",
    details: "₹800–1500/head",
    service: "Spice Garden Restaurant Delhi",
    rating: 4.7,
    category: "Restaurant",
  },
  {
    title: "The Food Truck Co.",
    subtitle: "Bangalore",
    description:
      "Trendy mobile food trucks for corporate events, weddings, and street food festivals.",
    details: "₹300–600/plate",
    service: "The Food Truck Co. Bangalore",
    badge: "TRENDING",
    rating: 4.6,
    category: "Food Truck",
  },
  {
    title: "Cloud Kitchen Express",
    subtitle: "Pune, Maharashtra",
    description:
      "Fast delivery from cloud kitchen brands. Ideal for large corporate orders and multi-cuisine events.",
    details: "₹200–400/order",
    service: "Cloud Kitchen Express Pune",
    rating: 4.5,
    category: "Cloud Kitchen",
  },
  {
    title: "Luxury Bar & Lounge Goa",
    subtitle: "Goa",
    description:
      "Premium open bar services with craft cocktails, imported spirits, and professional bartenders.",
    details: "₹2,000/head",
    service: "Luxury Bar Lounge Goa",
    badge: "PREMIUM",
    rating: 4.7,
    category: "Bar",
  },
  {
    title: "Corporate Catering Services",
    subtitle: "Pan India",
    description:
      "Reliable corporate meal solutions for offices, conferences, team events, and boardroom meetings.",
    details: "₹350/plate",
    service: "Corporate Catering Services",
    rating: 4.5,
    category: "Catering",
  },
];

export default function FoodPage() {
  return (
    <div>
      <PageHeader
        title="Food & Beverage"
        subtitle="Catering, restaurants, and beverage services for every occasion"
        breadcrumb="Dining & Catering"
      />

      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
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
            {foodItems.map((item, i) => (
              <div key={item.title} className="relative">
                <div className="absolute top-3 right-3 z-10">
                  <Badge className="bg-black/70 text-white/80 border-0 text-xs backdrop-blur-sm">
                    {item.category}
                  </Badge>
                </div>
                <ServiceCard
                  {...item}
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
