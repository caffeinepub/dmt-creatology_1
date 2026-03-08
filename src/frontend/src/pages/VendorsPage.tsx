import PageHeader from "@/components/PageHeader";
import ServiceCard from "@/components/ServiceCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApprovedVendors } from "@/hooks/useVendorQueries";
import { FALLBACK_IMAGES } from "@/lib/fallbackImages";
import { Link } from "@tanstack/react-router";
import { Store } from "lucide-react";
import { useState } from "react";

const FALLBACK_IMG = FALLBACK_IMAGES.vendor;

const HARDCODED_VENDORS = [
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

const CATEGORIES = [
  "All",
  "Photography",
  "Makeup",
  "Decoration",
  "DJ",
  "Sound & Lights",
  "Wedding Planning",
];

export default function VendorsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: approvedVendors } = useApprovedVendors();

  // Build vendor cards from approved vendors if available, otherwise fall back
  const liveVendors =
    approvedVendors && approvedVendors.length > 0
      ? approvedVendors.map((v) => ({
          title: v.businessName,
          subtitle: v.city,
          description: v.description,
          details: undefined as string | undefined,
          service: v.businessName,
          badge: undefined as string | undefined,
          rating: undefined as number | undefined,
          category: v.serviceCategory,
          experience: undefined as string | undefined,
          image: v.portfolioImages[0] ?? FALLBACK_IMG,
        }))
      : null;

  const displayVendors = liveVendors ?? HARDCODED_VENDORS;

  // Filter by category (using startsWith to handle similar names)
  const filteredVendors =
    activeCategory === "All"
      ? displayVendors
      : displayVendors.filter((v) =>
          v.category.toLowerCase().includes(activeCategory.toLowerCase()),
        );

  return (
    <div>
      <PageHeader
        title="Vendors"
        subtitle="Trusted professionals for photography, decoration, DJ, and event production"
        breadcrumb="Service Vendors"
      />

      {/* Vendor CTA Banner */}
      <section className="py-6 border-b border-border">
        <div className="container mx-auto px-4">
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gold/5 border border-gold/20 rounded-2xl px-6 py-4"
            data-ocid="vendor.cta.panel"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                <Store className="text-gold" size={20} />
              </div>
              <div>
                <p className="text-white font-display font-bold text-base leading-tight">
                  Are you a vendor?
                </p>
                <p className="text-muted-foreground text-sm">
                  Join DMT CREATOLOGY and reach thousands of customers
                </p>
              </div>
            </div>
            <Link to="/vendor/register">
              <Button
                className="gradient-gold text-[oklch(0.1_0.01_260)] font-bold whitespace-nowrap shrink-0"
                data-ocid="vendor.register.primary_button"
              >
                Register as Vendor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map((cat) => (
              <Badge
                key={cat}
                variant={cat === activeCategory ? "default" : "outline"}
                className={
                  cat === activeCategory
                    ? "gradient-gold text-[oklch(0.1_0.01_260)] border-0 cursor-pointer"
                    : "border-border text-muted-foreground cursor-pointer hover:border-gold hover:text-gold"
                }
                onClick={() => setActiveCategory(cat)}
                data-ocid={"vendor.filter.tab"}
              >
                {cat}
              </Badge>
            ))}
          </div>

          {filteredVendors.length === 0 ? (
            <div
              className="text-center py-16 text-slate-500"
              data-ocid="vendor.list.empty_state"
            >
              <p className="font-display text-base font-semibold text-slate-400 mb-1">
                No vendors in this category
              </p>
              <p className="text-sm">Check back soon or view all categories.</p>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="vendor.list"
            >
              {filteredVendors.map((vendor, i) => (
                <div key={`${vendor.title}-${i}`} className="relative">
                  <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 items-end">
                    <Badge className="bg-black/70 text-white/80 border-0 text-xs backdrop-blur-sm">
                      {vendor.category}
                    </Badge>
                    {vendor.experience && (
                      <Badge className="bg-black/70 text-gold/80 border-0 text-xs backdrop-blur-sm">
                        {vendor.experience}
                      </Badge>
                    )}
                  </div>
                  <ServiceCard
                    title={vendor.title}
                    subtitle={vendor.subtitle}
                    description={vendor.description}
                    details={vendor.details}
                    service={vendor.service}
                    badge={vendor.badge}
                    rating={vendor.rating}
                    image={
                      "image" in vendor
                        ? vendor.image || FALLBACK_IMG
                        : FALLBACK_IMG
                    }
                    fallbackSrc={FALLBACK_IMG}
                    index={i + 1}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
