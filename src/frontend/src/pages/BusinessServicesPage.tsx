import PageHeader from "@/components/PageHeader";
import ServiceCard from "@/components/ServiceCard";

const IMG = "/assets/generated/vendor-photographer.dim_600x400.jpg";

const services = [
  {
    title: "Legal Contracts & Compliance",
    subtitle: "Legal Services",
    description:
      "Professional legal contracts for events, vendor agreements, artist deals, and compliance documentation.",
    details: "₹5,000 onwards",
    service: "Legal Contracts Service",
    badge: "ESSENTIAL",
    rating: 4.8,
  },
  {
    title: "Event Finance Planning",
    subtitle: "Finance Services",
    description:
      "Complete event budgeting, financial planning, revenue tracking, and expense management.",
    details: "₹8,000/project",
    service: "Event Finance Planning",
    rating: 4.7,
  },
  {
    title: "Brand Marketing & PR",
    subtitle: "Marketing Services",
    description:
      "Strategic brand marketing, public relations, press releases, and media coverage for events and businesses.",
    details: "₹15,000/month",
    service: "Brand Marketing PR Service",
    badge: "POPULAR",
    rating: 4.7,
  },
  {
    title: "Event Production Services",
    subtitle: "Production",
    description:
      "End-to-end event production including scheduling, vendor coordination, risk assessment, and execution.",
    details: "₹25,000+",
    service: "Event Production Service",
    badge: "FULL SERVICE",
    rating: 4.9,
  },
  {
    title: "Advertising Campaigns",
    subtitle: "Advertising",
    description:
      "Multi-channel advertising campaigns on social media, Google, OTT, and print for maximum reach.",
    details: "₹10,000/month",
    service: "Advertising Campaign Service",
    rating: 4.6,
  },
  {
    title: "Business Consulting",
    subtitle: "Consulting",
    description:
      "Strategic consulting for event businesses, venue operators, hospitality brands, and entertainment startups.",
    details: "₹12,000/session",
    service: "Business Consulting Service",
    badge: "EXPERT",
    rating: 4.8,
  },
];

export default function BusinessServicesPage() {
  return (
    <div>
      <PageHeader
        title="Business Services"
        subtitle="Legal, finance, marketing, and consulting services for event professionals"
        breadcrumb="Professional Services"
      />

      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <ServiceCard
                key={service.title}
                {...service}
                image={IMG}
                index={i + 1}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
