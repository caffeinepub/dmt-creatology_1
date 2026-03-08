import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateEventBooking,
  useTicketCategoriesByEvent,
} from "@/hooks/useAdminQueries";
import { Loader2, Ticket } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
// Event type - defined locally since it was removed from the reduced backend.d.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Event = any;
import PaymentModal from "./PaymentModal";

interface EventBookingModalProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
}

export default function EventBookingModal({
  event,
  open,
  onClose,
}: EventBookingModalProps) {
  const { data: ticketCategories, isLoading: loadingTickets } =
    useTicketCategoriesByEvent(open && event ? event.id : null);

  const createEventBooking = useCreateEventBooking();

  const [form, setForm] = useState({
    ticketCategory: "",
    name: "",
    phone: "",
    city: "",
    quantity: "1",
    message: "",
  });

  const [paymentData, setPaymentData] = useState<{
    bookingId: bigint;
    pricePerTicket: number;
    customerName: string;
    ticketCategory: string;
    quantity: number;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClose = () => {
    setForm({
      ticketCategory: "",
      name: "",
      phone: "",
      city: "",
      quantity: "1",
      message: "",
    });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    try {
      const bookingId = await createEventBooking.mutateAsync({
        eventId: event.id,
        eventName: event.name,
        ticketCategory: form.ticketCategory,
        name: form.name,
        phone: form.phone,
        city: form.city,
        quantity: BigInt(Number.parseInt(form.quantity) || 1),
        message: form.message,
      });

      // Capture form values before reset
      const capturedName = form.name;
      const capturedCategory = form.ticketCategory;
      const capturedQty = Number.parseInt(form.quantity) || 1;
      const selectedTicket = ticketCategories?.find(
        (tc) => tc.name === form.ticketCategory,
      );
      const pricePerTicket = selectedTicket ? Number(selectedTicket.price) : 0;

      // Close booking modal and open payment modal
      handleClose();

      setPaymentData({
        bookingId,
        pricePerTicket,
        customerName: capturedName,
        ticketCategory: capturedCategory,
        quantity: capturedQty,
      });
    } catch {
      toast.error("Failed to submit booking. Please try again.");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
        <DialogContent
          className="sm:max-w-md bg-card border-border text-foreground"
          data-ocid="events.booking.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-gold font-display text-xl flex items-center gap-2">
              <Ticket size={18} className="text-gold" />
              Book Event
            </DialogTitle>
            {event && (
              <p className="text-muted-foreground text-sm mt-1">
                {event.name} &mdash; {event.city}
              </p>
            )}
          </DialogHeader>

          {loadingTickets ? (
            <div className="space-y-3 py-2">
              <Skeleton className="h-9 w-full bg-muted" />
              <Skeleton className="h-9 w-full bg-muted" />
              <Skeleton className="h-9 w-3/4 bg-muted" />
            </div>
          ) : !ticketCategories?.length ? (
            <div className="py-6 text-center">
              <p className="text-muted-foreground text-sm">
                No ticket categories available yet.
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Please contact the organiser via WhatsApp to enquire.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              {/* Ticket Category */}
              <div className="space-y-1.5">
                <Label className="text-foreground text-sm">Ticket Type *</Label>
                <Select
                  value={form.ticketCategory}
                  onValueChange={(v) =>
                    setForm((prev) => ({ ...prev, ticketCategory: v }))
                  }
                  required
                >
                  <SelectTrigger
                    className="bg-input border-border focus:border-gold"
                    data-ocid="events.booking.select"
                  >
                    <SelectValue placeholder="Select a ticket category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {ticketCategories.map((tc) => (
                      <SelectItem
                        key={String(tc.id)}
                        value={tc.name}
                        className="text-foreground focus:bg-muted"
                      >
                        {tc.name} — ₹{Number(tc.price).toLocaleString("en-IN")}{" "}
                        ({Number(tc.availableQty)} available)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="eb-name" className="text-foreground text-sm">
                  Full Name *
                </Label>
                <Input
                  id="eb-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  className="bg-input border-border focus:border-gold"
                  data-ocid="events.booking.name_input"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="eb-phone" className="text-foreground text-sm">
                  Phone Number *
                </Label>
                <Input
                  id="eb-phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  required
                  className="bg-input border-border focus:border-gold"
                  data-ocid="events.booking.phone_input"
                />
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <Label htmlFor="eb-city" className="text-foreground text-sm">
                  City *
                </Label>
                <Input
                  id="eb-city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Your city"
                  required
                  className="bg-input border-border focus:border-gold"
                  data-ocid="events.booking.city_input"
                />
              </div>

              {/* Quantity */}
              <div className="space-y-1.5">
                <Label htmlFor="eb-qty" className="text-foreground text-sm">
                  Quantity *
                </Label>
                <Input
                  id="eb-qty"
                  name="quantity"
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={handleChange}
                  required
                  className="bg-input border-border focus:border-gold"
                  data-ocid="events.booking.qty_input"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <Label htmlFor="eb-message" className="text-foreground text-sm">
                  Message
                </Label>
                <Textarea
                  id="eb-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Any special requests or notes..."
                  rows={2}
                  className="bg-input border-border focus:border-gold resize-none"
                  data-ocid="events.booking.message_textarea"
                />
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="w-full sm:w-auto border-border text-muted-foreground hover:bg-muted"
                  data-ocid="events.booking.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createEventBooking.isPending || !form.ticketCategory
                  }
                  className="w-full sm:w-auto gradient-gold text-[oklch(0.1_0.01_260)] font-bold hover:opacity-90 disabled:opacity-60"
                  data-ocid="events.booking.submit_button"
                >
                  {createEventBooking.isPending ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Booking...
                    </>
                  ) : (
                    "Proceed to Payment"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Modal — rendered outside the booking Dialog to avoid nesting issues */}
      {paymentData && (
        <PaymentModal
          open={!!paymentData}
          onClose={() => setPaymentData(null)}
          bookingId={paymentData.bookingId}
          eventName={event?.name ?? ""}
          ticketCategory={paymentData.ticketCategory}
          quantity={paymentData.quantity}
          pricePerTicket={paymentData.pricePerTicket}
          customerName={paymentData.customerName}
        />
      )}
    </>
  );
}
