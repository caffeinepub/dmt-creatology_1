import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateHotelBooking,
  useCreatePaymentTransaction,
  useUpdateHotelBookingPaymentStatus,
} from "@/hooks/useAdminQueries";
import {
  AlertCircle,
  ArrowLeft,
  BedDouble,
  Calendar,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { TransactionStatus } from "../backend.d";
import type { Hotel } from "../backend.d";

// ── Razorpay options interface (local) ───────────────────────────────────────
interface HotelRazorpayOptions {
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

function calcNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

function toNano(dateStr: string): bigint {
  return BigInt(new Date(dateStr).getTime()) * BigInt(1_000_000);
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface HotelBookingModalProps {
  open: boolean;
  onClose: () => void;
  hotel: Hotel;
}

type Step =
  | "room-dates"
  | "guest-details"
  | "payment"
  | "processing"
  | "success"
  | "error";

// ── Component ─────────────────────────────────────────────────────────────────

export default function HotelBookingModal({
  open,
  onClose,
  hotel,
}: HotelBookingModalProps) {
  // Step state
  const [step, setStep] = useState<Step>("room-dates");

  // Room & dates
  const [selectedRoomIdx, setSelectedRoomIdx] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  // Guest details
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  // Payment result
  const [transactionId, setTransactionId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmedBookingId, setConfirmedBookingId] = useState<bigint | null>(
    null,
  );

  // Mutations
  const createHotelBooking = useCreateHotelBooking();
  const createPaymentTransaction = useCreatePaymentTransaction();
  const updatePaymentStatus = useUpdateHotelBookingPaymentStatus();

  // Derived
  const selectedRoom = hotel.roomTypes[selectedRoomIdx] ?? hotel.roomTypes[0];
  const nights = calcNights(checkIn, checkOut);
  const pricePerNight = selectedRoom ? Number(selectedRoom.pricePerNight) : 0;
  const totalAmount = nights * pricePerNight;

  const todayStr = new Date().toISOString().split("T")[0];
  const minCheckOut = checkIn
    ? new Date(new Date(checkIn).getTime() + 86400000)
        .toISOString()
        .split("T")[0]
    : todayStr;

  const handleClose = () => {
    if (step === "processing") return;
    setStep("room-dates");
    setSelectedRoomIdx(0);
    setCheckIn("");
    setCheckOut("");
    setGuestName("");
    setGuestPhone("");
    setGuestEmail("");
    setTransactionId("");
    setErrorMessage("");
    setConfirmedBookingId(null);
    onClose();
  };

  const handleStep1Continue = () => {
    if (!checkIn || !checkOut || nights <= 0) return;
    setStep("guest-details");
  };

  const handleStep2Continue = () => {
    if (!guestName.trim() || !guestPhone.trim()) return;
    setStep("payment");
  };

  const handlePayWithRazorpay = async () => {
    setStep("processing");

    const razorpayKeyId =
      localStorage.getItem("razorpay_key_id") || "rzp_test_PLACEHOLDER";

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setErrorMessage(
        "Failed to load Razorpay. Please check your internet connection.",
      );
      setStep("error");
      return;
    }

    const options: HotelRazorpayOptions = {
      key: razorpayKeyId,
      amount: totalAmount * 100, // paise
      currency: "INR",
      name: "DMT CREATOLOGY",
      description: `${selectedRoom?.name ?? "Room"} — ${hotel.name}`,
      prefill: {
        name: guestName,
        contact: guestPhone,
        email: guestEmail || undefined,
      },
      theme: { color: "#C5A44A" },
      handler: async (response) => {
        const paymentId = response.razorpay_payment_id;
        setTransactionId(paymentId);

        try {
          // 1. Save hotel booking in backend
          const bookingId = await createHotelBooking.mutateAsync({
            hotelId: hotel.id,
            hotelName: hotel.name,
            roomType: selectedRoom?.name ?? "",
            pricePerNight: BigInt(pricePerNight),
            guestName: guestName.trim(),
            guestPhone: guestPhone.trim(),
            guestEmail: guestEmail.trim(),
            checkInDate: toNano(checkIn),
            checkOutDate: toNano(checkOut),
            numberOfNights: BigInt(nights),
            totalAmount: BigInt(totalAmount),
          });

          setConfirmedBookingId(bookingId);

          // 2. Record payment in Admin → Payments panel
          await createPaymentTransaction.mutateAsync({
            transactionId: paymentId,
            paymentMethod: "razorpay",
            amount: BigInt(totalAmount),
            bookingId,
            status: TransactionStatus.completed,
          });

          // 3. Update hotel booking payment status
          await updatePaymentStatus.mutateAsync({
            id: bookingId,
            paymentStatus: TransactionStatus.completed,
          });

          // 4. Save confirmation to localStorage
          localStorage.setItem(
            `hotel-booking-${bookingId}`,
            JSON.stringify({
              bookingId: String(bookingId),
              hotelName: hotel.name,
              roomType: selectedRoom?.name ?? "",
              guestName: guestName.trim(),
              guestPhone: guestPhone.trim(),
              guestEmail: guestEmail.trim(),
              checkIn,
              checkOut,
              nights,
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
    window.location.href = `/hotel-confirmation/${confirmedBookingId}`;
  };

  // ── Step content ─────────────────────────────────────────────────────────────

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o && step !== "processing") handleClose();
      }}
    >
      <DialogContent
        className="sm:max-w-lg bg-[oklch(0.13_0.02_260)] border-[oklch(0.25_0.03_260)] text-white p-0 overflow-hidden max-h-[90vh] overflow-y-auto"
        data-ocid="hotel-booking.dialog"
      >
        <AnimatePresence mode="wait">
          {/* ── Step 1: Select Room & Dates ──────────────────────────────── */}
          {step === "room-dates" && (
            <motion.div
              key="room-dates"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="px-6 pt-6 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <BedDouble size={18} className="text-[oklch(0.75_0.15_45)]" />
                  <DialogTitle className="text-white font-display text-xl">
                    Select Room & Dates
                  </DialogTitle>
                </div>
                <p className="text-slate-400 text-sm">
                  {hotel.name} · {hotel.city}
                </p>
              </DialogHeader>

              <div className="px-6 pb-6 space-y-5">
                {/* Room type selector */}
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm font-medium">
                    Room Type
                  </Label>
                  <div className="space-y-2">
                    {hotel.roomTypes.map((room, idx) => (
                      <button
                        key={room.name}
                        type="button"
                        onClick={() => setSelectedRoomIdx(idx)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${
                          selectedRoomIdx === idx
                            ? "border-[oklch(0.75_0.15_45)] bg-[oklch(0.75_0.15_45/0.1)]"
                            : "border-[oklch(0.25_0.03_260)] bg-[oklch(0.18_0.03_260)] hover:border-[oklch(0.4_0.05_260)]"
                        }`}
                        data-ocid={`hotel-booking.room.${idx + 1}`}
                      >
                        <div>
                          <p className="text-white font-medium text-sm">
                            {room.name}
                          </p>
                          <p className="text-slate-400 text-xs mt-0.5">
                            per night
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[oklch(0.75_0.15_45)] font-bold text-base">
                            ₹
                            {Number(room.pricePerNight).toLocaleString("en-IN")}
                          </p>
                          {selectedRoomIdx === idx && (
                            <p className="text-[oklch(0.75_0.15_45)] text-[10px] font-semibold uppercase tracking-wider">
                              Selected
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                    {hotel.roomTypes.length === 0 && (
                      <p className="text-slate-500 text-sm text-center py-4">
                        No room types configured for this hotel.
                      </p>
                    )}
                  </div>
                </div>

                {/* Date pickers */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="check-in"
                      className="text-slate-300 text-sm"
                    >
                      Check-in Date
                    </Label>
                    <div className="relative">
                      <Calendar
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                      />
                      <Input
                        id="check-in"
                        type="date"
                        min={todayStr}
                        value={checkIn}
                        onChange={(e) => {
                          setCheckIn(e.target.value);
                          if (checkOut && e.target.value >= checkOut) {
                            setCheckOut("");
                          }
                        }}
                        className="pl-8 bg-[oklch(0.18_0.03_260)] border-[oklch(0.25_0.03_260)] text-white text-sm [color-scheme:dark]"
                        data-ocid="hotel-booking.checkin.input"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="check-out"
                      className="text-slate-300 text-sm"
                    >
                      Check-out Date
                    </Label>
                    <div className="relative">
                      <Calendar
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                      />
                      <Input
                        id="check-out"
                        type="date"
                        min={minCheckOut}
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        disabled={!checkIn}
                        className="pl-8 bg-[oklch(0.18_0.03_260)] border-[oklch(0.25_0.03_260)] text-white text-sm disabled:opacity-40 [color-scheme:dark]"
                        data-ocid="hotel-booking.checkout.input"
                      />
                    </div>
                  </div>
                </div>

                {/* Nights summary */}
                {nights > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-[oklch(0.35_0.08_45/0.4)] bg-[oklch(0.18_0.03_260)] px-4 py-3"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">
                        {nights} night{nights !== 1 ? "s" : ""} × ₹
                        {pricePerNight.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[oklch(0.75_0.15_45)] font-bold text-lg">
                        ₹{totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {formatDate(checkIn)} → {formatDate(checkOut)}
                    </p>
                  </motion.div>
                )}

                <Button
                  onClick={handleStep1Continue}
                  disabled={
                    !checkIn ||
                    !checkOut ||
                    nights <= 0 ||
                    hotel.roomTypes.length === 0
                  }
                  className="w-full bg-gradient-to-r from-[oklch(0.75_0.15_45)] to-[oklch(0.7_0.18_45)] text-[oklch(0.1_0.01_260)] font-bold hover:opacity-90 h-11 disabled:opacity-40"
                  data-ocid="hotel-booking.step1.primary_button"
                >
                  Continue to Guest Details
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleClose}
                  className="w-full text-slate-500 hover:text-slate-300 hover:bg-white/5 text-sm h-9"
                  data-ocid="hotel-booking.step1.cancel_button"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Guest Details ─────────────────────────────────────── */}
          {step === "guest-details" && (
            <motion.div
              key="guest-details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="px-6 pt-6 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <User size={18} className="text-[oklch(0.75_0.15_45)]" />
                  <DialogTitle className="text-white font-display text-xl">
                    Guest Details
                  </DialogTitle>
                </div>
                <p className="text-slate-400 text-sm">
                  {selectedRoom?.name} · {nights} night{nights !== 1 ? "s" : ""}{" "}
                  ·{" "}
                  <span className="text-[oklch(0.75_0.15_45)] font-semibold">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </span>
                </p>
              </DialogHeader>

              <div className="px-6 pb-6 space-y-4">
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
                    className="bg-[oklch(0.18_0.03_260)] border-[oklch(0.25_0.03_260)] text-white placeholder:text-slate-600 focus:border-[oklch(0.75_0.15_45/0.7)]"
                    data-ocid="hotel-booking.guest-name.input"
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
                    className="bg-[oklch(0.18_0.03_260)] border-[oklch(0.25_0.03_260)] text-white placeholder:text-slate-600 focus:border-[oklch(0.75_0.15_45/0.7)]"
                    data-ocid="hotel-booking.guest-phone.input"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="guest-email"
                    className="text-slate-300 text-sm"
                  >
                    Email Address{" "}
                    <span className="text-slate-500">(optional)</span>
                  </Label>
                  <Input
                    id="guest-email"
                    type="email"
                    placeholder="your@email.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="bg-[oklch(0.18_0.03_260)] border-[oklch(0.25_0.03_260)] text-white placeholder:text-slate-600 focus:border-[oklch(0.75_0.15_45/0.7)]"
                    data-ocid="hotel-booking.guest-email.input"
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  <Button
                    variant="ghost"
                    onClick={() => setStep("room-dates")}
                    className="flex-1 text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-1.5"
                    data-ocid="hotel-booking.step2.cancel_button"
                  >
                    <ArrowLeft size={14} />
                    Back
                  </Button>
                  <Button
                    onClick={handleStep2Continue}
                    disabled={!guestName.trim() || !guestPhone.trim()}
                    className="flex-1 bg-gradient-to-r from-[oklch(0.75_0.15_45)] to-[oklch(0.7_0.18_45)] text-[oklch(0.1_0.01_260)] font-bold hover:opacity-90 h-11 disabled:opacity-40"
                    data-ocid="hotel-booking.step2.primary_button"
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

              {/* Order Summary */}
              <div className="mx-6 mb-5 rounded-xl overflow-hidden border border-[oklch(0.35_0.08_45/0.4)]">
                <div className="h-1 bg-gradient-to-r from-[oklch(0.75_0.15_45)] to-[oklch(0.65_0.18_45)]" />
                <div className="bg-[oklch(0.18_0.03_260)] px-4 py-4 space-y-3">
                  <p className="text-[oklch(0.75_0.15_45)] font-display font-semibold text-xs uppercase tracking-wider">
                    Order Summary
                  </p>
                  <div className="space-y-1">
                    <p className="text-white font-semibold text-base leading-snug">
                      {hotel.name}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {selectedRoom?.name ?? "Room"}
                    </p>
                    <p className="text-slate-500 text-xs">Guest: {guestName}</p>
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Check-in</span>
                      <span className="text-slate-300 text-sm">
                        {formatDate(checkIn)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Check-out</span>
                      <span className="text-slate-300 text-sm">
                        {formatDate(checkOut)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Nights</span>
                      <span className="text-slate-300 text-sm">
                        {nights} night{nights !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">
                        Price/night
                      </span>
                      <span className="text-slate-300 text-sm">
                        ₹{pricePerNight.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1.5 border-t border-white/10">
                      <span className="text-white font-semibold text-sm">
                        Total Amount
                      </span>
                      <span className="text-[oklch(0.75_0.15_45)] font-bold text-xl">
                        ₹{totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security badges */}
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
                  className="w-full bg-gradient-to-r from-[oklch(0.75_0.15_45)] to-[oklch(0.7_0.18_45)] text-[oklch(0.1_0.01_260)] font-bold hover:opacity-90 h-12 text-base"
                  data-ocid="hotel-booking.payment.primary_button"
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
                  onClick={() => setStep("guest-details")}
                  className="w-full text-slate-500 hover:text-slate-300 hover:bg-white/5 text-sm h-9 flex items-center gap-1.5"
                  data-ocid="hotel-booking.payment.cancel_button"
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
              data-ocid="hotel-booking.processing.loading_state"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full border-2 border-[oklch(0.25_0.03_260)] flex items-center justify-center">
                  <Loader2
                    size={36}
                    className="animate-spin text-[oklch(0.75_0.15_45)]"
                  />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-[oklch(0.75_0.15_45/0.3)] animate-ping" />
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
              data-ocid="hotel-booking.success_state"
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
                <p className="text-[oklch(0.75_0.15_45)] font-display font-bold text-xs uppercase tracking-widest">
                  DMT CREATOLOGY
                </p>
                <h3 className="text-white font-display font-bold text-2xl">
                  Booking Confirmed!
                </h3>
                <p className="text-slate-400 text-sm">
                  {hotel.name} — {selectedRoom?.name ?? "Room"}
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
                  <span className="text-slate-400 text-xs">Check-in</span>
                  <span className="text-white text-xs">
                    {formatDate(checkIn)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">Check-out</span>
                  <span className="text-white text-xs">
                    {formatDate(checkOut)}
                  </span>
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
                  className="w-full bg-gradient-to-r from-[oklch(0.75_0.15_45)] to-[oklch(0.7_0.18_45)] text-[oklch(0.1_0.01_260)] font-bold hover:opacity-90 h-11"
                  data-ocid="hotel-booking.view-confirmation.button"
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
              data-ocid="hotel-booking.error_state"
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
                  className="w-full bg-gradient-to-r from-[oklch(0.75_0.15_45)] to-[oklch(0.7_0.18_45)] text-[oklch(0.1_0.01_260)] font-bold hover:opacity-90 h-11"
                  data-ocid="hotel-booking.retry.button"
                >
                  Try Again
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleClose}
                  className="w-full text-slate-400 hover:text-white hover:bg-white/5"
                  data-ocid="hotel-booking.error.cancel_button"
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
