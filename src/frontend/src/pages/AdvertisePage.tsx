import BookingModal from "@/components/BookingModal";
import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Crown,
  MessageCircle,
  Rocket,
  Star,
  Zap,
} from "lucide-react";
import { useState } from "react";

const listingPlans = [
  {
    price: "₹10",
    period: "1 Week",
    label: "Starter",
    features: ["Basic listing", "1 photo", "Contact visible"],
    popular: false,
  },
  {
    price: "₹100",
    period: "1 Month",
    label: "Basic",
    features: [
      "Standard listing",
      "3 photos",
      "Priority placement",
      "WhatsApp button",
    ],
    popular: false,
  },
  {
    price: "₹500",
    period: "3 Months",
    label: "Standard",
    features: [
      "Featured listing",
      "10 photos",
      "Priority placement",
      "Analytics",
      "WhatsApp + Call",
    ],
    popular: false,
  },
  {
    price: "₹1,000",
    period: "6 Months",
    label: "Professional",
    features: [
      "Premium listing",
      "Unlimited photos",
      "Top search results",
      "Full analytics",
      "Badge verified",
    ],
    popular: true,
  },
  {
    price: "₹2,500",
    period: "1 Year",
    label: "Business",
    features: [
      "Premium + listing",
      "Video upload",
      "Sponsored search",
      "Social sharing",
      "Brand logo",
    ],
    popular: false,
  },
  {
    price: "₹5,000",
    period: "1 Year",
    label: "Premium",
    features: [
      "All Business features",
      "Homepage spotlight",
      "Email marketing",
      "Dedicated support",
      "Priority booking",
    ],
    popular: false,
  },
  {
    price: "₹10,000",
    period: "1 Year",
    label: "Enterprise",
    features: [
      "Everything in Premium",
      "Nationwide featured",
      "PR campaign",
      "Custom landing page",
      "DMT Partnership",
    ],
    popular: false,
  },
];

const adPlans = [
  {
    icon: Zap,
    title: "Basic Ad",
    price: "₹10",
    description: "Boost your listing with basic visibility on category pages.",
    features: [
      "Category page display",
      "1 week duration",
      "Standard placement",
    ],
    service: "Basic Ad Plan ₹10",
  },
  {
    icon: Star,
    title: "Standard Ad",
    price: "₹100",
    description: "Reach more customers with standard advertising placement.",
    features: ["Search results boost", "1 month duration", "Mobile optimized"],
    service: "Standard Ad Plan ₹100",
  },
  {
    icon: Rocket,
    title: "Featured Ad",
    price: "₹1,000",
    description: "Get featured placement at the top of category pages.",
    features: ["Featured badge", "3 months duration", "Social media post"],
    badge: "POPULAR",
    service: "Featured Ad Plan ₹1000",
  },
  {
    icon: Crown,
    title: "Premium Ad",
    price: "₹5,000",
    description: "Maximum exposure across the entire platform.",
    features: ["All pages display", "6 months", "Email blast", "Analytics"],
    badge: "PREMIUM",
    service: "Premium Ad Plan ₹5000",
  },
  {
    icon: Crown,
    title: "Homepage Ad",
    price: "₹10,000",
    description: "Prime real estate on DMT Creatology's homepage.",
    features: ["Homepage banner", "1 year", "PR feature", "Custom creative"],
    badge: "EXCLUSIVE",
    service: "Homepage Ad Plan ₹10000",
  },
];

export default function AdvertisePage() {
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Advertise"
        subtitle="Reach millions of event-goers, planners, and businesses on DMT Creatology"
        breadcrumb="Advertising"
      />

      <section className="py-10">
        <div className="container mx-auto px-4 space-y-14">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Monthly Visitors", value: "5L+" },
              { label: "Listed Businesses", value: "10,000+" },
              { label: "Cities", value: "100+" },
              { label: "Categories", value: "50+" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-card border border-border rounded-xl p-4 text-center"
              >
                <p className="font-display font-black text-3xl text-gold">
                  {stat.value}
                </p>
                <p className="text-muted-foreground text-sm mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Listing Plans */}
          <div>
            <h2 className="font-display font-black text-2xl text-foreground mb-2">
              Listing Plans
            </h2>
            <p className="text-muted-foreground mb-6">
              Get your business listed on India's premier event platform
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {listingPlans.map((plan, i) => (
                <Card
                  key={plan.label}
                  className={`bg-card border ${plan.popular ? "border-gold gold-glow" : "border-border"} card-hover relative`}
                  data-ocid={`advertise.item.${i + 1}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="gradient-gold text-[oklch(0.1_0.01_260)] border-0 font-bold">
                        MOST POPULAR
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-5 space-y-4">
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wider">
                        {plan.label}
                      </p>
                      <p className="font-display font-black text-3xl text-gold mt-0.5">
                        {plan.price}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {plan.period}
                      </p>
                    </div>
                    <ul className="space-y-1.5">
                      {plan.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-gold shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full font-bold hover:opacity-90 ${plan.popular ? "gradient-gold text-[oklch(0.1_0.01_260)]" : "border-border"}`}
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => {
                        setSelected(
                          `Listing Plan: ${plan.label} (${plan.price} / ${plan.period})`,
                        );
                        setOpen(true);
                      }}
                      data-ocid="booking.open_modal_button"
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Ad Plans */}
          <div>
            <h2 className="font-display font-black text-2xl text-foreground mb-2">
              Advertisement Plans
            </h2>
            <p className="text-muted-foreground mb-6">
              Boost your visibility with targeted advertising campaigns
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {adPlans.map((plan, i) => (
                <Card
                  key={plan.title}
                  className="bg-card border-border card-hover"
                  data-ocid={`advertise.item.${i + 1}`}
                >
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                        <plan.icon className="w-5 h-5 text-gold" />
                      </div>
                      {plan.badge && (
                        <Badge className="gradient-gold text-[oklch(0.1_0.01_260)] border-0 text-xs">
                          {plan.badge}
                        </Badge>
                      )}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-foreground">
                        {plan.title}
                      </h3>
                      <p className="font-black text-gold text-2xl mt-0.5">
                        {plan.price}
                      </p>
                      <p className="text-muted-foreground text-sm mt-1">
                        {plan.description}
                      </p>
                    </div>
                    <ul className="space-y-1.5">
                      {plan.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-gold shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full gradient-gold text-[oklch(0.1_0.01_260)] font-bold hover:opacity-90"
                      onClick={() => {
                        setSelected(plan.service);
                        setOpen(true);
                      }}
                      data-ocid="booking.open_modal_button"
                    >
                      Book This Ad
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA WhatsApp */}
          <div className="bg-card border border-gold/30 rounded-2xl p-8 text-center space-y-4">
            <h3 className="font-display font-black text-2xl text-foreground">
              Need a Custom Package?
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Contact our advertising team for custom packages, agency deals, or
              large-scale campaigns.
            </p>
            <a
              href="https://wa.me/919821432904?text=Hi, I'm interested in advertising on DMT Creatology"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="gradient-gold text-[oklch(0.1_0.01_260)] font-bold px-10 hover:opacity-90"
                data-ocid="advertise.contact_button"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Contact Us on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      <BookingModal
        open={open}
        onClose={() => setOpen(false)}
        prefillService={selected}
      />
    </div>
  );
}
