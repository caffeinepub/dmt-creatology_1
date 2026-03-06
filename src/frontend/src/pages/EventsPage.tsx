import PageHeader from "@/components/PageHeader";
import ServiceCard from "@/components/ServiceCard";
import { Badge } from "@/components/ui/badge";

const IMG = "/assets/generated/hero-events.dim_800x450.jpg";

const events = [
  {
    title: "Sunburn Arena Mumbai",
    subtitle: "Mumbai, Maharashtra",
    description:
      "India's biggest EDM festival returns with world-class DJs and spectacular laser and pyrotechnic production.",
    details: "₹2,000 onwards",
    service: "Sunburn Arena Mumbai Event",
    badge: "FEATURED",
    rating: 4.9,
    genre: "EDM",
    date: "Dec 26-28, 2025",
  },
  {
    title: "NH7 Weekender Pune",
    subtitle: "Pune, Maharashtra",
    description:
      "Multi-genre music festival spanning 3 days with indie, folk, jazz, and electronic music across 4 stages.",
    details: "₹1,500 onwards",
    service: "NH7 Weekender Pune Event",
    badge: "TRENDING",
    rating: 4.8,
    genre: "Multi-Genre",
    date: "Nov 22-24, 2025",
  },
  {
    title: "Bollywood Night Delhi",
    subtitle: "Delhi",
    description:
      "A spectacular evening of classic and contemporary Bollywood with celebrity performances and live orchestra.",
    details: "₹1,200 onwards",
    service: "Bollywood Night Delhi",
    rating: 4.7,
    genre: "Bollywood",
    date: "Dec 31, 2025",
  },
  {
    title: "Techno Rave Bangalore",
    subtitle: "Bangalore, Karnataka",
    description:
      "Underground techno experience featuring international and local DJs in a massive warehouse venue.",
    details: "₹800 onwards",
    service: "Techno Rave Bangalore",
    badge: "SOLD OUT",
    rating: 4.6,
    genre: "Techno",
    date: "Jan 15, 2026",
  },
  {
    title: "Sufi Night Jaipur",
    subtitle: "Jaipur, Rajasthan",
    description:
      "Soulful Sufi music under the stars at a heritage fort. An evening of mystical music and poetry.",
    details: "₹600 onwards",
    service: "Sufi Night Jaipur",
    rating: 4.8,
    genre: "Sufi",
    date: "Jan 20, 2026",
  },
  {
    title: "Comedy Festival Hyderabad",
    subtitle: "Hyderabad, Telangana",
    description:
      "India's funniest comedians gather for a weekend of laughter, stand-up, and improv shows.",
    details: "₹500 onwards",
    service: "Comedy Festival Hyderabad",
    badge: "POPULAR",
    rating: 4.7,
    genre: "Comedy",
    date: "Feb 5-6, 2026",
  },
];

export default function EventsPage() {
  return (
    <div>
      <PageHeader
        title="Events"
        subtitle="Discover and book the hottest events happening across India"
        breadcrumb="Live Experiences"
      />

      <section className="py-10">
        <div className="container mx-auto px-4">
          {/* Genre tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              "All",
              "EDM",
              "Bollywood",
              "Multi-Genre",
              "Techno",
              "Sufi",
              "Comedy",
            ].map((genre) => (
              <Badge
                key={genre}
                variant={genre === "All" ? "default" : "outline"}
                className={
                  genre === "All"
                    ? "gradient-gold text-[oklch(0.1_0.01_260)] border-0 cursor-pointer"
                    : "border-border text-muted-foreground cursor-pointer hover:border-gold hover:text-gold"
                }
              >
                {genre}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, i) => (
              <div key={event.title} className="relative">
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 items-end">
                  <Badge className="bg-black/70 text-gold border-0 text-xs backdrop-blur-sm">
                    {event.genre}
                  </Badge>
                  <Badge className="bg-black/70 text-white/80 border-0 text-xs backdrop-blur-sm">
                    {event.date}
                  </Badge>
                </div>
                <ServiceCard {...event} image={IMG} index={i + 1} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
