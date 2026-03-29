import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Printer,
  User,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { useEffect, useState } from "react";

interface FoodBookingData {
  bookingId: string;
  vendorName: string;
  cuisineType: string;
  city: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  eventDate: string;
  guestCount: number;
  eventLocation: string;
  specialRequests: string;
  pricePerPlate: number;
  totalAmount: number;
  paymentId: string;
  timestamp: number;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTs(ts: number): string {
  return new Date(ts).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function FoodConfirmationPage() {
  const { bookingId } = useParams({ strict: false });
  const [booking, setBooking] = useState<FoodBookingData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!bookingId) {
      setNotFound(true);
      return;
    }
    const stored = localStorage.getItem(`food-booking-${bookingId}`);
    if (!stored) {
      setNotFound(true);
      return;
    }
    try {
      setBooking(JSON.parse(stored));
    } catch {
      setNotFound(true);
    }
  }, [bookingId]);

  const handleWhatsApp = () => {
    if (!booking) return;
    const msg = `*Catering Booking Confirmation — DMT CREATOLOGY*

Booking ID: #${booking.bookingId}
Caterer: ${booking.vendorName}
Cuisine: ${booking.cuisineType}
City: ${booking.city}
Contact: ${booking.guestName}
Phone: ${booking.guestPhone}
Event Date: ${formatDate(booking.eventDate)}
Guest Count: ${booking.guestCount}
Event Location: ${booking.eventLocation}
Total Paid: ₹${booking.totalAmount.toLocaleString("en-IN")}
Payment ID: ${booking.paymentId}

Booked via DMT CREATOLOGY`;
    window.open(
      `https://wa.me/919821432904?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  if (notFound) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <UtensilsCrossed className="w-8 h-8 text-muted-foreground" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Booking Not Found
          </h2>
          <p className="text-muted-foreground text-sm max-w-xs">
            This booking could not be found. Confirmations are stored on this
            device — please check using the same browser you booked with.
          </p>
        </div>
        <a
          href="/food"
          className="flex items-center gap-2 text-red-500 hover:underline text-sm font-medium"
          data-ocid="food-confirmation.back.link"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Food & Catering
        </a>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4" data-ocid="food-confirmation.page">
      <div className="container mx-auto max-w-md">
        {/* Back link */}
        <div className="flex items-center gap-3 mb-8">
          <a
            href="/food"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors"
            data-ocid="food-confirmation.back.link"
          >
            <ArrowLeft className="w-4 h-4" />
            Food & Catering
          </a>
          <span className="text-border">/</span>
          <span className="text-foreground text-sm font-medium flex items-center gap-1.5">
            <UtensilsCrossed className="w-4 h-4 text-red-500" />
            Booking Confirmation
          </span>
        </div>

        <h1 className="font-display text-3xl font-black text-foreground mb-6 text-center">
          Booking <span className="text-red-500">Confirmed</span>
        </h1>

        {/* Confirmation Card */}
        <div
          className="relative bg-[oklch(0.16_0.018_260)] rounded-2xl overflow-hidden border border-border shadow-2xl"
          data-ocid="food-confirmation.card"
        >
          <div className="h-1.5 bg-gradient-to-r from-red-600 to-red-400 w-full" />

          {/* Success header */}
          <div className="px-6 pt-6 pb-5 bg-[oklch(0.13_0.018_260)] flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-red-400 font-display font-bold uppercase tracking-widest mb-1">
                DMT CREATOLOGY
              </p>
              <p className="text-muted-foreground text-xs">Booking ID</p>
              <p className="font-mono font-bold text-red-500 text-xl tracking-wider">
                #{booking.bookingId}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="px-6 py-5 space-y-4">
            {/* Caterer info */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Caterer
              </p>
              <h2 className="font-display font-black text-foreground text-2xl leading-tight">
                {booking.vendorName}
              </h2>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="border-red-500/40 text-red-400 text-xs font-semibold px-3 py-1"
                >
                  <UtensilsCrossed className="w-3 h-3 mr-1.5" />
                  {booking.cuisineType}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-border text-muted-foreground text-xs px-3 py-1"
                >
                  <MapPin className="w-3 h-3 mr-1.5" />
                  {booking.city}
                </Badge>
              </div>
            </div>

            {/* Contact info */}
            <div className="flex items-center gap-3 bg-[oklch(0.18_0.03_260)] rounded-xl px-4 py-3">
              <User className="w-4 h-4 text-red-400 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Contact
                </p>
                <p className="text-foreground font-semibold text-sm">
                  {booking.guestName}
                </p>
                <p className="text-muted-foreground text-xs">
                  {booking.guestPhone}
                </p>
                {booking.guestEmail && (
                  <p className="text-muted-foreground text-xs">
                    {booking.guestEmail}
                  </p>
                )}
              </div>
            </div>

            {/* Event Date */}
            <div className="bg-[oklch(0.18_0.03_260)] rounded-xl px-4 py-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-red-400" />
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Event Date
                </p>
              </div>
              <p className="text-foreground font-semibold text-sm">
                {formatDate(booking.eventDate)}
              </p>
            </div>

            {/* Guest count & Location */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[oklch(0.18_0.03_260)] rounded-xl px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Users className="w-3.5 h-3.5 text-red-400" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Guests
                  </p>
                </div>
                <p className="text-foreground font-semibold text-sm">
                  {booking.guestCount.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="bg-[oklch(0.18_0.03_260)] rounded-xl px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Location
                  </p>
                </div>
                <p className="text-foreground font-semibold text-sm line-clamp-2">
                  {booking.eventLocation}
                </p>
              </div>
            </div>

            {/* Special requests */}
            {booking.specialRequests && (
              <div className="bg-[oklch(0.18_0.03_260)] rounded-xl px-4 py-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Special Requests
                </p>
                <p className="text-foreground text-sm leading-relaxed">
                  {booking.specialRequests}
                </p>
              </div>
            )}

            {/* Payment summary */}
            <div className="bg-[oklch(0.18_0.03_260)] rounded-xl px-4 py-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Price per Plate
                </span>
                <span className="text-foreground text-sm">
                  ₹{booking.pricePerPlate.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Guests</span>
                <span className="text-foreground text-sm">
                  {booking.guestCount.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-foreground font-semibold text-sm">
                  Total Paid
                </span>
                <span className="text-green-400 font-bold text-lg">
                  ₹{booking.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Payment ref */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Payment Reference
              </p>
              <p className="font-mono text-xs text-foreground bg-[oklch(0.18_0.03_260)] rounded-lg px-3 py-2 break-all">
                {booking.paymentId}
              </p>
              <p className="text-[10px] text-muted-foreground">
                Booked on {formatTs(booking.timestamp)}
              </p>
            </div>
          </div>

          <div className="h-1.5 bg-gradient-to-r from-red-600 to-red-400 w-full" />
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleWhatsApp}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-2"
            data-ocid="food-confirmation.whatsapp.button"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp Support
          </Button>
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="flex-1 border-border hover:bg-muted text-foreground font-semibold flex items-center gap-2"
            data-ocid="food-confirmation.print_button"
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>
        </div>

        <div className="mt-3">
          <a href="/food" className="w-full block">
            <Button
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground flex items-center gap-2"
              data-ocid="food-confirmation.back.button"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Food & Catering
            </Button>
          </a>
        </div>

        <p className="mt-4 text-xs text-muted-foreground text-center">
          Please save your booking confirmation. Present Booking ID to caterer.
        </p>
      </div>
    </div>
  );
}
