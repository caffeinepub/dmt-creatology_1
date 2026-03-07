import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams } from "@tanstack/react-router";
import { ArrowLeft, Download, MessageCircle, Ticket } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Declare qrcode.js CDN global
declare global {
  interface Window {
    QRCode: new (
      element: HTMLElement,
      options: {
        text: string;
        width: number;
        height: number;
        colorDark: string;
        colorLight: string;
        correctLevel: number;
      },
    ) => undefined;
  }
}

interface TicketData {
  bookingId: string;
  eventName: string;
  ticketCategory: string;
  customerName: string;
  quantity: string;
  timestamp: number;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function TicketPage() {
  const { bookingId } = useParams({ strict: false });
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [qrReady, setQrReady] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const qrContainerRef = useRef<HTMLDivElement>(null);
  const qrTicketUrl = bookingId
    ? `${window.location.origin}/ticket/${bookingId}`
    : "";

  // Load ticket data from localStorage
  useEffect(() => {
    if (!bookingId) {
      setNotFound(true);
      return;
    }
    const stored = localStorage.getItem(`ticket-${bookingId}`);
    if (!stored) {
      setNotFound(true);
      return;
    }
    try {
      const data: TicketData = JSON.parse(stored);
      setTicket(data);
    } catch {
      setNotFound(true);
    }
  }, [bookingId]);

  // Load QR code via CDN and render into container
  useEffect(() => {
    if (!ticket || !qrContainerRef.current || !qrTicketUrl) return;

    const container = qrContainerRef.current;
    container.innerHTML = "";

    const renderQR = () => {
      if (!window.QRCode) return;
      try {
        new window.QRCode(container, {
          text: qrTicketUrl,
          width: 200,
          height: 200,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: 1,
        });
        setQrReady(true);
      } catch (err) {
        console.error("QR generation failed:", err);
      }
    };

    if (window.QRCode) {
      renderQR();
    } else {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
      script.onload = renderQR;
      document.head.appendChild(script);
    }
  }, [ticket, qrTicketUrl]);

  const handleWhatsApp = () => {
    if (!ticket) return;
    const msg = `*My Event Ticket — DMT CREATOLOGY*

Ticket ID: TKT-${ticket.bookingId}
Event: ${ticket.eventName}
Category: ${ticket.ticketCategory}
Name: ${ticket.customerName}
Quantity: ${ticket.quantity}
Booked on: ${formatDate(ticket.timestamp)}

Please verify my ticket at the entry.`;
    window.open(
      `https://wa.me/919821432904?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  const handleDownload = () => {
    window.print();
  };

  if (notFound) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <Ticket className="w-8 h-8 text-muted-foreground" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Ticket Not Found
          </h2>
          <p className="text-muted-foreground text-sm max-w-xs">
            This ticket could not be found. Tickets are stored on this device —
            please check using the same browser you booked with.
          </p>
        </div>
        <a
          href="/events"
          className="flex items-center gap-2 text-gold hover:underline text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </a>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4">
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .ticket-card { box-shadow: none !important; border: 1px solid #ddd !important; }
        }
      `}</style>

      <div className="container mx-auto max-w-md">
        {/* Header */}
        <div className="no-print flex items-center gap-3 mb-8">
          <a
            href="/events"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Events
          </a>
          <span className="text-border">/</span>
          <span className="text-foreground text-sm font-medium flex items-center gap-1.5">
            <Ticket className="w-4 h-4 text-gold" />
            Your Ticket
          </span>
        </div>

        <h1 className="no-print font-display text-3xl font-black text-foreground mb-6 text-center">
          Your <span className="text-gold">Ticket</span>
        </h1>

        {/* Ticket Card */}
        <div
          className="ticket-card relative bg-[oklch(0.16_0.018_260)] rounded-2xl overflow-hidden border border-border shadow-2xl"
          data-ocid="ticket.card"
        >
          {/* Top accent strip */}
          <div className="h-1.5 gradient-gold w-full" />

          {/* Header section */}
          <div className="px-6 pt-5 pb-4 bg-[oklch(0.13_0.018_260)]">
            <div className="flex items-center justify-between mb-1">
              <span className="font-display font-black text-sm tracking-widest text-gold uppercase">
                DMT CREATOLOGY
              </span>
              <Badge className="gradient-gold text-[oklch(0.1_0.01_260)] border-0 text-[10px] font-bold px-2 py-0.5">
                EVENT TICKET
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">Official Entry Pass</p>
          </div>

          {/* Ticket ID + Event Details */}
          <div className="px-6 py-5 space-y-4">
            {/* Ticket ID */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Ticket ID
              </span>
              <span className="font-mono font-bold text-gold text-lg tracking-wider">
                TKT-{ticket.bookingId}
              </span>
            </div>

            {/* Event name */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Event
              </p>
              <h2 className="font-display font-black text-foreground text-2xl leading-tight">
                {ticket.eventName}
              </h2>
            </div>

            {/* Ticket category */}
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-gold/40 text-gold text-xs font-semibold px-3 py-1"
              >
                {ticket.ticketCategory}
              </Badge>
            </div>

            {/* Grid details */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                  Name
                </p>
                <p className="text-foreground font-medium text-sm">
                  {ticket.customerName}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                  Quantity
                </p>
                <p className="text-foreground font-medium text-sm">
                  {ticket.quantity} ticket
                  {Number(ticket.quantity) !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                  Booked On
                </p>
                <p className="text-foreground font-medium text-sm">
                  {formatDate(ticket.timestamp)}
                </p>
              </div>
            </div>
          </div>

          {/* Tear line */}
          <div className="flex items-center px-0">
            <div className="w-6 h-6 rounded-full bg-background -ml-3 shrink-0" />
            <div className="flex-1 border-t-2 border-dashed border-border/50 mx-1" />
            <div className="w-6 h-6 rounded-full bg-background -mr-3 shrink-0" />
          </div>

          {/* QR Code section */}
          <div className="px-6 py-6 flex flex-col items-center gap-3">
            <div className="p-3 bg-white rounded-xl shadow-inner min-w-[226px] min-h-[226px] flex items-center justify-center">
              {!qrReady && (
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
              )}
              <div
                ref={qrContainerRef}
                className={qrReady ? "block" : "hidden"}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center leading-relaxed max-w-[200px]">
              Scan this QR code at the event entrance
            </p>
          </div>

          {/* Bottom strip */}
          <div className="h-1.5 gradient-gold w-full" />
        </div>

        {/* Action buttons */}
        <div className="no-print mt-6 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleWhatsApp}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-2"
            data-ocid="ticket.whatsapp_button"
          >
            <MessageCircle className="w-4 h-4" />
            Send via WhatsApp
          </Button>
          <Button
            onClick={handleDownload}
            variant="outline"
            className="flex-1 border-border hover:bg-muted text-foreground font-semibold flex items-center gap-2"
            data-ocid="ticket.download_button"
          >
            <Download className="w-4 h-4" />
            Download Ticket
          </Button>
        </div>

        <p className="no-print mt-4 text-xs text-muted-foreground text-center">
          Keep this ticket safe. Present it at the event entrance for scanning.
        </p>
      </div>
    </div>
  );
}
