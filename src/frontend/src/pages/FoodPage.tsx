import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePaymentTransaction } from "@/hooks/useAdminQueries";
import {
  useAllCateringVendors,
  useCreateFoodBooking,
  useUpdateFoodBookingPaymentStatus,
} from "@/hooks/useCateringQueries";
import { FALLBACK_IMAGES, resolveImage } from "@/lib/fallbackImages";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Loader2,
  MapPin,
  ShieldCheck,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { TransactionStatus } from "../backend.d";
import type { CateringVendor } from "../backend.d";

// ── Razorpay ──────────────────────────────────────────────────────────────────

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }) => void;
  modal?: { ondismiss?: () => void };
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function toNano(dateStr: string): bigint {
  return BigInt(new Date(dateStr).getTime()) * BigInt(1_000_000);
}

// ── Sample Vendors ────────────────────────────────────────────────────────────

const SAMPLE_VENDORS: CateringVendor[] = [
  {
    id: BigInt(1),
    name: "Royal Feast Caterers",
    city: "Mumbai",
    cuisineType: "North Indian, Mughlai",
    pricePerPlate: BigInt(850),
    minimumGuests: BigInt(100),
    photoUrls: [],
    description:
      "Premium catering for weddings, corporate events, and large celebrations. Specialising in royal Mughlai spreads.",
    createdAt: BigInt(0),
  },
  {
    id: BigInt(2),
    name: "Spice Garden Catering Co.",
    city: "Delhi",
    cuisineType: "South Indian, Continental",
    pricePerPlate: BigInt(650),
    minimumGuests: BigInt(50),
    photoUrls: [],
    description:
      "Authentic South Indian and continental menus for intimate gatherings and large-scale events across Delhi NCR.",
    createdAt: BigInt(0),
  },
  {
    id: BigInt(3),
    name: "The Gourmet Table",
    city: "Bangalore",
    cuisineType: "Multi-Cuisine, Live Counters",
    pricePerPlate: BigInt(1200),
    minimumGuests: BigInt(75),
    photoUrls: [],
    description:
      "Five-star experience on your venue. Live counters, themed setups, and bespoke menus crafted by executive chefs.",
    createdAt: BigInt(0),
  },
];

// ── Booking Modal ─────────────────────────────────────────────────────────────

type BookingStep =
  | "date-location"
  | "guests"
  | "payment"
  | "processing"
  | "success"
  | "error";

function CateringBookingModal({
  open,
  onClose,
  vendor,
}: {
  open: boolean;
  onClose: () => void;
  vendor: CateringVendor;
}) {
  const [step, setStep] = useState<BookingStep>("date-location");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmedBookingId, setConfirmedBookingId] = useState<bigint | null>(
    null,
  );

  const createFoodBooking = useCreateFoodBooking();
  const createPaymentTransaction = useCreatePaymentTransaction();
  const updatePaymentStatus = useUpdateFoodBookingPaymentStatus();

  const pricePerPlate = Number(vendor.pricePerPlate);
  const minimumGuests = Number(vendor.minimumGuests);
  const parsedGuestCount = Number.parseInt(guestCount, 10);
  const validGuestCount =
    !Number.isNaN(parsedGuestCount) && parsedGuestCount > 0;
  const guestCountBelowMin =
    validGuestCount && parsedGuestCount < minimumGuests;
  const guestCountValid = validGuestCount && parsedGuestCount >= minimumGuests;
  const totalAmount = guestCountValid ? pricePerPlate * parsedGuestCount : 0;
  const todayStr = new Date().toISOString().split("T")[0];

  const handleClose = () => {
    if (step === "processing") return;
    setStep("date-location");
    setEventDate("");
    setEventLocation("");
    setGuestCount("");
    setGuestName("");
    setGuestPhone("");
    setGuestEmail("");
    setSpecialRequests("");
    setTransactionId("");
    setErrorMessage("");
    setConfirmedBookingId(null);
    onClose();
  };

  const handleStep1Continue = () => {
    if (!eventDate || !eventLocation.trim()) return;
    setStep("guests");
  };

  const handleStep2Continue = () => {
    if (!guestCountValid || !guestName.trim() || !guestPhone.trim()) return;
    setStep("payment");
  };

  const handlePayWithRazorpay = async () => {
    setStep("processing");
    const razorpayKeyId =
      localStorage.getItem("razorpay_key_id") || "rzp_test_placeholder";

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setErrorMessage(
        "Failed to load Razorpay. Please check your internet connection.",
      );
      setStep("error");
      return;
    }

    const options: RazorpayOptions = {
      key: razorpayKeyId,
      amount: totalAmount * 100,
      currency: "INR",
      name: "DMT CREATOLOGY",
      description: `Catering Booking — ${vendor.name}`,
      prefill: {
        name: guestName,
        contact: guestPhone,
        email: guestEmail || undefined,
      },
      theme: { color: "#FF0000" },
      handler: async (response) => {
        const paymentId = response.razorpay_payment_id;
        setTransactionId(paymentId);

        try {
          const bookingId = await createFoodBooking.mutateAsync({
            vendorId: vendor.id,
            vendorName: vendor.name,
            guestName: guestName.trim(),
            guestPhone: guestPhone.trim(),
            guestEmail: guestEmail.trim(),
            eventDate: toNano(eventDate),
            guestCount: BigInt(parsedGuestCount),
            totalAmount: BigInt(totalAmount),
            eventLocation: eventLocation.trim(),
            specialRequests: specialRequests.trim(),
          });

          setConfirmedBookingId(bookingId);

          await createPaymentTransaction.mutateAsync({
            transactionId: paymentId,
            paymentMethod: "razorpay",
            amount: BigInt(totalAmount),
            bookingId,
            status: TransactionStatus.completed,
          });

          await updatePaymentStatus.mutateAsync({
            id: bookingId,
            paymentStatus: TransactionStatus.completed,
          });

          localStorage.setItem(
            `food-booking-${bookingId}`,
            JSON.stringify({
              bookingId: String(bookingId),
              vendorName: vendor.name,
              cuisineType: vendor.cuisineType,
              city: vendor.city,
              guestName: guestName.trim(),
              guestPhone: guestPhone.trim(),
              guestEmail: guestEmail.trim(),
              eventDate,
              guestCount: parsedGuestCount,
              eventLocation: eventLocation.trim(),
              specialRequests: specialRequests.trim(),
              pricePerPlate,
              totalAmount,
              paymentId,
              timestamp: Date.now(),
            }),
          );

          setStep("success");
        } catch {
          setErrorMessage(
            "Payment received but failed to save booking. Please contact support with your payment ID.",
          );
          setStep("error");
        }
      },
      modal: {
        ondismiss: () => {
          setErrorMessage("Payment was cancelled. Please try again.");
          setStep("error");
        },
      },
    };

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch {
      setErrorMessage("Failed to open payment gateway. Please try again.");
      setStep("error");
    }
  };

  const handleViewConfirmation = () => {
    if (!confirmedBookingId) return;
    handleClose();
    window.location.href = `/food-confirmation/${confirmedBookingId}`;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o && step !== "processing") handleClose();
      }}
    >
      <DialogContent
        className="sm:max-w-lg bg-[oklch(0.13_0.02_260)] border-[oklch(0.25_0.03_260)] text-white p-0 overflow-hidden max-h-[90vh] overflow-y-auto"
        data-ocid="food-booking.dialog"
      >
        <AnimatePresence mode="wait">
          {/* ── Step 1: Date & Location ───────────────────────────────────── */}
          {step === "date-location" && (
            <motion.div
              key="date-location"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="px-6 pt-6 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <UtensilsCrossed size={18} className="text-red-500" />
                  <DialogTitle className="text-white font-display text-xl">
                    Select Date & Location
                  </DialogTitle>
                </div>
                <p className="text-slate-400 text-sm">
                  {vendor.name} · {vendor.city}
                </p>
              </DialogHeader>

              <div className="px-6 pb-6 space-y-5">
                {/* Summary */}
                <div className="rounded-xl bg-[oklch(0.18_0.03_260)] border border-[oklch(0.25_0.03_260)] p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Cuisine</span>
                    <span className="text-white font-semibold text-sm">
                      {vendor.cuisineType}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">
                      Price per Plate
                    </span>
                    <span className="text-red-400 font-bold text-lg">
                      ₹{pricePerPlate.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">
                      Minimum Guests
                    </span>
                    <Badge className="bg-red-500/15 text-red-400 border-red-500/30 text-xs">
                      <Users size={10} className="mr-1" />
                      {minimumGuests} guests
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="event-date"
                    className="text-slate-300 text-sm"
                  >
                    Event Date <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                    />
                    <Input
                      id="event-date"
                      type="date"
                      min={todayStr}
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="pl-8 bg-[oklch(0.18_0.03_260)] border-[oklch(0.25_0.03_260)] text-white text-sm [color-scheme:dark]"
                      data-ocid="food-booking.date.input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="event-location"
                    className="text-slate-300 text-sm"
                  >
                    Event Location <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                    />
                    <Input
                      id="event-location"
                      type="text"
                      placeholder="Venue name and address"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      className="pl-8 bg-[oklch(0.18_0.03_260)] border-[oklch(0.25_0.03_260)] text-white placeholder:text-slate-600"
                      data-ocid="food-booking.location.input"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleStep1Continue}
                  disabled={!eventDate || !eventLocation.trim()}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-11 disabled:opacity-40"
                  data-ocid="food-booking.step1.primary_button"
                >
                  Continue to Guest Details
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleClose}
                  className="w-full text-slate-500 hover:text-slate-300 hover:bg-white/5 text-sm h-9"
                  data-ocid="food-booking.step1.cancel_button"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Guest Details ─────────────────────────────────────── */}
          {step === "guests" && (
            <motion.div
              key="guests"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="px-6 pt-6 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Users size={18} className="text-red-500" />
                  <DialogTitle className="text-white font-display text-xl">
                    Guest Details
                  </DialogTitle>
                </div>
                <p className="text-slate-400 text-sm">
                  {vendor.name} · {formatDate(eventDate)}
                </p>
              </DialogHeader>

              <div className="px-6 pb-6 space-y-4">
                {/* Guest count with validation */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="guest-count"
                    className="text-slate-300 text-sm"
                  >
                    Number of Guests <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="guest-count"
                    type="number"
                    min="1"
                    placeholder={`Minimum ${minimumGuests} guests required`}
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="bg-[oklch(0.18_0.03_260)] border-[oklch(0.25_0.03_260)] text-white placeholder:text-slate-600 focus:border-red-500/70"
                    data-ocid="food-booking.guest-count.input"
                  />
                  {guestCountBelowMin && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1.5 text-red-400 text-xs mt-1"
                      data-ocid="food-booking.guest-count.error_state"
                    >
                      <AlertCircle size={12} />
                      Minimum guest requirement not met. Please enter at least{" "}
                      {minimumGuests} guests.
                    </motion.p>
                  )}
                  {guestCountValid && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 mt-1"
                    >
                      <span className="text-slate-400 text-sm">
                        {parsedGuestCount} guests × ₹
                        {pricePerPlate.toLocaleString("en-IN")}/plate
                      </span>
                      <span className="text-red-400 font-bold text-base">
                        ₹{totalAmount.toLocaleString("en-IN")}
                      </span>
                    </motion.div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="guest-name"
                    className="text-slate-300 text-sm"
                  >
                    Full Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="guest-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="bg-[oklch(0.18_0.03_260)] border-[oklch(0.25_0.03_260)] text-white placeholder:text-slate-600 focus:border-red-500/70"
                    data-ocid="food-booking.guest-name.input"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="guest-phone"
                    className="text-slate-300 text-sm"
                  >
                    Phone Number <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="guest-phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="bg-[oklch(0.18_0.03_260)] border-[oklch(0.25_0.03_260)] text-white placeholder:text-slate-600 focus:border-red-500/70"
                    data-ocid="food-booking.guest-phone.input"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="guest-email"
                    className="text-slate-300 text-sm"
                  >
                    Email <span className="text-slate-500">(optional)</span>
                  </Label>
                  <Input
                    id="guest-email"
                    type="email"
                    placeholder="your@email.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="bg-[oklch(0.18_0.03_260)] border-[oklch(0.25_0.03_260)] text-white placeholder:text-slate-600 focus:border-red-500/70"
                    data-ocid="food-booking.guest-email.input"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="special-requests"
                    className="text-slate-300 text-sm"
                  >
                    Special Requests{" "}
                    <span className="text-slate-500">(optional)</span>
                  </Label>
                  <Textarea
                    id="special-requests"
                    placeholder="Dietary requirements, allergies, theme preferences..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    rows={3}
                    className="bg-[oklch(0.18_0.03_260)] border-[oklch(0.25_0.03_260)] text-white placeholder:text-slate-600 resize-none focus:border-red-500/70"
                    data-ocid="food-booking.special-requests.textarea"
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  <Button
                    variant="ghost"
                    onClick={() => setStep("date-location")}
                    className="flex-1 text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-1.5"
                    data-ocid="food-booking.step2.cancel_button"
                  >
                    <ArrowLeft size={14} />
                    Back
                  </Button>
                  <Button
                    onClick={handleStep2Continue}
                    disabled={
                      !guestCountValid ||
                      !guestName.trim() ||
                      !guestPhone.trim()
                    }
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold h-11 disabled:opacity-40"
                    data-ocid="food-booking.step2.primary_button"
                  >
                    Proceed to Payment
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Payment ───────────────────────────────────────────── */}
          {step === "payment" && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="px-6 pt-6 pb-4">
                <DialogTitle className="text-white font-display text-xl">
                  Complete Your Booking
                </DialogTitle>
                <p className="text-slate-400 text-sm mt-1">
                  Secure payment powered by Razorpay
                </p>
              </DialogHeader>

              <div className="mx-6 mb-5 rounded-xl overflow-hidden border border-red-500/30">
                <div className="h-1 bg-gradient-to-r from-red-600 to-red-400" />
                <div className="bg-[oklch(0.18_0.03_260)] px-4 py-4 space-y-3">
                  <p className="text-red-400 font-display font-semibold text-xs uppercase tracking-wider">
                    Order Summary
                  </p>
                  <div className="space-y-1">
                    <p className="text-white font-semibold text-base leading-snug">
                      {vendor.name}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {vendor.cuisineType} · {vendor.city}
                    </p>
                    <p className="text-slate-500 text-xs">
                      Contact: {guestName}
                    </p>
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Event Date</span>
                      <span className="text-slate-300 text-sm">
                        {formatDate(eventDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Location</span>
                      <span className="text-slate-300 text-sm text-right max-w-[60%] line-clamp-1">
                        {eventLocation}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Guests</span>
                      <span className="text-slate-300 text-sm">
                        {parsedGuestCount} × ₹
                        {pricePerPlate.toLocaleString("en-IN")}/plate
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1.5 border-t border-white/10">
                      <span className="text-white font-semibold text-sm">
                        Total Amount
                      </span>
                      <span className="text-red-400 font-bold text-xl">
                        ₹{totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mx-6 mb-4 flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-700/50">
                  <ShieldCheck size={12} className="text-green-400" />
                  <span>256-bit SSL secured</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-700/50">
                  <span className="font-semibold text-slate-400">UPI</span>
                  <span className="text-slate-600">·</span>
                  <span>Cards</span>
                  <span className="text-slate-600">·</span>
                  <span>Net Banking</span>
                </div>
              </div>

              <div className="px-6 pb-6 space-y-2">
                <Button
                  onClick={handlePayWithRazorpay}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12 text-base"
                  data-ocid="food-booking.payment.primary_button"
                >
                  Pay ₹{totalAmount.toLocaleString("en-IN")} with Razorpay
                </Button>
                <p className="text-center text-slate-600 text-xs">
                  Powered by{" "}
                  <span className="text-slate-500 font-semibold">Razorpay</span>{" "}
                  · TEST MODE
                </p>
                <Button
                  variant="ghost"
                  onClick={() => setStep("guests")}
                  className="w-full text-slate-500 hover:text-slate-300 hover:bg-white/5 text-sm h-9 flex items-center gap-1.5"
                  data-ocid="food-booking.payment.cancel_button"
                >
                  <ArrowLeft size={14} />
                  Back
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── Processing ────────────────────────────────────────────────── */}
          {step === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center py-16 px-6"
              data-ocid="food-booking.processing.loading_state"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full border-2 border-[oklch(0.25_0.03_260)] flex items-center justify-center">
                  <Loader2 size={36} className="animate-spin text-red-500" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-red-500/30 animate-ping" />
              </div>
              <p className="text-white font-display font-semibold text-lg">
                Opening payment gateway...
              </p>
              <p className="text-slate-400 text-sm mt-1">
                Please complete the payment in the Razorpay window
              </p>
            </motion.div>
          )}

          {/* ── Success ───────────────────────────────────────────────────── */}
          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center py-10 px-6"
              data-ocid="food-booking.success_state"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center mb-5"
              >
                <CheckCircle2 size={44} className="text-green-400" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center space-y-1 mb-6"
              >
                <p className="text-red-400 font-display font-bold text-xs uppercase tracking-widest">
                  DMT CREATOLOGY
                </p>
                <h3 className="text-white font-display font-bold text-2xl">
                  Catering Booked!
                </h3>
                <p className="text-slate-400 text-sm">
                  {vendor.name} — {formatDate(eventDate)}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full bg-[oklch(0.18_0.03_260)] rounded-xl border border-[oklch(0.25_0.03_260)] p-4 mb-6 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-400 text-xs shrink-0">
                    Razorpay Payment ID
                  </span>
                  <span className="text-white font-mono text-xs text-right break-all">
                    {transactionId}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">Amount Paid</span>
                  <span className="text-green-400 font-semibold text-sm">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">Guests</span>
                  <span className="text-white text-xs">{parsedGuestCount}</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="w-full"
              >
                <Button
                  onClick={handleViewConfirmation}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-11"
                  data-ocid="food-booking.view-confirmation.button"
                >
                  View Booking Confirmation
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* ── Error ─────────────────────────────────────────────────────── */}
          {step === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center py-10 px-6"
              data-ocid="food-booking.error_state"
            >
              <div className="w-20 h-20 rounded-full bg-red-500/15 flex items-center justify-center mb-5">
                <AlertCircle size={44} className="text-red-400" />
              </div>
              <h3 className="text-white font-display font-bold text-2xl mb-1">
                Payment Failed
              </h3>
              <p className="text-slate-400 text-sm text-center mb-6">
                {errorMessage ||
                  "We couldn't process your payment. Please try again."}
              </p>
              <div className="w-full space-y-2">
                <Button
                  onClick={() => {
                    setErrorMessage("");
                    setStep("payment");
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-11"
                  data-ocid="food-booking.retry.button"
                >
                  Try Again
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleClose}
                  className="w-full text-slate-400 hover:text-white hover:bg-white/5"
                  data-ocid="food-booking.error.cancel_button"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

// ── Vendor Card ───────────────────────────────────────────────────────────────

function VendorCard({
  vendor,
  index,
  onBook,
}: {
  vendor: CateringVendor;
  index: number;
  onBook: (v: CateringVendor) => void;
}) {
  return (
    <div
      className="group rounded-2xl overflow-hidden border border-border bg-card hover:border-red-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/5 flex flex-col"
      data-ocid={`food.item.${index + 1}`}
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={resolveImage(vendor.photoUrls[0], "food")}
          alt={vendor.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_IMAGES.food;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="text-white font-bold text-sm drop-shadow">
            ₹{Number(vendor.pricePerPlate).toLocaleString("en-IN")}/plate
          </span>
          <Badge className="bg-red-600/90 text-white border-0 text-xs">
            <Users size={10} className="mr-1" />
            Min {Number(vendor.minimumGuests).toLocaleString("en-IN")} guests
          </Badge>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-bold text-foreground text-lg leading-snug mb-1">
          {vendor.name}
        </h3>
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-1">
          <MapPin size={13} />
          <span>{vendor.city}</span>
        </div>
        <div className="flex items-center gap-1 text-red-400 text-sm mb-3">
          <UtensilsCrossed size={13} />
          <span>{vendor.cuisineType}</span>
        </div>

        {vendor.description && (
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
            {vendor.description}
          </p>
        )}

        <div className="mt-auto">
          <Button
            onClick={() => onBook(vendor)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
            data-ocid={`food.book.primary_button.${index + 1}`}
          >
            Book Catering
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function FoodPage() {
  const { data: vendors, isLoading } = useAllCateringVendors();
  const [selectedVendor, setSelectedVendor] = useState<CateringVendor | null>(
    null,
  );

  const displayVendors =
    vendors && vendors.length > 0 ? vendors : SAMPLE_VENDORS;

  return (
    <div data-ocid="food.page">
      <PageHeader
        title="Food & Catering"
        subtitle="Professional catering services for weddings, corporate events, parties & celebrations across India"
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
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="food.list"
          >
            {displayVendors.map((vendor, i) => (
              <VendorCard
                key={String(vendor.id)}
                vendor={vendor}
                index={i}
                onBook={setSelectedVendor}
              />
            ))}
          </div>
        )}
      </div>

      {selectedVendor && (
        <CateringBookingModal
          open={!!selectedVendor}
          onClose={() => setSelectedVendor(null)}
          vendor={selectedVendor}
        />
      )}
    </div>
  );
}
