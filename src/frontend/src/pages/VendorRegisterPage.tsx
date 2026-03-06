import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitVendorApplication } from "@/hooks/useVendorQueries";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2, Store } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SERVICE_CATEGORIES = [
  "Photographer",
  "Makeup Artist",
  "Decorator",
  "Caterer",
  "DJ",
  "Band",
  "Wedding Planner",
  "Sound & Lighting",
  "Transport",
  "Other",
];

export default function VendorRegisterPage() {
  const submitApp = useSubmitVendorApplication();
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    city: "",
    serviceCategory: "",
    description: "",
    phone: "",
    email: "",
    portfolioImages: ["", "", "", "", ""],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (index: number, value: string) => {
    setForm((prev) => {
      const images = [...prev.portfolioImages];
      images[index] = value;
      return { ...prev, portfolioImages: images };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const images = form.portfolioImages.filter((img) => img.trim() !== "");
    try {
      await submitApp.mutateAsync({
        businessName: form.businessName,
        ownerName: form.ownerName,
        city: form.city,
        serviceCategory: form.serviceCategory,
        description: form.description,
        phone: form.phone,
        email: form.email,
        portfolioImages: images,
      });
      setSubmitted(true);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to submit application";
      toast.error(msg);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div
          className="max-w-md w-full text-center bg-card border border-white/10 rounded-2xl p-10 shadow-2xl"
          data-ocid="vendor.register.success_state"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 mb-5">
            <CheckCircle2 className="text-green-400" size={32} />
          </div>
          <h2 className="text-white font-display font-bold text-2xl mb-3">
            Application Submitted!
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed mb-6">
            Your application has been submitted! We'll review it and get back to
            you within 2–3 business days.
          </p>
          <Link to="/">
            <Button
              className="gradient-gold text-[oklch(0.1_0.01_260)] font-bold px-8"
              data-ocid="vendor.register.home.link"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="relative py-14 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.14_0.025_260)] via-[oklch(0.12_0.018_260)] to-[oklch(0.1_0.015_260)]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, oklch(0.78 0.17 75 / 8%) 0%, transparent 50%), radial-gradient(circle at 80% 20%, oklch(0.6 0.15 200 / 6%) 0%, transparent 40%)",
          }}
        />
        <div className="relative container mx-auto px-4 text-center">
          <p className="text-gold text-sm font-medium uppercase tracking-widest mb-2">
            Vendor Marketplace
          </p>
          <h1 className="font-display font-black text-3xl md:text-5xl text-foreground">
            <span className="text-gradient-gold">Vendor Registration</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mt-3 leading-relaxed">
            Join the DMT CREATOLOGY marketplace and grow your business
          </p>
          <div className="mt-5 flex justify-center">
            <div className="h-0.5 w-20 gradient-gold rounded-full" />
          </div>
        </div>
      </div>

      {/* Form Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-card border border-white/10 rounded-2xl p-6 md:p-10 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                <Store className="text-gold" size={20} />
              </div>
              <div>
                <h2 className="text-white font-display font-bold text-xl">
                  Business Profile
                </h2>
                <p className="text-muted-foreground text-sm">
                  Fill in your details — our team will review within 2–3 days
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              data-ocid="vendor.register.panel"
            >
              {/* Business Name */}
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm font-medium">
                  Business Name *
                </Label>
                <Input
                  name="businessName"
                  value={form.businessName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Raj Photography Studio"
                  className="bg-slate-900 border-white/15 text-white placeholder:text-slate-500 focus:border-gold/50 focus:ring-gold/20"
                  data-ocid="vendor.register.input"
                />
              </div>

              {/* Owner Name */}
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm font-medium">
                  Owner Name *
                </Label>
                <Input
                  name="ownerName"
                  value={form.ownerName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Rajesh Kumar"
                  className="bg-slate-900 border-white/15 text-white placeholder:text-slate-500 focus:border-gold/50 focus:ring-gold/20"
                  data-ocid="vendor.register.input"
                />
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm font-medium">
                  City *
                </Label>
                <Input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Mumbai"
                  className="bg-slate-900 border-white/15 text-white placeholder:text-slate-500 focus:border-gold/50 focus:ring-gold/20"
                  data-ocid="vendor.register.input"
                />
              </div>

              {/* Service Category */}
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm font-medium">
                  Service Category *
                </Label>
                <Select
                  value={form.serviceCategory}
                  onValueChange={(val) =>
                    setForm((prev) => ({ ...prev, serviceCategory: val }))
                  }
                  required
                >
                  <SelectTrigger
                    className="bg-slate-900 border-white/15 text-white focus:border-gold/50"
                    data-ocid="vendor.register.select"
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/15">
                    {SERVICE_CATEGORIES.map((cat) => (
                      <SelectItem
                        key={cat}
                        value={cat}
                        className="text-white hover:bg-white/10 focus:bg-white/10"
                      >
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm font-medium">
                  Description *
                </Label>
                <Textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Describe your business, services, experience, and what makes you stand out..."
                  className="bg-slate-900 border-white/15 text-white placeholder:text-slate-500 focus:border-gold/50 focus:ring-gold/20 resize-none"
                  data-ocid="vendor.register.textarea"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm font-medium">
                  Phone Number *
                </Label>
                <Input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  type="tel"
                  placeholder="+91 98XXX XXXXX"
                  className="bg-slate-900 border-white/15 text-white placeholder:text-slate-500 focus:border-gold/50 focus:ring-gold/20"
                  data-ocid="vendor.register.input"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm font-medium">
                  Email Address *
                </Label>
                <Input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  type="email"
                  placeholder="your@business.com"
                  className="bg-slate-900 border-white/15 text-white placeholder:text-slate-500 focus:border-gold/50 focus:ring-gold/20"
                  data-ocid="vendor.register.input"
                />
              </div>

              {/* Portfolio Images */}
              <div className="space-y-3">
                <Label className="text-slate-300 text-sm font-medium">
                  Portfolio Images (Optional — up to 5 image URLs)
                </Label>
                <div className="space-y-2.5">
                  {(["img1", "img2", "img3", "img4", "img5"] as const).map(
                    (slot, idx) => (
                      <Input
                        key={slot}
                        value={form.portfolioImages[idx]}
                        onChange={(e) => handleImageChange(idx, e.target.value)}
                        placeholder={`Portfolio Image ${idx + 1} URL`}
                        className="bg-slate-900 border-white/15 text-white placeholder:text-slate-500 focus:border-gold/50 focus:ring-gold/20"
                        data-ocid={"vendor.register.input"}
                      />
                    ),
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={
                    submitApp.isPending ||
                    !form.businessName ||
                    !form.ownerName ||
                    !form.city ||
                    !form.serviceCategory ||
                    !form.description ||
                    !form.phone ||
                    !form.email
                  }
                  className="w-full gradient-gold text-[oklch(0.1_0.01_260)] font-bold py-6 text-base rounded-xl transition-all"
                  data-ocid="vendor.register.submit_button"
                >
                  {submitApp.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    "Submit Vendor Application"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
