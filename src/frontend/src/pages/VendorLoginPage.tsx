import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Loader2, Store } from "lucide-react";
import { useEffect } from "react";

export default function VendorLoginPage() {
  const { login, isLoggingIn, isLoginSuccess, identity, isInitializing } =
    useInternetIdentity();

  useEffect(() => {
    if (isLoginSuccess && identity) {
      window.location.href = "/vendor/dashboard";
    }
  }, [isLoginSuccess, identity]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md" data-ocid="vendor.login.panel">
        {/* Card */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 mb-4">
              <Store className="text-gold" size={28} />
            </div>
            <h1 className="text-2xl font-display font-bold text-white tracking-tight">
              DMT CREATOLOGY
            </h1>
            <p className="text-slate-400 text-sm mt-1">Vendor Portal</p>
          </div>

          {/* Description */}
          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 mb-6">
            <p className="text-slate-300 text-sm leading-relaxed">
              Sign in with Internet Identity to access your vendor dashboard.
              Manage your profile, services, and booking requests.
            </p>
          </div>

          {/* Login Button */}
          <Button
            onClick={login}
            disabled={isLoggingIn || isInitializing}
            className="w-full bg-gold text-slate-950 hover:bg-gold/90 font-bold py-6 text-base rounded-xl transition-all"
            data-ocid="vendor.login.primary_button"
          >
            {isLoggingIn || isInitializing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {isInitializing ? "Initializing..." : "Signing in..."}
              </>
            ) : (
              <>
                <Store className="mr-2 h-5 w-5" />
                Sign in with Internet Identity
              </>
            )}
          </Button>

          <p className="text-center text-slate-600 text-xs mt-6">
            New vendor?{" "}
            <a href="/vendor/register" className="text-gold/70 hover:text-gold">
              Register your business
            </a>
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
