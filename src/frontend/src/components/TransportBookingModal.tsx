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
  useCreatePaymentTransaction,
  useCreateTransportBooking,
  useUpdateTransportBookingPaymentStatus,
} from "@/hooks/useAdminQueries";
import {
  AlertCircle,
  ArrowLeft,
  Bus,
  Calendar,
  Car,
  CheckCircle2,
  Loader2,
  MapPin,
  Plane,
  ShieldCheck,
  Ship,
  Train,
  User,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { TransactionStatus, TransportType } from "../backend.d";
import type { TransportOption } from "../backend.d";

// ── Helpers ───────────────────────────────────────────────────────────────────

interface TransportRazorpayOptions {
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

function getTransportIcon(type: TransportType) {
  switch (type) {
    case TransportType.car:
      return Car;
    case TransportType.bus:
      return Bus;
    case TransportType.flight:
    case TransportType.helicopter:
      return Plane;
    case TransportType.train:
      return Train;
    case TransportType.cruise:
      return Ship;
    default:
      return Car;
  }
}

function getTransportLabel(type: TransportType): string {
  switch (type) {
    case TransportType.car:
      return "Car";
    case TransportType.bus:
      return "Bus";
    case TransportType.flight:
      return "Flight";
    case TransportType.train:
      return "Train";
    case TransportType.helicopter:
      return "Helicopter";
    case TransportType.cruise:
      return "Cruise";
    default:
      return String(type);
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface TransportBookingModalProps {
  open: boolean;
  onClose: () => void;
  transport: TransportOption;
}

type Step =
  | "trip-details"
  | "passenger-details"
  | "payment"
  | "processing"
  | "success"
  | "error";

// ── Component ─────────────────────────────────────────────────────────────────

export default function TransportBookingModal({
  open,
  onClose,
  transport,
}: TransportBookingModalProps) {
  const [step, setStep] = useState<Step>("trip-details");

  // Trip details
  const [travelDate, setTravelDate] = useState("");
  const [seats, setSeats] = useState(1);

  // Passenger details
  const [passengerName, setPassengerName] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");
  const [passengerCity, setPassengerCity] = useState("");

  // Payment result
  const [transactionId, setTransactionId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmedBookingId, setConfirmedBookingId] = useState<bigint | null>(
    null,
  );

  // Mutations
  const createTransportBooking = useCreateTransportBooking();
  const createPaymentTransaction = useCreatePaymentTransaction();
  const updatePaymentStatus = useUpdateTransportBookingPaymentStatus();

  // Derived
  const pricePerSeat = Number(transport.price);
  const totalAmount = seats * pricePerSeat;
  const maxSeats = Number(transport.availableSeats);
  const todayStr = new Date().toISOString().split("T")[0];
  const TransportIcon = getTransportIcon(transport.transportType);

  const handleClose = () => {
    if (step === "processing") return;
    setStep("trip-details");
    setTravelDate("");
    setSeats(1);
    setPassengerName("");
    setPassengerPhone("");
    setPassengerEmail("");
    setPassengerCity("");
    setTransactionId("");
    setErrorMessage("");
    setConfirmedBookingId(null);
    onClose();
  };

  const handleStep1Continue = () => {
    if (!travelDate || seats < 1) return;
    setStep("passenger-details");
  };

  const handleStep2Continue = () => {
    if (!passengerName.trim() || !passengerPhone.trim()) return;
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

    const options: TransportRazorpayOptions = {
      key: razorpayKeyId,
      amount: totalAmount * 100, // paise
      currency: "INR",
      name: "DMT CREATOLOGY",
      description: `${getTransportLabel(transport.transportType)} — ${transport.route}`,
      prefill: {
        name: passengerName,
        contact: passengerPhone,
        email: passengerEmail || undefined,
      },
      theme: { color: "#C5A44A" },
      handler: async (response) => {
        const paymentId = response.razorpay_payment_id;
        setTransactionId(paymentId);

        try {
          // 1. Save transport booking in backend
          const bookingId = await createTransportBooking.mutateAsync({
            transportId: transport.id,
            transportName: transport.operatorName,
            transportType: transport.transportType as string,
            operatorName: transport.operatorName,
            route: transport.route,
            passengerName: passengerName.trim(),
            passengerPhone: passengerPhone.trim(),
            passengerEmail: passengerEmail.trim(),
            city: passengerCity.trim() || transport.city,
            travelDate: toNano(travelDate),
            seats: BigInt(seats),
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

          // 3. Update transport booking payment status
          await updatePaymentStatus.mutateAsync({
            id: bookingId,
            paymentStatus: TransactionStatus.completed,
          });

          // 4. Save confirmation to localStorage
          localStorage.setItem(
            `transport-booking-${bookingId}`,
            JSON.stringify({
              bookingId: String(bookingId),
              transportName: transport.operatorName,
              transportType: transport.transportType,
              operatorName: transport.operatorName,
              route: transport.route,
              city: transport.city,
              passengerName: passengerName.trim(),
              passengerPhone: passengerPhone.trim(),
              passengerEmail: passengerEmail.trim(),
              travelDate,
              seats,
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
    window.location.href = `/transport-confirmation/${confirmedBookingId}`;
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
        data-ocid="transport-booking.dialog"
      >
        <AnimatePresence mode="wait">
          {/* ── Step 1: Trip Details ───────────────────────────────────── */}
          {step === "trip-details" && (
            <motion.div
              key="trip-details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="px-6 pt-6 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <TransportIcon
                    size={18}
                    className="text-[oklch(0.75_0.15_45)]"
                  />
                  <DialogTitle className="text-white font-display text-xl">
                    Trip Details
                  </DialogTitle>
                </div>
                <p className="text-slate-400 text-sm">
                  {getTransportLabel(transport.transportType)} ·{" "}
                  {transport.operatorName}
                </p>
              </DialogHeader>

              <div className="px-6 pb-6 space-y-5">
                {/* Transport info card */}
                <div className="bg-[oklch(0.18_0.03_260)] rounded-xl border border-[oklch(0.25_0.03_260)] p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <TransportIcon
                      size={16}
                      className="text-[oklch(0.75_0.15_45)]"
                    />
                    <span className="text-white font-semibold text-sm capitalize">
                      {getTransportLabel(transport.transportType)}
                    </span>
                    <span className="text-slate-500 text-sm">·</span>
                    <span className="text-slate-400 text-sm">
                      {transport.operatorName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300 text-sm">
                    <MapPin size={13} className="text-[oklch(0.75_0.15_45)]" />
                    {transport.route}
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <span className="text-slate-400 text-xs">
                      ₹{pricePerSeat.toLocaleString("en-IN")} / seat
                    </span>
                    <span className="text-slate-400 text-xs">
                      {String(transport.availableSeats)} seats available
                    </span>
                  </div>
                </div>

                {/* Travel date */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="travel-date"
                    className="text-slate-300 text-sm"
                  >
                    Travel Date
                  </Label>
                  <div className="relative">
                    <Calendar
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                    />
                    <Input
                      id="travel-date"
                      type="date"
                      min={todayStr}
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="pl-8 bg-[oklch(0.18_0.03_260)] border-[oklch(0.25_0.03_260)] text-white text-sm [color-scheme:dark]"
                      data-ocid="transport-booking.travel-date.input"
                    />
                  </div>
                </div>

                {/* Number of seats */}
                <div className="space-y-1.5">
                  <Label className="text-slate-300 text-sm">
                    Number of Seats
                  </Label>
                  <div className="relative">
                    <Users
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                    />
                    <Input
                      type="number"
                      min={1}
                      max={maxSeats}
                      value={seats}
                      onChange={(e) =>
                        setSeats(
                          Math.max(
                            1,
                            Math.min(maxSeats, Number(e.target.value)),
                          ),
                        )
                      }
                      className="pl-8 bg-[oklch(0.18_0.03_260)] border-[oklch(0.25_0.03_260)] text-white text-sm"
                      data-ocid="transport-booking.seats.input"
                    />
                  </div>
                </div>

                {/* Price summary */}
                {travelDate && seats > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-[oklch(0.35_0.08_45/0.4)] bg-[oklch(0.18_0.03_260)] px-4 py-3"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">
                        {seats} seat{seats !== 1 ? "s" : ""} × ₹
                        {pricePerSeat.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[oklch(0.75_0.15_45)] font-bold text-lg">
                        ₹{totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Travel: {formatDate(travelDate)}
                    </p>
                  </motion.div>
                )}

                <Button
                  onClick={handleStep1Continue}
                  disabled={!travelDate || seats < 1}
                  className="w-full bg-gradient-to-r from-[oklch(0.75_0.15_45)] to-[oklch(0.7_0.18_45)] text-[oklch(0.1_0.01_260)] font-bold hover:opacity-90 h-11 disabled:opacity-40"
                  data-ocid="transport-booking.step1.primary_button"
                >
                  Continue to Passenger Details
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleClose}
                  className="w-full text-slate-500 hover:text-slate-300 hover:bg-white/5 text-sm h-9"
                  data-ocid="transport-booking.step1.cancel_button"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Passenger Details ──────────────────────────────── */}
          {step === "passenger-details" && (
            <motion.div
              key="passenger-details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="px-6 pt-6 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <User size={18} className="text-[oklch(0.75_0.15_45)]" />
                  <DialogTitle className="text-white font-display text-xl">
                    Passenger Details
                  </DialogTitle>
                </div>
                <p className="text-slate-400 text-sm">
                  {seats} seat{seats !== 1 ? "s" : ""} · {transport.route} ·{" "}
                  <span className="text-[oklch(0.75_0.15_45)] font-semibold">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </span>
                </p>
              </DialogHeader>

              <div className="px-6 pb-6 space-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="passenger-name"
                    className="text-slate-300 text-sm"
                  >
                    Full Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="passenger-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    className="bg-[oklch(0.18_0.03_260)] border-[oklch(0.25_0.03_260)] text-white placeholder:text-slate-600 focus:border-[oklch(0.75_0.15_45/0.7)]"
                    data-ocid="transport-booking.passenger-name.input"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="passenger-phone"
                    className="text-slate-300 text-sm"
                  >
                    Phone Number <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="passenger-phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    className="bg-[oklch(0.18_0.03_260)] border-[oklch(0.25_0.03_260)] text-white placeholder:text-slate-600 focus:border-[oklch(0.75_0.15_45/0.7)]"
                    data-ocid="transport-booking.passenger-phone.input"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="passenger-email"
                    className="text-slate-300 text-sm"
                  >
                    Email Address{" "}
                    <span className="text-slate-500">(optional)</span>
                  </Label>
                  <Input
                    id="passenger-email"
                    type="email"
                    placeholder="your@email.com"
                    value={passengerEmail}
                    onChange={(e) => setPassengerEmail(e.target.value)}
                    className="bg-[oklch(0.18_0.03_260)] border-[oklch(0.25_0.03_260)] text-white placeholder:text-slate-600 focus:border-[oklch(0.75_0.15_45/0.7)]"
                    data-ocid="transport-booking.passenger-email.input"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="passenger-city"
                    className="text-slate-300 text-sm"
                  >
                    City <span className="text-slate-500">(optional)</span>
                  </Label>
                  <Input
                    id="passenger-city"
                    type="text"
                    placeholder="Your city"
                    value={passengerCity}
                    onChange={(e) => setPassengerCity(e.target.value)}
                    className="bg-[oklch(0.18_0.03_260)] border-[oklch(0.25_0.03_260)] text-white placeholder:text-slate-600 focus:border-[oklch(0.75_0.15_45/0.7)]"
                    data-ocid="transport-booking.passenger-city.input"
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  <Button
                    variant="ghost"
                    onClick={() => setStep("trip-details")}
                    className="flex-1 text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-1.5"
                    data-ocid="transport-booking.step2.cancel_button"
                  >
                    <ArrowLeft size={14} />
                    Back
                  </Button>
                  <Button
                    onClick={handleStep2Continue}
                    disabled={!passengerName.trim() || !passengerPhone.trim()}
                    className="flex-1 bg-gradient-to-r from-[oklch(0.75_0.15_45)] to-[oklch(0.7_0.18_45)] text-[oklch(0.1_0.01_260)] font-bold hover:opacity-90 h-11 disabled:opacity-40"
                    data-ocid="transport-booking.step2.primary_button"
                  >
                    Proceed to Payment
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Payment ──────────────────────────────────────────── */}
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
                      {transport.operatorName}
                    </p>
                    <p className="text-slate-400 text-sm">{transport.route}</p>
                    <p className="text-slate-500 text-xs">
                      Passenger: {passengerName}
                    </p>
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">
                        Travel Date
                      </span>
                      <span className="text-slate-300 text-sm">
                        {formatDate(travelDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Seats</span>
                      <span className="text-slate-300 text-sm">
                        {seats} seat{seats !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Price/seat</span>
                      <span className="text-slate-300 text-sm">
                        ₹{pricePerSeat.toLocaleString("en-IN")}
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
                  data-ocid="transport-booking.payment.primary_button"
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
                  onClick={() => setStep("passenger-details")}
                  className="w-full text-slate-500 hover:text-slate-300 hover:bg-white/5 text-sm h-9 flex items-center gap-1.5"
                  data-ocid="transport-booking.payment.cancel_button"
                >
                  <ArrowLeft size={14} />
                  Back
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── Processing ─────────────────────────────────────────────── */}
          {step === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center py-16 px-6"
              data-ocid="transport-booking.processing.loading_state"
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

          {/* ── Success ────────────────────────────────────────────────── */}
          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center py-10 px-6"
              data-ocid="transport-booking.success_state"
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
                  {transport.operatorName} — {transport.route}
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
                  <span className="text-slate-400 text-xs">Travel Date</span>
                  <span className="text-white text-xs">
                    {formatDate(travelDate)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">Seats</span>
                  <span className="text-white text-xs">
                    {seats} seat{seats !== 1 ? "s" : ""}
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
                  data-ocid="transport-booking.view-confirmation.button"
                >
                  View Booking Confirmation
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* ── Error ──────────────────────────────────────────────────── */}
          {step === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center py-10 px-6"
              data-ocid="transport-booking.error_state"
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
                  data-ocid="transport-booking.retry.button"
                >
                  Try Again
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleClose}
                  className="w-full text-slate-400 hover:text-white hover:bg-white/5"
                  data-ocid="transport-booking.error.cancel_button"
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
