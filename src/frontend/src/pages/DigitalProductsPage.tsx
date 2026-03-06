import BookingModal from "@/components/BookingModal";
import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bot,
  CheckCircle,
  Globe,
  Palette,
  Search,
  Smartphone,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

const products = [
  {
    icon: Globe,
    title: "Website Development",
    description:
      "Custom websites built with modern tech. E-commerce, portfolio, business, and enterprise solutions.",
    price: "₹15,000+",
    features: [
      "Responsive Design",
      "SEO Ready",
      "CMS Integration",
      "1 Year Support",
    ],
    service: "Website Development Service",
    badge: "POPULAR",
    turnaround: "7–14 days",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description:
      "Native and cross-platform apps for iOS and Android with modern UI/UX and backend integration.",
    price: "₹50,000+",
    features: [
      "iOS & Android",
      "Push Notifications",
      "Offline Support",
      "App Store Launch",
    ],
    service: "Mobile App Development Service",
    badge: "PREMIUM",
    turnaround: "30–60 days",
  },
  {
    icon: TrendingUp,
    title: "Digital Marketing Package",
    description:
      "Complete digital marketing strategy including social media, paid ads, and content creation.",
    price: "₹5,000/mo",
    features: [
      "Social Media Mgmt",
      "Paid Campaigns",
      "Monthly Reports",
      "Brand Strategy",
    ],
    service: "Digital Marketing Service",
    badge: "TRENDING",
    turnaround: "Ongoing",
  },
  {
    icon: Search,
    title: "SEO Services",
    description:
      "Rank higher on Google with technical SEO, content optimization, and link building.",
    price: "₹3,000/mo",
    features: ["Keyword Research", "On-Page SEO", "Backlinks", "Monthly Audit"],
    service: "SEO Services",
    turnaround: "Ongoing",
  },
  {
    icon: Palette,
    title: "Graphic Design",
    description:
      "Professional logo, brand identity, print media, social creatives, and packaging design.",
    price: "₹2,000+",
    features: [
      "Logo Design",
      "Brand Kit",
      "Social Creatives",
      "Print Ready Files",
    ],
    service: "Graphic Design Service",
    turnaround: "3–7 days",
  },
  {
    icon: Bot,
    title: "AI Business Tools",
    description:
      "AI-powered automation, chatbots, content generation, and analytics tools for your business.",
    price: "₹1,000/mo",
    features: ["AI Chatbot", "Content AI", "Analytics", "Automation"],
    service: "AI Business Tools Service",
    badge: "NEW",
    turnaround: "Ongoing",
  },
];

export default function DigitalProductsPage() {
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Digital Products"
        subtitle="Websites, apps, marketing, and AI tools to grow your business online"
        breadcrumb="Digital Services"
      />

      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <Card
                key={product.title}
                className="bg-card border-border card-hover flex flex-col"
                data-ocid={`digital.item.${i + 1}`}
              >
                <CardContent className="p-6 flex flex-col flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                      <product.icon className="w-6 h-6 text-gold" />
                    </div>
                    {product.badge && (
                      <Badge className="gradient-gold text-[oklch(0.1_0.01_260)] border-0 text-xs">
                        {product.badge}
                      </Badge>
                    )}
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-xl text-foreground">
                      {product.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <ul className="space-y-1.5 flex-1">
                    {product.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-gold shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-end justify-between pt-2 border-t border-border">
                    <div>
                      <p className="text-gold font-black text-2xl">
                        {product.price}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Delivery: {product.turnaround}
                      </p>
                    </div>
                    <Button
                      className="gradient-gold text-[oklch(0.1_0.01_260)] font-bold hover:opacity-90"
                      onClick={() => {
                        setSelected(product.service);
                        setOpen(true);
                      }}
                      data-ocid="booking.open_modal_button"
                    >
                      Buy Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <BookingModal
        open={open}
        onClose={() => setOpen(false)}
        prefillService={selected}
        buttonLabel="Buy Now"
      />
    </div>
  );
}
