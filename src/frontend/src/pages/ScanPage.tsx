import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActor } from "@/hooks/useActor";
import { useStaffAuth } from "@/hooks/useStaffAuth";
import {
  AlertCircle,
  Camera,
  CameraOff,
  CheckCircle2,
  Clock,
  LogOut,
  QrCode,
  RefreshCw,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BookingStatus } from "../backend.d";
// EventBooking type - defined locally since it was removed from the reduced backend.d.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventBooking = any;
import { useQRScanner } from "../qr-code/useQRScanner";

type VerifyResult =
  | { type: "valid"; booking: EventBooking }
  | { type: "already_used"; booking: EventBooking }
  | { type: "invalid" }
  | { type: "error"; message: string };

function formatNanoDate(ns: bigint): string {
  return new Date(Number(ns) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function extractBookingIdFromUrl(raw: string): string | null {
  const input = raw.trim();
  // Try URL format: .../ticket/5
  const urlMatch = input.match(/\/ticket\/(\d+)$/);
  if (urlMatch) return urlMatch[1];
  // Try direct ticket ID: TKT-5
  const tktMatch = input.match(/^TKT-(\d+)$/i);
  if (tktMatch) return tktMatch[1];
  // Try plain number
  if (/^\d+$/.test(input)) return input;
  return null;
}

function getRoleLabel(role: string): string {
  switch (role) {
    case "gateStaff":
      return "Gate Staff";
    case "eventManager":
      return "Event Manager";
    case "admin":
      return "Admin";
    default:
      return role;
  }
}

export default function ScanPage() {
  const { actor } = useActor();
  const { session, logout } = useStaffAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/staff/login";
  };
  const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const autoResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastProcessedRef = useRef<string>("");

  const scanner = useQRScanner({
    facingMode: "environment",
    scanInterval: 200,
    maxResults: 1,
  });

  const clearAutoReset = useCallback(() => {
    if (autoResetRef.current) {
      clearTimeout(autoResetRef.current);
      autoResetRef.current = null;
    }
  }, []);

  const resetResult = useCallback(() => {
    clearAutoReset();
    setVerifyResult(null);
    lastProcessedRef.current = "";
    scanner.clearResults();
  }, [clearAutoReset, scanner]);

  const verifyBookingId = useCallback(
    async (rawId: string) => {
      if (!actor) {
        setVerifyResult({
          type: "error",
          message:
            "Scan requires admin/staff access. Please authenticate first.",
        });
        return;
      }

      setIsVerifying(true);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bookings = await (actor as any).getAllEventBookings();
        const idNum = BigInt(rawId.trim());
        const booking = bookings.find((b) => b.id === idNum);

        if (!booking) {
          setVerifyResult({ type: "invalid" });
        } else if (booking.status === BookingStatus.confirmed) {
          setVerifyResult({ type: "already_used", booking });
        } else {
          // Mark as used (confirmed)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (actor as any).updateEventBookingStatus(
            booking.id,
            BookingStatus.confirmed,
          );
          setVerifyResult({ type: "valid", booking });
        }
      } catch (err) {
        console.error("Verify error:", err);
        setVerifyResult({
          type: "error",
          message: "Unable to verify. Check your connection or try again.",
        });
      } finally {
        setIsVerifying(false);
      }

      // Auto-reset after 4 seconds
      clearAutoReset();
      autoResetRef.current = setTimeout(() => {
        resetResult();
      }, 4000);
    },
    [actor, resetResult, clearAutoReset],
  );

  // Watch for new QR scan results
  useEffect(() => {
    if (!scanner.qrResults.length) return;
    const latest = scanner.qrResults[0];
    if (latest.data === lastProcessedRef.current) return;
    if (isVerifying) return;

    lastProcessedRef.current = latest.data;
    const bookingId = extractBookingIdFromUrl(latest.data);
    if (bookingId) {
      verifyBookingId(bookingId);
    } else {
      setVerifyResult({ type: "invalid" });
      clearAutoReset();
      autoResetRef.current = setTimeout(() => resetResult(), 4000);
    }
  }, [
    scanner.qrResults,
    isVerifying,
    verifyBookingId,
    resetResult,
    clearAutoReset,
  ]);

  // Keep stopScanning in a ref so cleanup effect doesn't need to re-run
  const stopScanningRef = useRef(scanner.stopScanning);
  stopScanningRef.current = scanner.stopScanning;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAutoReset();
      stopScanningRef.current();
    };
  }, [clearAutoReset]);

  const handleManualVerify = useCallback(() => {
    if (!manualInput.trim()) return;
    const bookingId = extractBookingIdFromUrl(manualInput);
    if (bookingId) {
      lastProcessedRef.current = manualInput;
      verifyBookingId(bookingId);
      setManualInput("");
    } else {
      setVerifyResult({ type: "invalid" });
    }
  }, [manualInput, verifyBookingId]);

  const handleStartScanning = useCallback(async () => {
    resetResult();
    await scanner.startScanning();
  }, [resetResult, scanner]);

  const handleStopScanning = useCallback(async () => {
    await scanner.stopScanning();
    resetResult();
  }, [resetResult, scanner]);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 mb-4">
            <ShieldCheck className="w-4 h-4 text-gold" />
            <span className="text-gold text-xs font-semibold tracking-wider uppercase">
              Staff Access
            </span>
          </div>
          <h1 className="font-display text-3xl font-black text-foreground flex items-center justify-center gap-2 mb-2">
            <QrCode className="w-7 h-7 text-gold" />
            Entry Verification
          </h1>
          <p className="text-muted-foreground text-sm">
            DMT CREATOLOGY — Event Entry System
          </p>

          {/* Staff info row */}
          {session && (
            <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
              <span className="text-muted-foreground text-xs">
                Logged in as:{" "}
                <span className="text-foreground font-semibold">
                  {session.username}
                </span>{" "}
                &bull;{" "}
                <span className="text-gold/80">
                  {getRoleLabel(session.role)}
                </span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10 text-xs h-7 px-2 py-1"
                data-ocid="scan.logout_button"
              >
                <LogOut size={12} className="mr-1.5" />
                Logout
              </Button>
            </div>
          )}
        </div>

        {/* Camera Preview */}
        <div className="relative bg-[oklch(0.12_0.018_260)] rounded-2xl overflow-hidden border border-border mb-5 aspect-[4/3] max-w-sm mx-auto">
          {/* Video element (always rendered so refs are stable) */}
          <video
            ref={scanner.videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${scanner.isActive ? "block" : "hidden"}`}
          />
          <canvas ref={scanner.canvasRef} className="hidden" />

          {/* Overlay when not scanning */}
          {!scanner.isActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <Camera className="w-12 h-12 text-muted-foreground opacity-30" />
              <p className="text-muted-foreground text-sm text-center px-4">
                {scanner.error
                  ? scanner.error.message
                  : "Press Start Scanning to activate camera"}
              </p>
            </div>
          )}

          {/* Scanning frame overlay */}
          {scanner.isScanning && !verifyResult && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 border-2 border-gold/60 rounded-xl relative">
                <span className="absolute -top-0.5 -left-0.5 w-5 h-5 border-t-2 border-l-2 border-gold rounded-tl" />
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 border-t-2 border-r-2 border-gold rounded-tr" />
                <span className="absolute -bottom-0.5 -left-0.5 w-5 h-5 border-b-2 border-l-2 border-gold rounded-bl" />
                <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 border-b-2 border-r-2 border-gold rounded-br" />
                {/* Animated scan line */}
                <div className="absolute left-0 right-0 h-0.5 bg-gold/70 animate-[scan_2s_linear_infinite]" />
              </div>
            </div>
          )}

          {/* Loading indicator */}
          {scanner.isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
            </div>
          )}

          {/* Verifying indicator */}
          {isVerifying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <div className="text-center">
                <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin mx-auto mb-2" />
                <p className="text-white text-sm font-medium">Verifying...</p>
              </div>
            </div>
          )}
        </div>

        {/* Camera controls */}
        <div className="flex gap-3 mb-6 max-w-sm mx-auto">
          {!scanner.isScanning ? (
            <Button
              onClick={handleStartScanning}
              disabled={scanner.isLoading || !scanner.isSupported}
              className="flex-1 gradient-gold text-[oklch(0.1_0.01_260)] font-bold flex items-center gap-2"
              data-ocid="scan.start_button"
            >
              <Camera className="w-4 h-4" />
              Start Scanning
            </Button>
          ) : (
            <Button
              onClick={handleStopScanning}
              variant="outline"
              className="flex-1 border-border text-muted-foreground hover:bg-muted flex items-center gap-2"
              data-ocid="scan.stop_button"
            >
              <CameraOff className="w-4 h-4" />
              Stop Scanning
            </Button>
          )}
          {verifyResult && (
            <Button
              onClick={resetResult}
              variant="outline"
              className="border-border text-muted-foreground hover:bg-muted flex items-center gap-2 px-3"
              data-ocid="scan.reset_button"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </Button>
          )}
        </div>

        {/* Result Card */}
        {verifyResult && (
          <div
            className="mb-6 rounded-2xl overflow-hidden border animate-in fade-in slide-in-from-bottom-4 duration-300"
            data-ocid="scan.result.card"
          >
            {verifyResult.type === "valid" && (
              <div className="bg-green-950/60 border-green-500/40 p-6 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-3" />
                <h3 className="text-2xl font-black text-green-400 font-display mb-1">
                  VALID TICKET
                </h3>
                <p className="text-green-300 text-sm mb-4">
                  Entry granted — ticket marked as used
                </p>
                <div className="bg-green-900/40 rounded-xl p-4 text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-400/70 text-xs uppercase tracking-wider">
                      Event
                    </span>
                    <span className="text-green-100 text-sm font-semibold text-right max-w-[60%]">
                      {verifyResult.booking.eventName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-400/70 text-xs uppercase tracking-wider">
                      Name
                    </span>
                    <span className="text-green-100 text-sm font-semibold">
                      {verifyResult.booking.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-400/70 text-xs uppercase tracking-wider">
                      Category
                    </span>
                    <span className="text-green-100 text-sm font-semibold">
                      {verifyResult.booking.ticketCategory}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-400/70 text-xs uppercase tracking-wider">
                      Qty
                    </span>
                    <span className="text-green-100 text-sm font-semibold">
                      {String(verifyResult.booking.quantity)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-400/70 text-xs uppercase tracking-wider">
                      Ticket ID
                    </span>
                    <span className="text-green-100 text-sm font-mono font-bold">
                      TKT-{String(verifyResult.booking.id)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {verifyResult.type === "already_used" && (
              <div className="bg-yellow-950/60 border-yellow-500/40 p-6 text-center">
                <Clock className="w-16 h-16 text-yellow-400 mx-auto mb-3" />
                <h3 className="text-2xl font-black text-yellow-400 font-display mb-1">
                  ALREADY USED
                </h3>
                <p className="text-yellow-300 text-sm mb-4">
                  This ticket has already been scanned and used for entry
                </p>
                <div className="bg-yellow-900/40 rounded-xl p-4 text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-yellow-400/70 text-xs uppercase tracking-wider">
                      Event
                    </span>
                    <span className="text-yellow-100 text-sm font-semibold text-right max-w-[60%]">
                      {verifyResult.booking.eventName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-400/70 text-xs uppercase tracking-wider">
                      Name
                    </span>
                    <span className="text-yellow-100 text-sm font-semibold">
                      {verifyResult.booking.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-400/70 text-xs uppercase tracking-wider">
                      Booked
                    </span>
                    <span className="text-yellow-100 text-sm font-semibold">
                      {formatNanoDate(verifyResult.booking.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-400/70 text-xs uppercase tracking-wider">
                      Ticket ID
                    </span>
                    <span className="text-yellow-100 text-sm font-mono font-bold">
                      TKT-{String(verifyResult.booking.id)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {verifyResult.type === "invalid" && (
              <div className="bg-red-950/60 border-red-500/40 p-6 text-center">
                <XCircle className="w-16 h-16 text-red-400 mx-auto mb-3" />
                <h3 className="text-2xl font-black text-red-400 font-display mb-1">
                  INVALID TICKET
                </h3>
                <p className="text-red-300 text-sm">
                  This QR code is not valid or does not exist in our system
                </p>
              </div>
            )}

            {verifyResult.type === "error" && (
              <div className="bg-muted/60 border-border p-6 text-center">
                <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-xl font-black text-foreground font-display mb-1">
                  Error
                </h3>
                <p className="text-muted-foreground text-sm">
                  {verifyResult.message}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Manual Entry Section */}
        <div className="bg-[oklch(0.14_0.018_260)] rounded-2xl border border-border p-5">
          <h3 className="font-display font-bold text-foreground text-sm mb-1 flex items-center gap-2">
            <Search className="w-4 h-4 text-gold" />
            Manual Entry
          </h3>
          <p className="text-muted-foreground text-xs mb-4">
            Enter a ticket URL, Ticket ID (e.g. TKT-5), or booking number to
            verify without scanning
          </p>
          <div className="flex gap-2">
            <Input
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleManualVerify()}
              placeholder="TKT-5 or booking number or ticket URL"
              className="bg-input border-border focus:border-gold text-sm flex-1"
              data-ocid="scan.manual_input"
            />
            <Button
              onClick={handleManualVerify}
              disabled={!manualInput.trim() || isVerifying}
              className="gradient-gold text-[oklch(0.1_0.01_260)] font-bold px-4 shrink-0"
              data-ocid="scan.manual_verify_button"
            >
              {isVerifying ? (
                <div className="w-4 h-4 rounded-full border-2 border-[oklch(0.1_0.01_260)] border-t-transparent animate-spin" />
              ) : (
                "Verify"
              )}
            </Button>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Authorized DMT CREATOLOGY staff only &mdash; all scans are logged
        </p>
      </div>
    </div>
  );
}
