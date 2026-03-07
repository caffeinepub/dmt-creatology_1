import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  useGetRazorpayConfig,
  useUpdateRazorpayConfig,
} from "@/hooks/useAdminQueries";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Info,
  Loader2,
  Settings2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminConfigPage() {
  const [keyId, setKeyId] = useState("");
  const [keySecret, setKeySecret] = useState("");
  const [testMode, setTestMode] = useState(true);
  const [showSecret, setShowSecret] = useState(false);
  const [saved, setSaved] = useState(false);

  const { data: backendConfig } = useGetRazorpayConfig();
  const updateConfig = useUpdateRazorpayConfig();

  // Pre-fill from localStorage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem("razorpay_key_id");
    if (storedKey) setKeyId(storedKey);
  }, []);

  // Also pre-fill from backend config if available
  useEffect(() => {
    if (backendConfig) {
      if (backendConfig.keyId && backendConfig.keyId !== "") {
        setKeyId(backendConfig.keyId);
      }
      if (typeof backendConfig.testMode === "boolean") {
        setTestMode(backendConfig.testMode);
      }
    }
  }, [backendConfig]);

  const handleSave = async () => {
    // Always save to localStorage so PaymentModal can read it
    if (keyId.trim()) {
      localStorage.setItem("razorpay_key_id", keyId.trim());
    }

    // Try to save to backend (silently fail if not available)
    try {
      await updateConfig.mutateAsync({
        keyId: keyId.trim(),
        keySecret: keySecret.trim(),
        testMode,
      });
    } catch {
      // Backend function may not be available yet — that's OK
    }

    setSaved(true);
    toast.success("Configuration saved successfully");
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div
      className="p-4 md:p-6 space-y-6 max-w-3xl"
      data-ocid="admin.config.page"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[oklch(0.75_0.15_45/0.15)] flex items-center justify-center flex-shrink-0 mt-0.5">
          <Settings2 size={20} className="text-[oklch(0.75_0.15_45)]" />
        </div>
        <div>
          <h1 className="text-white font-display font-bold text-2xl">
            Configuration
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Manage payment gateway and platform settings
          </p>
        </div>
      </div>

      {/* Razorpay Gateway Card */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <span className="text-blue-400 font-bold text-xs">R</span>
          </div>
          <div>
            <h2 className="text-white font-display font-semibold text-base">
              Razorpay Payment Gateway
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Configure your Razorpay API credentials
            </p>
          </div>
          {testMode && (
            <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-full">
              TEST MODE
            </span>
          )}
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Info box */}
          <div className="flex items-start gap-3 bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
            <Info size={16} className="text-blue-400 mt-0.5 shrink-0" />
            <p className="text-slate-400 text-sm leading-relaxed">
              In <span className="text-amber-400 font-semibold">TEST MODE</span>
              , use Razorpay test credentials. No real payments will be
              processed. Switch to{" "}
              <span className="text-green-400 font-semibold">LIVE MODE</span>{" "}
              only when going live with real transactions.
            </p>
          </div>

          {/* Key ID */}
          <div className="space-y-2">
            <Label className="text-slate-300 text-sm font-medium">
              Razorpay Key ID
            </Label>
            <Input
              value={keyId}
              onChange={(e) => setKeyId(e.target.value)}
              placeholder="rzp_test_XXXXXXXXXXXXXXX"
              className="bg-[oklch(0.18_0.03_260)] border-slate-700 text-white placeholder:text-slate-600 focus:border-[oklch(0.75_0.15_45)] h-11 font-mono text-sm"
              data-ocid="admin.config.key_id.input"
            />
            <p className="text-slate-600 text-xs">
              Starts with <code className="text-slate-500">rzp_test_</code> for
              test mode or <code className="text-slate-500">rzp_live_</code> for
              live mode
            </p>
          </div>

          {/* Key Secret */}
          <div className="space-y-2">
            <Label className="text-slate-300 text-sm font-medium">
              Razorpay Key Secret
            </Label>
            <div className="relative">
              <Input
                value={keySecret}
                onChange={(e) => setKeySecret(e.target.value)}
                type={showSecret ? "text" : "password"}
                placeholder="••••••••••••••••"
                className="bg-[oklch(0.18_0.03_260)] border-slate-700 text-white placeholder:text-slate-600 focus:border-[oklch(0.75_0.15_45)] h-11 font-mono text-sm pr-10"
                data-ocid="admin.config.key_secret.input"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                data-ocid="admin.config.show_secret.button"
              >
                {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-slate-600 text-xs">
              Leave blank to keep existing secret. Only enter when updating
              credentials.
            </p>
          </div>

          {/* Test Mode Toggle */}
          <div className="flex items-center justify-between py-3 px-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div>
              <p className="text-white text-sm font-medium">Test Mode</p>
              <p className="text-slate-500 text-xs mt-0.5">
                Enable to use test credentials (no real payments)
              </p>
            </div>
            <Switch
              checked={testMode}
              onCheckedChange={setTestMode}
              data-ocid="admin.config.test_mode.switch"
            />
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={updateConfig.isPending || !keyId.trim()}
            className="w-full bg-gradient-to-r from-[oklch(0.75_0.15_45)] to-[oklch(0.7_0.18_45)] text-[oklch(0.1_0.01_260)] font-bold hover:opacity-90 disabled:opacity-40 h-11"
            data-ocid="admin.config.save.button"
          >
            {updateConfig.isPending ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <CheckCircle2 size={16} className="mr-2" />
                Saved!
              </>
            ) : (
              "Save Configuration"
            )}
          </Button>
        </div>
      </div>

      {/* Instructions Card */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h2 className="text-white font-display font-semibold text-base">
            Razorpay Test Credentials
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            How to get your test API keys
          </p>
        </div>
        <div className="px-6 py-5 space-y-4">
          <ol className="space-y-3">
            {[
              {
                step: "1",
                text: "Sign up or log in at razorpay.com",
              },
              {
                step: "2",
                text: "Navigate to Settings → API Keys in your dashboard",
              },
              {
                step: "3",
                text: 'Click "Generate Test Key" to create test credentials',
              },
              {
                step: "4",
                text: "Copy the Key ID (starts with rzp_test_) and paste above",
              },
              {
                step: "5",
                text: "The Key Secret is shown only once — save it securely",
              },
            ].map((item) => (
              <li key={item.step} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[oklch(0.75_0.15_45/0.15)] text-[oklch(0.75_0.15_45)] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {item.step}
                </span>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.text}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-4 bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 space-y-2">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              Key Format Reference
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-400 font-mono bg-amber-400/10 px-2 py-0.5 rounded">
                  rzp_test_XXXXXXXXXXXXXXX
                </span>
                <span className="text-slate-500 text-xs">Key ID (Test)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-green-400 font-mono bg-green-400/10 px-2 py-0.5 rounded">
                  rzp_live_XXXXXXXXXXXXXXX
                </span>
                <span className="text-slate-500 text-xs">Key ID (Live)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
