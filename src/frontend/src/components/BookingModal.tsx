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
import { Textarea } from "@/components/ui/textarea";
import { useCreateBookingRequest } from "@/hooks/useAdminQueries";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  prefillService?: string;
  buttonLabel?: string;
}

export default function BookingModal({
  open,
  onClose,
  prefillService = "",
  buttonLabel = "Book Now",
}: BookingModalProps) {
  const createBooking = useCreateBookingRequest();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    service: prefillService,
    date: "",
    message: "",
  });

  // Sync service when prefillService changes
  const handleOpen = () => {
    setForm((prev) => ({ ...prev, service: prefillService }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert date string to nanoseconds bigint for backend
    const dateNs = form.date
      ? BigInt(new Date(form.date).getTime()) * 1_000_000n
      : 0n;

    // Save to backend — WhatsApp redirect always happens even if this fails
    try {
      await createBooking.mutateAsync({
        name: form.name,
        phone: form.phone,
        serviceType: form.service,
        city: form.city,
        date: dateNs,
        message: form.message,
      });
    } catch {
      // Backend save failed — still proceed to WhatsApp
    }

    const message = `Booking Request - DMT CREATOLOGY
Name: ${form.name}
Phone: ${form.phone}
City: ${form.city}
Service: ${form.service}
Date: ${form.date}
Message: ${form.message}`;

    const whatsappUrl = `https://wa.me/919821432904?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    onClose();
    setForm({
      name: "",
      phone: "",
      city: "",
      service: prefillService,
      date: "",
      message: "",
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
        else handleOpen();
      }}
    >
      <DialogContent
        className="sm:max-w-md bg-card border-border text-foreground"
        data-ocid="booking.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-gold font-display text-xl">
            {buttonLabel === "Apply Now" ? "Apply for Job" : "Book Service"}
          </DialogTitle>
          <p className="text-muted-foreground text-sm">
            Fill in your details and we'll connect you on WhatsApp.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-foreground">
              Full Name *
            </Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
              className="bg-input border-border focus:border-gold"
              data-ocid="booking.name_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-foreground">
              Phone Number *
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
              required
              className="bg-input border-border focus:border-gold"
              data-ocid="booking.phone_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="city" className="text-foreground">
              City *
            </Label>
            <Input
              id="city"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Your city"
              required
              className="bg-input border-border focus:border-gold"
              data-ocid="booking.city_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="service" className="text-foreground">
              Service Required *
            </Label>
            <Input
              id="service"
              name="service"
              value={form.service}
              onChange={handleChange}
              placeholder="Service you need"
              required
              className="bg-input border-border focus:border-gold"
              data-ocid="booking.service_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="date" className="text-foreground">
              Preferred Date
            </Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="bg-input border-border focus:border-gold"
              data-ocid="booking.date_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-foreground">
              Message
            </Label>
            <Textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Any additional details..."
              rows={3}
              className="bg-input border-border focus:border-gold resize-none"
              data-ocid="booking.message_textarea"
            />
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto border-border text-muted-foreground hover:bg-muted"
              data-ocid="booking.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createBooking.isPending}
              className="w-full sm:w-auto gradient-gold text-[oklch(0.1_0.01_260)] font-bold hover:opacity-90 disabled:opacity-60"
              data-ocid="booking.submit_button"
            >
              {createBooking.isPending ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Saving...
                </>
              ) : (
                "Send via WhatsApp"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
