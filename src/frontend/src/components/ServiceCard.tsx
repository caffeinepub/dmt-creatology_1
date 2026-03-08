import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FALLBACK_IMAGES } from "@/lib/fallbackImages";
import { MapPin, Star } from "lucide-react";
import { useState } from "react";
import BookingModal from "./BookingModal";

interface ServiceCardProps {
  image: string;
  /** Fallback image src shown when `image` fails to load or is empty */
  fallbackSrc?: string;
  title: string;
  subtitle?: string;
  description: string;
  details?: string;
  service: string;
  badge?: string;
  rating?: number;
  buttonLabel?: string;
  index?: number;
}

export default function ServiceCard({
  image,
  fallbackSrc = FALLBACK_IMAGES.event,
  title,
  subtitle,
  description,
  details,
  service,
  badge,
  rating,
  buttonLabel = "Book Now",
  index = 1,
}: ServiceCardProps) {
  const [open, setOpen] = useState(false);

  // Resolve image: if empty/missing, use fallback immediately
  const resolvedSrc = image && image.trim() !== "" ? image : fallbackSrc;

  return (
    <>
      <Card
        className="bg-card border-border overflow-hidden card-hover group"
        data-ocid={`service.item.${index}`}
      >
        <div className="relative overflow-hidden h-48">
          <img
            src={resolvedSrc}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackSrc;
            }}
          />
          {badge && (
            <Badge className="absolute top-3 left-3 gradient-gold text-[oklch(0.1_0.01_260)] font-bold border-0 text-xs">
              {badge}
            </Badge>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-display font-bold text-foreground text-lg leading-tight">
              {title}
            </h3>
            {subtitle && (
              <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
                <MapPin className="w-3 h-3 text-gold" />
                <span>{subtitle}</span>
              </div>
            )}
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
            {description}
          </p>

          <div className="flex items-center justify-between pt-1">
            <div className="space-y-0.5">
              {details && (
                <p className="text-gold font-bold text-sm">{details}</p>
              )}
              {rating && (
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${star <= Math.floor(rating) ? "text-gold fill-gold" : "text-muted-foreground"}`}
                    />
                  ))}
                  <span className="text-muted-foreground text-xs ml-0.5">
                    {rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            <Button
              size="sm"
              className="gradient-gold text-[oklch(0.1_0.01_260)] font-bold hover:opacity-90 transition-opacity shrink-0"
              onClick={() => setOpen(true)}
              data-ocid="booking.open_modal_button"
            >
              {buttonLabel}
            </Button>
          </div>
        </CardContent>
      </Card>

      <BookingModal
        open={open}
        onClose={() => setOpen(false)}
        prefillService={service}
        buttonLabel={buttonLabel}
      />
    </>
  );
}
