import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreatePaymentTransaction } from "@/hooks/useAdminQueries";
import { AlertCircle, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { TransactionStatus } from "../backend.d";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open(): void };
  }
}

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

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  bookingId: bigint;
  eventName: string;
  ticketCategory: string;
  quantity: number;
  pricePerTicket: number;
  customerName: string;
}

type ModalStep = "confirm" | "processing" | "success" | "error";

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
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

export default function PaymentModal({
  open,
  onClose,
  bookingId,
  eventName,
  ticketCategory,
  quantity,
  pricePerTicket,
  customerName,
}: PaymentModalProps) {
  const [step, setStep] = useState<ModalStep>("confirm");
  const [transactionId, setTransactionId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const createPaymentTransaction = useCreatePaymentTransaction();
  const totalAmount = quantity * pricePerTicket;

  const handleClose = () => {
    if (step === "processing") return; // prevent close while processing
    setStep("confirm");
    setTransactionId("");
    setErrorMessage("");
    onClose();
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

    const options: RazorpayOptions = {
      key: razorpayKeyId,
      amount: totalAmount * 100, // amount in paise
      currency: "INR",
      name: "DMT CREATOLOGY",
      description: `${ticketCategory} - ${eventName}`,
      prefill: { name: customerName },
      theme: { color: "#C5A44A" },
      handler: async (response) => {
        const paymentId = response.razorpay_payment_id;
        setTransactionId(paymentId);

        try {
          await createPaymentTransaction.mutateAsync({
            transactionId: paymentId,
            paymentMethod: "razorpay",
            amount: BigInt(totalAmount),
            bookingId,
            status: TransactionStatus.completed,
          });

          // Save ticket data to localStorage for the ticket page
          localStorage.setItem(
            `ticket-${bookingId}`,
            JSON.stringify({
              bookingId: String(bookingId),
              eventName,
              ticketCategory,
              customerName,
              quantity: String(quantity),
              timestamp: Date.now(),
            }),
          );

          setStep("success");
        } catch {
          setErrorMessage(
            "Payment received but failed to save record. Please contact support.",
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
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setErrorMessage("Failed to open payment gateway. Please try again.");
      setStep("error");
    }
  };

  const handleViewTicket = () => {
    handleClose();
    window.location.href = `/ticket/${bookingId}`;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o && step !== "processing") handleClose();
      }}
    >
      <DialogContent
        className="sm:max-w-lg bg-[oklch(0.13_0.02_260)] border-[oklch(0.25_0.03_260)] text-white p-0 overflow-hidden"
        data-ocid="payment.dialog"
      >
        <AnimatePresence mode="wait">
          {/* ── Step 1: Confirm & Pay ─────────────────────────────────── */}
          {step === "confirm" && (
            <motion.div
              key="confirm"
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
                  <div className="space-y-2">
                    <p className="text-white font-semibold text-base leading-snug">
                      {eventName}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {ticketCategory} ticket
                      {quantity !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="space-y-1.5 pt-1 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">
                        Price per ticket
                      </span>
                      <span className="text-slate-300 text-sm">
                        ₹{pricePerTicket.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Quantity</span>
                      <span className="text-slate-300 text-sm">
                        × {quantity}
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

              {/* Payment Badges */}
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

              {/* Pay Button */}
              <div className="px-6 pb-6 space-y-2">
                <Button
                  onClick={handlePayWithRazorpay}
                  className="w-full bg-gradient-to-r from-[oklch(0.75_0.15_45)] to-[oklch(0.7_0.18_45)] text-[oklch(0.1_0.01_260)] font-bold hover:opacity-90 h-12 text-base"
                  data-ocid="payment.pay.button"
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
                  onClick={handleClose}
                  className="w-full text-slate-500 hover:text-slate-300 hover:bg-white/5 text-sm h-9"
                  data-ocid="payment.cancel.button"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Processing ────────────────────────────────────── */}
          {step === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center py-16 px-6"
              data-ocid="payment.processing.loading_state"
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

          {/* ── Step 3: Success ───────────────────────────────────────── */}
          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center py-10 px-6"
              data-ocid="payment.success_state"
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
                  Payment Successful!
                </h3>
                <p className="text-slate-400 text-sm">
                  Your booking has been confirmed
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
                  <span className="text-slate-400 text-xs">Gateway</span>
                  <span className="text-white text-xs">Razorpay</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="w-full"
              >
                <Button
                  onClick={handleViewTicket}
                  className="w-full bg-gradient-to-r from-[oklch(0.75_0.15_45)] to-[oklch(0.7_0.18_45)] text-[oklch(0.1_0.01_260)] font-bold hover:opacity-90 h-11"
                  data-ocid="payment.view_ticket.button"
                >
                  View My Ticket
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* ── Step 4: Error ─────────────────────────────────────────── */}
          {step === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center py-10 px-6"
              data-ocid="payment.error_state"
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
                    setStep("confirm");
                  }}
                  className="w-full bg-gradient-to-r from-[oklch(0.75_0.15_45)] to-[oklch(0.7_0.18_45)] text-[oklch(0.1_0.01_260)] font-bold hover:opacity-90 h-11"
                  data-ocid="payment.retry.button"
                >
                  Try Again
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleClose}
                  className="w-full text-slate-400 hover:text-white hover:bg-white/5"
                  data-ocid="payment.cancel.button"
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
