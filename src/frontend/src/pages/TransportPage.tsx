import PageHeader from "@/components/PageHeader";
import ServiceCard from "@/components/ServiceCard";
import { Car, Plane, Train, Waves } from "lucide-react";

const IMG = "/assets/generated/transport-luxury.dim_600x400.jpg";

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
    icon: Waves,
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

export default function TransportPage() {
  return (
    <div>
      <PageHeader
        title="Transport"
        subtitle="Premium transportation by road, air, water, and rail across India"
        breadcrumb="Transportation"
      />

      <section className="py-10">
        <div className="container mx-auto px-4 space-y-14">
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
                    index={i + 1}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
