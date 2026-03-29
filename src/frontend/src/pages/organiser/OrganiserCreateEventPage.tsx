import { Badge } from "@/components/ui/badge";
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
import { useActor } from "@/hooks/useActor";
import { useOrganiserAuth } from "@/hooks/useOrganiserAuth";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Plus,
  Trash2,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const CATEGORIES = [
  "Music",
  "Comedy",
  "Sports",
  "Festival",
  "Nightlife",
  "Workshop",
  "Kids",
  "Gaming",
  "Meetup",
  "Theatre",
];

const STEPS = [
  "Basic Info",
  "Event Details",
  "Description",
  "Tickets",
  "Review & Publish",
];

interface TicketCategory {
  uid: string;
  name: string;
  price: string;
  quantity: string;
}

interface FormData {
  name: string;
  category: string;
  subCategory: string;
  city: string;
  venue: string;
  date: string;
  time: string;
  duration: string;
  ageLimit: string;
  state: string;
  country: string;
  description: string;
  posterUrl: string;
  bannerUrl: string;
  tickets: TicketCategory[];
}

const DEFAULT_FORM: FormData = {
  name: "",
  category: "",
  subCategory: "",
  city: "",
  venue: "",
  date: "",
  time: "",
  duration: "",
  ageLimit: "18",
  state: "",
  country: "India",
  description: "",
  posterUrl: "",
  bannerUrl: "",
  tickets: [{ uid: "t0", name: "", price: "", quantity: "" }],
};

export default function OrganiserCreateEventPage() {
  const { session, isAuthenticated } = useOrganiserAuth();
  const { actor } = useActor();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) window.location.href = "/organiser/login";
  }, [isAuthenticated]);

  if (!isAuthenticated || !session) return null;

  const update = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const updateTicket = (
    index: number,
    field: keyof TicketCategory,
    value: string,
  ) =>
    setForm((prev) => ({
      ...prev,
      tickets: prev.tickets.map((t, i) =>
        i === index ? { ...t, [field]: value } : t,
      ),
    }));

  const addTicket = () => {
    if (form.tickets.length >= 20) return;
    setForm((prev) => ({
      ...prev,
      tickets: [
        ...prev.tickets,
        { uid: `t${Date.now()}`, name: "", price: "", quantity: "" },
      ],
    }));
  };

  const removeTicket = (index: number) =>
    setForm((prev) => ({
      ...prev,
      tickets: prev.tickets.filter((_, i) => i !== index),
    }));

  const canProceed = () => {
    if (step === 0)
      return (
        form.name.trim() &&
        form.category &&
        form.city.trim() &&
        form.venue.trim()
      );
    if (step === 1) return form.date && form.time;
    if (step === 2) return form.description.trim();
    if (step === 3)
      return form.tickets.every((t) => t.name.trim() && t.price && t.quantity);
    return true;
  };

  const handleSave = async (publish: boolean) => {
    if (!actor || !session) return;
    setIsSaving(true);
    try {
      const dateMs = new Date(`${form.date}T${form.time || "00:00"}`).getTime();
      const dateNs = BigInt(dateMs) * 1_000_000n;
      const eventId = await actor.createEventAsOrganiser(
        BigInt(session.organiserId),
        form.name.trim(),
        form.category,
        form.subCategory.trim(),
        form.venue.trim(),
        form.city.trim(),
        form.state.trim(),
        form.country.trim() || "India",
        dateNs,
        form.time,
        form.duration.trim(),
        BigInt(Number(form.ageLimit) || 18),
        form.description.trim(),
        form.posterUrl.trim(),
        form.bannerUrl.trim(),
      );

      const validTickets = form.tickets.filter(
        (t) => t.name.trim() && t.price && t.quantity,
      );
      await Promise.all(
        validTickets.map((t) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (actor as any).addTicketCategory(
            eventId,
            t.name.trim(),
            BigInt(Number(t.price)),
            BigInt(Number(t.quantity)),
          ),
        ),
      );

      if (publish) {
        await actor.publishEventAsOrganiser(
          BigInt(session.organiserId),
          eventId,
        );
        toast.success("Event published successfully!");
      } else {
        toast.success("Event saved as draft!");
      }
      window.location.href = "/organiser";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save event.");
    } finally {
      setIsSaving(false);
    }
  };

  const goBack = () => {
    window.location.href = "/organiser";
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header
        className="border-b border-white/10 px-6 py-4 flex items-center gap-4"
        style={{ background: "rgba(10,10,10,0.95)" }}
      >
        <button
          type="button"
          onClick={goBack}
          className="text-slate-400 hover:text-white transition-colors"
          data-ocid="organiser.create.back_button"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-red-500" />
          <span className="text-white font-bold">Create New Event</span>
        </div>
      </header>

      {/* Progress bar */}
      <div
        className="border-b border-white/5 px-6 py-4"
        style={{ background: "rgba(10,10,10,0.8)" }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {STEPS.map((label, i) => (
              <div
                key={label}
                className="flex items-center gap-2 flex-shrink-0"
              >
                <button
                  type="button"
                  onClick={() => i < step && setStep(i)}
                  className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                    i === step
                      ? "bg-red-600 text-white"
                      : i < step
                        ? "bg-green-600/20 text-green-400 cursor-pointer"
                        : "bg-white/5 text-slate-500 cursor-default"
                  }`}
                  data-ocid={`organiser.create.step.${i + 1}`}
                >
                  {i < step ? <Check size={10} /> : <span>{i + 1}</span>}
                  <span className="hidden sm:inline">{label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className={`w-6 h-px ${
                      i < step ? "bg-green-600/40" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Step 1: Basic Info */}
        {step === 0 && (
          <div className="space-y-5" data-ocid="organiser.create.panel">
            <h2 className="text-lg font-bold text-white mb-4">Basic Info</h2>
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Event Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Sunburn Festival 2025"
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-red-500/50"
                data-ocid="organiser.create.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Category *</Label>
              <Select
                value={form.category}
                onValueChange={(v) => update("category", v)}
              >
                <SelectTrigger
                  className="bg-white/5 border-white/10 text-white"
                  data-ocid="organiser.create.select"
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Sub Category</Label>
              <Input
                value={form.subCategory}
                onChange={(e) => update("subCategory", e.target.value)}
                placeholder="e.g. DJ Concert"
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-red-500/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm">City *</Label>
                <Input
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-red-500/50"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm">Venue Name *</Label>
                <Input
                  value={form.venue}
                  onChange={(e) => update("venue", e.target.value)}
                  placeholder="e.g. MMRDA Grounds"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-red-500/50"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Event Details */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-white mb-4">Event Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm">Event Date *</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                  className="bg-white/5 border-white/10 text-white focus:border-red-500/50"
                  data-ocid="organiser.create.date_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm">Start Time *</Label>
                <Input
                  type="time"
                  value={form.time}
                  onChange={(e) => update("time", e.target.value)}
                  className="bg-white/5 border-white/10 text-white focus:border-red-500/50"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm">Duration</Label>
                <Input
                  value={form.duration}
                  onChange={(e) => update("duration", e.target.value)}
                  placeholder="e.g. 3 hours"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-red-500/50"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm">Age Limit</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.ageLimit}
                  onChange={(e) => update("ageLimit", e.target.value)}
                  className="bg-white/5 border-white/10 text-white focus:border-red-500/50"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm">State</Label>
                <Input
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                  placeholder="e.g. Maharashtra"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-red-500/50"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm">Country</Label>
                <Input
                  value={form.country}
                  onChange={(e) => update("country", e.target.value)}
                  className="bg-white/5 border-white/10 text-white focus:border-red-500/50"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Description */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-white mb-4">Description</h2>
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">About Event *</Label>
              <Textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Describe your event in detail..."
                rows={6}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-red-500/50 resize-none"
                data-ocid="organiser.create.textarea"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Poster Image URL</Label>
              <Input
                value={form.posterUrl}
                onChange={(e) => update("posterUrl", e.target.value)}
                placeholder="https://..."
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-red-500/50"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Banner Image URL</Label>
              <Input
                value={form.bannerUrl}
                onChange={(e) => update("bannerUrl", e.target.value)}
                placeholder="https://..."
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-red-500/50"
              />
            </div>
          </div>
        )}

        {/* Step 4: Tickets */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                Ticket Categories
              </h2>
              <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-xs">
                {form.tickets.length}/20
              </Badge>
            </div>
            <div className="space-y-3">
              {form.tickets.map((ticket, index) => (
                <div
                  key={ticket.uid}
                  className="border border-white/10 rounded-xl p-4"
                  style={{ background: "rgba(15,15,15,0.8)" }}
                  data-ocid={`organiser.tickets.item.${index + 1}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-400 text-sm font-semibold">
                      Ticket {index + 1}
                    </span>
                    {form.tickets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTicket(index)}
                        className="text-slate-600 hover:text-red-400 transition-colors"
                        data-ocid={`organiser.tickets.delete_button.${index + 1}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-slate-400 text-xs">Name</Label>
                      <Input
                        value={ticket.name}
                        onChange={(e) =>
                          updateTicket(index, "name", e.target.value)
                        }
                        placeholder="e.g. VIP Pass"
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-red-500/50 h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-slate-400 text-xs">
                        Price (&#8377;)
                      </Label>
                      <Input
                        type="number"
                        min={0}
                        value={ticket.price}
                        onChange={(e) =>
                          updateTicket(index, "price", e.target.value)
                        }
                        placeholder="999"
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-red-500/50 h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-slate-400 text-xs">Quantity</Label>
                      <Input
                        type="number"
                        min={1}
                        max={99999}
                        value={ticket.quantity}
                        onChange={(e) =>
                          updateTicket(index, "quantity", e.target.value)
                        }
                        placeholder="100"
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-red-500/50 h-9 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {form.tickets.length < 20 && (
              <Button
                type="button"
                variant="outline"
                onClick={addTicket}
                className="w-full border-dashed border-white/20 text-slate-400 hover:text-white hover:border-red-500/40 hover:bg-red-500/5"
                data-ocid="organiser.tickets.add_button"
              >
                <Plus size={16} className="mr-2" /> Add Ticket Category
              </Button>
            )}
          </div>
        )}

        {/* Step 5: Review */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white mb-4">
              Review &amp; Publish
            </h2>
            <div
              className="border border-white/10 rounded-xl p-5 space-y-4"
              style={{ background: "rgba(15,15,15,0.8)" }}
            >
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-500">Event Name</span>
                  <p className="text-white mt-0.5 font-semibold">
                    {form.name || "—"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Category</span>
                  <p className="text-white mt-0.5">{form.category || "—"}</p>
                </div>
                <div>
                  <span className="text-slate-500">Venue</span>
                  <p className="text-white mt-0.5">{form.venue || "—"}</p>
                </div>
                <div>
                  <span className="text-slate-500">City</span>
                  <p className="text-white mt-0.5">{form.city || "—"}</p>
                </div>
                <div>
                  <span className="text-slate-500">Date</span>
                  <p className="text-white mt-0.5">{form.date || "—"}</p>
                </div>
                <div>
                  <span className="text-slate-500">Time</span>
                  <p className="text-white mt-0.5">{form.time || "—"}</p>
                </div>
                <div>
                  <span className="text-slate-500">Age Limit</span>
                  <p className="text-white mt-0.5">{form.ageLimit}+</p>
                </div>
                <div>
                  <span className="text-slate-500">Country</span>
                  <p className="text-white mt-0.5">{form.country || "—"}</p>
                </div>
              </div>
              <div className="border-t border-white/10 pt-3">
                <span className="text-slate-500 text-sm">
                  Ticket Categories
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.tickets
                    .filter((t) => t.name)
                    .map((t) => (
                      <Badge
                        key={t.uid}
                        className="bg-red-500/10 text-red-400 border-red-500/20 text-xs"
                      >
                        {t.name} — &#8377;{t.price} &times; {t.quantity}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => handleSave(false)}
                disabled={isSaving}
                variant="outline"
                className="flex-1 border-white/10 text-slate-300 hover:text-white hover:bg-white/5 font-semibold"
                data-ocid="organiser.create.secondary_button"
              >
                {isSaving ? (
                  <Loader2 size={16} className="animate-spin mr-2" />
                ) : null}
                Save as Draft
              </Button>
              <Button
                onClick={() => handleSave(true)}
                disabled={isSaving}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold"
                data-ocid="organiser.create.primary_button"
              >
                {isSaving ? (
                  <Loader2 size={16} className="animate-spin mr-2" />
                ) : null}
                Publish Event
              </Button>
            </div>
          </div>
        )}

        {/* Navigation */}
        {step < 4 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
              data-ocid="organiser.create.prev_button"
            >
              <ArrowLeft size={16} className="mr-1.5" /> Back
            </Button>
            <span className="text-slate-500 text-sm">
              {step + 1} of {STEPS.length}
            </span>
            <Button
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              disabled={!canProceed()}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-40"
              data-ocid="organiser.create.next_button"
            >
              Next <ArrowRight size={16} className="ml-1.5" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
