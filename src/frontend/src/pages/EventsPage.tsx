import EventBookingModal from "@/components/EventBookingModal";
import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublishedEvents } from "@/hooks/useAdminQueries";
import { FALLBACK_IMAGES } from "@/lib/fallbackImages";
import { CalendarDays, MapPin, Music, Star, Tag } from "lucide-react";
import { useState } from "react";
// Event type - defined locally since it was removed from the reduced backend.d.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Event = any;

const FALLBACK_IMG = FALLBACK_IMAGES.event;

function formatNanoDate(ns: bigint): string {
  return new Date(Number(ns) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const GENRES = [
  "All",
  "Music",
  "Comedy",
  "Sports",
  "Theatre",
  "Dance",
  "Festival",
  "Other",
];

function EventCard({ event, index }: { event: Event; index: number }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Card
        className="bg-card border-border overflow-hidden card-hover group"
        data-ocid={`events.item.${index}`}
      >
        <div className="relative overflow-hidden h-48">
          <img
            src={event.posterUrl || FALLBACK_IMG}
            alt={event.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_IMG;
            }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Overlay badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-1">
            <Badge className="bg-black/70 text-gold border-0 text-xs backdrop-blur-sm truncate max-w-[120px]">
              {event.category}
            </Badge>
            <Badge className="bg-black/70 text-white/80 border-0 text-xs backdrop-blur-sm shrink-0">
              {formatNanoDate(event.date)}
            </Badge>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-display font-bold text-foreground text-lg leading-tight line-clamp-1">
              {event.name}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
              <MapPin className="w-3 h-3 text-gold shrink-0" />
              <span className="truncate">
                {event.venue ? `${event.venue}, ` : ""}
                {event.city}
              </span>
            </div>
          </div>

          {event.description && (
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
              {event.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-1 gap-2">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {event.time && (
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-3 h-3 text-gold" />
                  {event.time}
                </span>
              )}
              {event.subCategory && (
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3 text-gold" />
                  {event.subCategory}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="shrink-0 px-3 py-1.5 gradient-gold text-[oklch(0.1_0.01_260)] font-bold text-sm rounded-md hover:opacity-90 transition-opacity"
              data-ocid={`events.book_button.${index}`}
            >
              Book Event
            </button>
          </div>
        </CardContent>
      </Card>

      <EventBookingModal
        event={event}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

const STATIC_EVENTS = [
  {
    id: -1n,
    name: "Sunburn Arena Mumbai",
    category: "Music",
    subCategory: "EDM",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    venue: "MMRDA Grounds, BKC",
    date: BigInt(new Date("2025-12-26").getTime() * 1_000_000),
    time: "6:00 PM",
    duration: "3 days",
    ageLimit: 18n,
    description:
      "India's biggest EDM festival returns with world-class DJs and spectacular laser and pyrotechnic production.",
    posterUrl: FALLBACK_IMG,
    bannerUrl: "",
    status: "published" as const,
    createdAt: 0n,
  },
  {
    id: -2n,
    name: "NH7 Weekender Pune",
    category: "Music",
    subCategory: "Multi-Genre",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    venue: "Shivaji Stadium",
    date: BigInt(new Date("2025-11-22").getTime() * 1_000_000),
    time: "4:00 PM",
    duration: "3 days",
    ageLimit: 16n,
    description:
      "Multi-genre music festival spanning 3 days with indie, folk, jazz, and electronic music across 4 stages.",
    posterUrl: FALLBACK_IMG,
    bannerUrl: "",
    status: "published" as const,
    createdAt: 0n,
  },
  {
    id: -3n,
    name: "Bollywood Night Delhi",
    category: "Music",
    subCategory: "Bollywood",
    city: "Delhi",
    state: "Delhi",
    country: "India",
    venue: "Jawaharlal Nehru Stadium",
    date: BigInt(new Date("2025-12-31").getTime() * 1_000_000),
    time: "8:00 PM",
    duration: "4 hours",
    ageLimit: 0n,
    description:
      "A spectacular evening of classic and contemporary Bollywood with celebrity performances and live orchestra.",
    posterUrl: FALLBACK_IMG,
    bannerUrl: "",
    status: "published" as const,
    createdAt: 0n,
  },
  {
    id: -4n,
    name: "Comedy Festival Hyderabad",
    category: "Comedy",
    subCategory: "Stand-up",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    venue: "Hitex Exhibition Centre",
    date: BigInt(new Date("2026-02-05").getTime() * 1_000_000),
    time: "7:00 PM",
    duration: "2 days",
    ageLimit: 18n,
    description:
      "India's funniest comedians gather for a weekend of laughter, stand-up, and improv shows.",
    posterUrl: FALLBACK_IMG,
    bannerUrl: "",
    status: "published" as const,
    createdAt: 0n,
  },
  {
    id: -5n,
    name: "Sufi Night Jaipur",
    category: "Music",
    subCategory: "Sufi",
    city: "Jaipur",
    state: "Rajasthan",
    country: "India",
    venue: "Amber Fort Grounds",
    date: BigInt(new Date("2026-01-20").getTime() * 1_000_000),
    time: "7:30 PM",
    duration: "3 hours",
    ageLimit: 0n,
    description:
      "Soulful Sufi music under the stars at a heritage fort. An evening of mystical music and poetry.",
    posterUrl: FALLBACK_IMG,
    bannerUrl: "",
    status: "published" as const,
    createdAt: 0n,
  },
  {
    id: -6n,
    name: "Techno Rave Bangalore",
    category: "Music",
    subCategory: "Techno",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    venue: "Phoenix MarketCity",
    date: BigInt(new Date("2026-01-15").getTime() * 1_000_000),
    time: "10:00 PM",
    duration: "8 hours",
    ageLimit: 21n,
    description:
      "Underground techno experience featuring international and local DJs in a massive warehouse venue.",
    posterUrl: FALLBACK_IMG,
    bannerUrl: "",
    status: "published" as const,
    createdAt: 0n,
  },
];

export default function EventsPage() {
  const { data: liveEvents, isLoading } = usePublishedEvents();
  const [activeGenre, setActiveGenre] = useState("All");

  // Merge: prefer live events, fall back to static sample content
  const allEvents: Event[] =
    liveEvents && liveEvents.length > 0
      ? (liveEvents as Event[])
      : (STATIC_EVENTS as unknown as Event[]);

  const filteredEvents =
    activeGenre === "All"
      ? allEvents
      : allEvents.filter(
          (e) =>
            e.category.toLowerCase() === activeGenre.toLowerCase() ||
            e.subCategory.toLowerCase() === activeGenre.toLowerCase(),
        );

  return (
    <div>
      <PageHeader
        title="Events"
        subtitle="Discover and book the hottest events happening across India"
        breadcrumb="Live Experiences"
      />

      <section className="py-10">
        <div className="container mx-auto px-4">
          {/* Genre filter badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            {GENRES.map((genre) => (
              <Badge
                key={genre}
                variant={activeGenre === genre ? "default" : "outline"}
                className={
                  activeGenre === genre
                    ? "gradient-gold text-[oklch(0.1_0.01_260)] border-0 cursor-pointer"
                    : "border-border text-muted-foreground cursor-pointer hover:border-gold hover:text-gold"
                }
                onClick={() => setActiveGenre(genre)}
                data-ocid="events.genre.tab"
              >
                {genre}
              </Badge>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full bg-muted rounded-xl" />
                  <Skeleton className="h-5 w-3/4 bg-muted" />
                  <Skeleton className="h-4 w-1/2 bg-muted" />
                  <Skeleton className="h-8 w-full bg-muted" />
                </div>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div
              className="text-center py-20 text-muted-foreground"
              data-ocid="events.empty_state"
            >
              <Music className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="font-display text-lg font-semibold text-foreground mb-1">
                No upcoming events
              </p>
              <p className="text-sm">
                {activeGenre === "All"
                  ? "Check back soon — new events are added regularly."
                  : `No ${activeGenre} events found. Try a different category.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, i) => (
                <EventCard key={String(event.id)} event={event} index={i + 1} />
              ))}
            </div>
          )}

          {/* Live indicator — shown when events come from backend */}
          {liveEvents && liveEvents.length > 0 && (
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Showing {liveEvents.length} live event
              {liveEvents.length !== 1 ? "s" : ""} from the platform
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
