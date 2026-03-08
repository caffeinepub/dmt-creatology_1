import PageHeader from "@/components/PageHeader";
import ServiceCard from "@/components/ServiceCard";
import { Badge } from "@/components/ui/badge";
import { FALLBACK_IMAGES } from "@/lib/fallbackImages";

const IMG = FALLBACK_IMAGES.artist;

const artists = [
  {
    title: "DJ Arjun Singh",
    subtitle: "Mumbai, Maharashtra",
    description:
      "Top-rated DJ with 10+ years of experience in EDM, Bollywood, and Fusion. Has performed at 500+ events.",
    details: "₹50,000/event",
    service: "DJ Arjun Singh Performance",
    badge: "TOP RATED",
    rating: 5.0,
    category: "DJ",
    followers: "250K",
  },
  {
    title: "Priya Sharma",
    subtitle: "Delhi",
    description:
      "Professional model and brand ambassador for luxury fashion events, product launches, and runway shows.",
    details: "₹25,000/event",
    service: "Priya Sharma Model Booking",
    badge: "VERIFIED",
    rating: 4.9,
    category: "Model",
    followers: "180K",
  },
  {
    title: "Vikram Comedy",
    subtitle: "Bangalore, Karnataka",
    description:
      "Stand-up comedian with Netflix special. Performs in Hindi and English. Corporate events a specialty.",
    details: "₹40,000/show",
    service: "Vikram Comedy Show",
    badge: "NETFLIX",
    rating: 4.8,
    category: "Comedian",
    followers: "500K",
  },
  {
    title: "Naina Influencer",
    subtitle: "Mumbai, Maharashtra",
    description:
      "Lifestyle and fashion influencer with 2M+ followers. Brand collaborations, events, and promotions.",
    details: "₹30,000/event",
    service: "Naina Influencer Collaboration",
    rating: 4.7,
    category: "Influencer",
    followers: "2M",
  },
  {
    title: "Raaga Band",
    subtitle: "Pune, Maharashtra",
    description:
      "Award-winning 6-piece fusion band blending classical Indian ragas with jazz and contemporary sounds.",
    details: "₹80,000/event",
    service: "Raaga Band Performance",
    badge: "AWARD WINNING",
    rating: 4.8,
    category: "Band",
    followers: "120K",
  },
  {
    title: "Zara Khan",
    subtitle: "Delhi",
    description:
      "Versatile playback singer and live performer specializing in Bollywood, sufi, and ghazals.",
    details: "₹35,000/event",
    service: "Zara Khan Performance",
    badge: "PLAYBACK",
    rating: 4.9,
    category: "Singer",
    followers: "380K",
  },
];

export default function ArtistsPage() {
  return (
    <div>
      <PageHeader
        title="Artists"
        subtitle="Discover and book top performers, models, influencers, and entertainers"
        breadcrumb="Talent Directory"
      />

      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              "All",
              "DJ",
              "Model",
              "Comedian",
              "Influencer",
              "Band",
              "Singer",
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
            {artists.map((artist, i) => (
              <div key={artist.title} className="relative">
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 items-end">
                  <Badge className="bg-black/70 text-white/80 border-0 text-xs backdrop-blur-sm">
                    {artist.category}
                  </Badge>
                  <Badge className="bg-black/70 text-gold/80 border-0 text-xs backdrop-blur-sm">
                    {artist.followers} followers
                  </Badge>
                </div>
                <ServiceCard
                  {...artist}
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
