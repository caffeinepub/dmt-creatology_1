import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bus,
  Calendar,
  Car,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Plane,
  Ship,
  Train,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface TransportBookingData {
  bookingId: string;
  transportName: string;
  transportType: string;
  operatorName: string;
  route: string;
  city: string;
  passengerName: string;
  passengerPhone: string;
  passengerEmail: string;
  travelDate: string;
  seats: number;
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

function getTransportTypeIcon(type: string) {
  const lower = type.toLowerCase();
  if (lower === "bus") return Bus;
  if (lower === "flight" || lower === "helicopter") return Plane;
  if (lower === "train") return Train;
  if (lower === "cruise") return Ship;
  return Car;
}

function getTransportLabel(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

export default function TransportConfirmationPage() {
  const { bookingId } = useParams({ strict: false });
  const [booking, setBooking] = useState<TransportBookingData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!bookingId) {
      setNotFound(true);
      return;
    }
    const stored = localStorage.getItem(`transport-booking-${bookingId}`);
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
    const msg = `*Transport Booking Confirmation — DMT CREATOLOGY*

Booking ID: #${booking.bookingId}
Transport: ${getTransportLabel(booking.transportType)}
Operator: ${booking.operatorName}
Route: ${booking.route}
Passenger: ${booking.passengerName}
Phone: ${booking.passengerPhone}
Travel Date: ${formatDate(booking.travelDate)}
Seats: ${booking.seats}
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
          <Car className="w-8 h-8 text-muted-foreground" />
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
          href="/transport"
          className="flex items-center gap-2 text-gold hover:underline text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Transport
        </a>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  const TransportIcon = getTransportTypeIcon(booking.transportType);

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="container mx-auto max-w-md">
        {/* Back link */}
        <div className="flex items-center gap-3 mb-8">
          <a
            href="/transport"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors"
            data-ocid="transport-confirmation.back.link"
          >
            <ArrowLeft className="w-4 h-4" />
            Transport
          </a>
          <span className="text-border">/</span>
          <span className="text-foreground text-sm font-medium flex items-center gap-1.5">
            <TransportIcon className="w-4 h-4 text-gold" />
            Booking Confirmation
          </span>
        </div>

        <h1 className="font-display text-3xl font-black text-foreground mb-6 text-center">
          Booking <span className="text-gold">Confirmed</span>
        </h1>

        {/* Confirmation Card */}
        <div
          className="relative bg-[oklch(0.16_0.018_260)] rounded-2xl overflow-hidden border border-border shadow-2xl"
          data-ocid="transport-confirmation.card"
        >
          {/* Top accent strip */}
          <div className="h-1.5 gradient-gold w-full" />

          {/* Success header */}
          <div className="px-6 pt-6 pb-5 bg-[oklch(0.13_0.018_260)] flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-[oklch(0.75_0.15_45)] font-display font-bold uppercase tracking-widest mb-1">
                DMT CREATOLOGY
              </p>
              <p className="text-muted-foreground text-xs">Booking ID</p>
              <p className="font-mono font-bold text-gold text-xl tracking-wider">
                #{booking.bookingId}
              </p>
            </div>
          </div>

          {/* Booking details */}
          <div className="px-6 py-5 space-y-4">
            {/* Transport info */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Transport
              </p>
              <h2 className="font-display font-black text-foreground text-2xl leading-tight">
                {booking.operatorName}
              </h2>
              <Badge
                variant="outline"
                className="border-gold/40 text-gold text-xs font-semibold px-3 py-1"
              >
                <TransportIcon className="w-3 h-3 mr-1.5" />
                {getTransportLabel(booking.transportType)}
              </Badge>
            </div>

            {/* Route */}
            <div className="flex items-center gap-3 bg-[oklch(0.18_0.03_260)] rounded-xl px-4 py-3">
              <MapPin className="w-4 h-4 text-[oklch(0.75_0.15_45)] shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Route
                </p>
                <p className="text-foreground font-semibold text-sm">
                  {booking.route}
                </p>
              </div>
            </div>

            {/* Passenger info */}
            <div className="flex items-center gap-3 bg-[oklch(0.18_0.03_260)] rounded-xl px-4 py-3">
              <User className="w-4 h-4 text-[oklch(0.75_0.15_45)] shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Passenger
                </p>
                <p className="text-foreground font-semibold text-sm">
                  {booking.passengerName}
                </p>
                <p className="text-muted-foreground text-xs">
                  {booking.passengerPhone}
                </p>
                {booking.passengerEmail && (
                  <p className="text-muted-foreground text-xs">
                    {booking.passengerEmail}
                  </p>
                )}
              </div>
            </div>

            {/* Travel date & seats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[oklch(0.18_0.03_260)] rounded-xl px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-[oklch(0.75_0.15_45)]" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Travel Date
                  </p>
                </div>
                <p className="text-foreground font-semibold text-sm leading-snug">
                  {formatDate(booking.travelDate)}
                </p>
              </div>
              <div className="bg-[oklch(0.18_0.03_260)] rounded-xl px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Users className="w-3.5 h-3.5 text-[oklch(0.75_0.15_45)]" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Seats
                  </p>
                </div>
                <p className="text-foreground font-semibold text-sm">
                  {booking.seats} seat{booking.seats !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Amount */}
            <div className="bg-[oklch(0.18_0.03_260)] rounded-xl px-4 py-3 space-y-2">
              <div className="flex items-center justify-between pt-1">
                <span className="text-foreground font-semibold text-sm">
                  Total Paid
                </span>
                <span className="text-green-400 font-bold text-lg">
                  ₹{booking.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Payment info */}
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

          {/* Bottom strip */}
          <div className="h-1.5 gradient-gold w-full" />
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleWhatsApp}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-2"
            data-ocid="transport-confirmation.whatsapp.button"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp Support
          </Button>
          <a href="/transport" className="flex-1">
            <Button
              variant="outline"
              className="w-full border-border hover:bg-muted text-foreground font-semibold flex items-center gap-2"
              data-ocid="transport-confirmation.back.button"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Transport
            </Button>
          </a>
        </div>

        <p className="mt-4 text-xs text-muted-foreground text-center">
          Please save your booking confirmation. Present Booking ID when
          boarding.
        </p>
      </div>
    </div>
  );
}
