import PageHeader from "@/components/PageHeader";
import VenueBookingModal from "@/components/VenueBookingModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllVenues } from "@/hooks/useVenueQueries";
import { FALLBACK_IMAGES, resolveImage } from "@/lib/fallbackImages";
import { Building2, MapPin, Users } from "lucide-react";
import { useState } from "react";
import type { Venue } from "../backend.d";

export default function VenuesPage() {
  const { data: venues, isLoading } = useAllVenues();
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  return (
    <div data-ocid="venues.page">
      <PageHeader
        title="Party Venues"
        subtitle="Premium banquet halls, wedding lawns, clubs &amp; conference spaces across India"
      />

      <div className="container mx-auto px-4 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden border border-border bg-card"
              >
                <Skeleton className="h-52 w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : !venues?.length ? (
          <div
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="venues.empty_state"
          >
            <Building2 className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No venues listed yet
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Venue listings will appear here once they are added by the admin.
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="venues.list"
          >
            {venues.map((venue, i) => (
              <div
                key={String(venue.id)}
                className="group rounded-2xl overflow-hidden border border-border bg-card hover:border-gold/40 transition-all duration-300 hover:shadow-lg hover:shadow-gold/5 flex flex-col"
                data-ocid={`venues.item.${i + 1}`}
              >
                {/* Photo */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={resolveImage(venue.photoUrls[0], "venue")}
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        FALLBACK_IMAGES.venue;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-white font-bold text-sm drop-shadow">
                      ₹{Number(venue.pricePerDay).toLocaleString("en-IN")}/day
                    </span>
                    <div className="flex items-center gap-1 text-white text-xs bg-black/40 rounded-full px-2 py-1">
                      <Users size={11} />
                      <span>
                        {Number(venue.capacity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-display font-bold text-foreground text-lg leading-snug mb-1">
                    {venue.name}
                  </h3>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                    <MapPin size={13} />
                    <span>{venue.city}</span>
                  </div>

                  {venue.description && (
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3 line-clamp-2">
                      {venue.description}
                    </p>
                  )}

                  {/* Amenities */}
                  {venue.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {venue.amenities.slice(0, 4).map((a) => (
                        <Badge
                          key={a}
                          variant="outline"
                          className="text-[10px] px-2 py-0 border-border text-muted-foreground"
                        >
                          {a}
                        </Badge>
                      ))}
                      {venue.amenities.length > 4 && (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-2 py-0 border-border text-muted-foreground"
                        >
                          +{venue.amenities.length - 4} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="mt-auto">
                    <Button
                      onClick={() => setSelectedVenue(venue)}
                      className="w-full bg-gold text-slate-950 hover:bg-gold/90 font-semibold"
                      data-ocid={`venues.book.primary_button.${i + 1}`}
                    >
                      Book Venue
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedVenue && (
        <VenueBookingModal
          open={!!selectedVenue}
          onClose={() => setSelectedVenue(null)}
          venue={selectedVenue}
        />
      )}
    </div>
  );
}
