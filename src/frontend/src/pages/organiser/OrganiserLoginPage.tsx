import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrganiserAuth } from "@/hooks/useOrganiserAuth";
import { Loader2, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function OrganiserLoginPage() {
  const { login, isAuthenticated } = useOrganiserAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = "/organiser";
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error("Please enter your username and password.");
      return;
    }
    setIsLoading(true);
    try {
      await login(username.trim(), password);
      toast.success("Login successful!");
      window.location.href = "/organiser";
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Login failed. Please check your credentials.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-red-600/10 blur-[120px]" />
      </div>

      <div
        className="relative w-full max-w-sm"
        data-ocid="organiser.login.panel"
      >
        <div
          className="border border-white/10 rounded-2xl p-8 shadow-2xl"
          style={{ background: "rgba(10,10,10,0.95)" }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-600/10 border border-red-600/30 mb-4">
              <Zap className="text-red-500" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              DMT CREATOLOGY
            </h1>
            <p className="text-red-500 text-xs font-semibold tracking-widest uppercase mt-1">
              Organiser Portal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Username</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                disabled={isLoading}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-red-500/50 focus:ring-red-500/20"
                data-ocid="organiser.login.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={isLoading}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-red-500/50 focus:ring-red-500/20"
                data-ocid="organiser.login.password_input"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !username.trim() || !password.trim()}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 text-base rounded-xl transition-all shadow-lg shadow-red-900/30"
              data-ocid="organiser.login.submit_button"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="text-center text-slate-600 text-xs mt-6">
            Account provided by admin only. No self-registration.
          </p>
        </div>

        <p className="text-center text-slate-700 text-xs mt-4">
          &copy; {new Date().getFullYear()} DMT CREATOLOGY
        </p>
      </div>
    </div>
  );
}
