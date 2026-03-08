import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActor } from "@/hooks/useActor";
import { useStaffAuth } from "@/hooks/useStaffAuth";
import { Loader2, QrCode, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function StaffLoginPage() {
  const { isAuthenticated, login } = useStaffAuth();
  const { actor } = useActor();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const usernameRef = useRef<HTMLInputElement>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = "/scan";
    }
  }, [isAuthenticated]);

  // Focus username on mount
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage("Please enter both username and password.");
      return;
    }
    setErrorMessage(null);
    setIsLoggingIn(true);
    try {
      await login(username.trim(), password);
      toast.success("Login successful! Redirecting to scanner...");
      window.location.href = "/scan";
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Login failed. Please check your credentials.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleInitDefault = async () => {
    if (!actor) {
      toast.error("Service unavailable. Please wait and try again.");
      return;
    }
    setIsInitializing(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (actor as any).initDefaultStaffAccount();
      toast.success(
        "Default staff account initialized! Try: gatestaff / Staff@123",
      );
    } catch {
      toast.error("Failed to initialize default account.");
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Ambient background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-gold/5 blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-amber-600/4 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md" data-ocid="staff.login.panel">
        {/* Card */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 mb-4">
              <QrCode className="text-gold" size={28} />
            </div>
            <h1 className="text-2xl font-display font-bold text-white tracking-tight">
              DMT CREATOLOGY
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Staff Access — Event Entry System
            </p>
          </div>

          {/* Demo credentials hint */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3 mb-6">
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck size={13} className="text-amber-400" />
              <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
                Demo Credentials
              </p>
            </div>
            <p className="text-amber-300/80 text-sm">
              Username: <span className="font-mono font-bold">gatestaff</span>
            </p>
            <p className="text-amber-300/80 text-sm">
              Password: <span className="font-mono font-bold">Staff@123</span>
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="staff-username"
                className="text-slate-300 text-sm"
              >
                Username
              </Label>
              <Input
                id="staff-username"
                ref={usernameRef}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                disabled={isLoggingIn}
                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500 focus:border-gold/50 focus:ring-gold/20"
                data-ocid="staff.login.username_input"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="staff-password"
                className="text-slate-300 text-sm"
              >
                Password
              </Label>
              <Input
                id="staff-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={isLoggingIn}
                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500 focus:border-gold/50 focus:ring-gold/20"
                data-ocid="staff.login.password_input"
              />
            </div>

            {/* Inline error */}
            {errorMessage && (
              <div
                className="bg-red-500/10 border border-red-500/25 rounded-lg px-4 py-2.5"
                data-ocid="staff.login.error_state"
              >
                <p className="text-red-400 text-sm">{errorMessage}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoggingIn || !username.trim() || !password.trim()}
              className="w-full bg-gold text-slate-950 hover:bg-gold/90 font-bold py-6 text-base rounded-xl transition-all mt-2"
              data-ocid="staff.login.submit_button"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-5 w-5" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-900 px-3 text-slate-500 text-xs uppercase tracking-wider">
                Setup
              </span>
            </div>
          </div>

          {/* Init default account */}
          <Button
            type="button"
            variant="outline"
            onClick={handleInitDefault}
            disabled={isInitializing}
            className="w-full border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/5 text-sm"
            data-ocid="staff.login.init_button"
          >
            {isInitializing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : (
              "Initialize Default Staff Account"
            )}
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-4">
          DMT CREATOLOGY &copy; {new Date().getFullYear()} &mdash; Authorized
          staff only
        </p>
      </div>
    </div>
  );
}
