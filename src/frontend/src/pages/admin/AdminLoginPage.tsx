import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Loader2, ShieldCheck } from "lucide-react";
import { useEffect } from "react";

export default function AdminLoginPage() {
  const { login, isLoggingIn, isLoginSuccess, identity, isInitializing } =
    useInternetIdentity();

  useEffect(() => {
    if (isLoginSuccess && identity) {
      window.location.href = "/admin";
    }
  }, [isLoginSuccess, identity]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md" data-ocid="admin.login.panel">
        {/* Card */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 mb-4">
              <ShieldCheck className="text-gold" size={28} />
            </div>
            <h1 className="text-2xl font-display font-bold text-white tracking-tight">
              DMT CREATOLOGY
            </h1>
            <p className="text-slate-400 text-sm mt-1">Admin Control Panel</p>
          </div>

          {/* Credential Hint */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3 mb-6">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Demo Credentials
            </p>
            <p className="text-amber-300/80 text-sm">
              Username: <span className="font-mono font-bold">admin</span>
            </p>
            <p className="text-amber-300/80 text-sm">
              Password: <span className="font-mono font-bold">MindMatrix</span>
            </p>
            <p className="text-amber-300/60 text-xs mt-1.5">
              Authentication is handled securely via Internet Identity
            </p>
          </div>

          {/* Login Button */}
          <Button
            onClick={login}
            disabled={isLoggingIn || isInitializing}
            className="w-full bg-gold text-slate-950 hover:bg-gold/90 font-bold py-6 text-base rounded-xl transition-all"
            data-ocid="admin.login.primary_button"
          >
            {isLoggingIn || isInitializing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {isInitializing ? "Initializing..." : "Signing in..."}
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-5 w-5" />
                Sign in with Internet Identity
              </>
            )}
          </Button>

          <p className="text-center text-slate-600 text-xs mt-6">
            This admin panel is secured with ICP Internet Identity.
            <br />
            Only authorized principals can access the dashboard.
          </p>
        </div>

        {/* Footer attribution */}
        <p className="text-center text-slate-600 text-xs mt-4">
          DMT CREATOLOGY &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
