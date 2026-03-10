import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { useState } from "react";

interface JobListing {
  id: bigint;
  title: string;
  category: string;
  city: string;
  eventCompanyName: string;
  workDate: bigint;
  dailyWage: bigint;
  requiredStaffCount: bigint;
  description: string;
  isActive: boolean;
  createdAt: bigint;
}

interface Props {
  open: boolean;
  onClose: () => void;
  job: JobListing | null;
}

const emptyForm = {
  fullName: "",
  phone: "",
  city: "",
  skills: "",
  experience: "",
  availableDates: "",
};

export default function JobApplicationModal({ open, onClose, job }: Props) {
  const { actor } = useActor();
  const [form, setForm] = useState({ ...emptyForm });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!open || !job) return null;

  const handleClose = () => {
    setForm({ ...emptyForm });
    setSuccess(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.city || !actor) return;
    setSubmitting(true);
    try {
      await (actor as any).createJobApplication(
        job.id,
        job.title,
        form.fullName,
        form.phone,
        form.city,
        form.skills,
        form.experience,
        form.availableDates,
      );
      setSuccess(true);
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-ocid="job_apply.modal"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={handleClose}
        aria-label="Close"
      />
      <div className="relative bg-[oklch(0.14_0.015_260)] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-white/10">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-white font-display font-bold text-xl leading-tight">
                Apply for Job
              </h2>
              <p className="text-gold font-semibold mt-0.5">{job.title}</p>
              <p className="text-slate-400 text-sm">
                {job.eventCompanyName} · {job.city}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="px-6 py-5">
          {success ? (
            <div
              className="text-center py-8 space-y-3"
              data-ocid="job_apply.success_state"
            >
              <CheckCircle2 size={48} className="mx-auto text-green-400" />
              <h3 className="text-white font-bold text-lg">
                Application Submitted!
              </h3>
              <p className="text-slate-400 text-sm">
                Your application for{" "}
                <strong className="text-white">{job.title}</strong> has been
                received. The team will review and contact you.
              </p>
              <Button
                onClick={handleClose}
                className="mt-2 gradient-gold text-[oklch(0.1_0.01_260)] font-bold"
              >
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-slate-300 text-sm">Full Name *</Label>
                  <Input
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                    placeholder="Your full name"
                    required
                    className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    data-ocid="job_apply.fullname_input"
                  />
                </div>
                <div>
                  <Label className="text-slate-300 text-sm">
                    Phone Number *
                  </Label>
                  <Input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="+91 XXXXX XXXXX"
                    required
                    className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    data-ocid="job_apply.phone_input"
                  />
                </div>
              </div>

              <div>
                <Label className="text-slate-300 text-sm">City *</Label>
                <Input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Your city"
                  required
                  className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  data-ocid="job_apply.city_input"
                />
              </div>

              <div>
                <Label className="text-slate-300 text-sm">Skills</Label>
                <Textarea
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  placeholder="e.g. Crowd control, First aid"
                  rows={2}
                  className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-slate-500 resize-none"
                  data-ocid="job_apply.skills_textarea"
                />
              </div>

              <div>
                <Label className="text-slate-300 text-sm">Experience</Label>
                <Textarea
                  value={form.experience}
                  onChange={(e) =>
                    setForm({ ...form, experience: e.target.value })
                  }
                  placeholder="Describe your relevant experience"
                  rows={2}
                  className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-slate-500 resize-none"
                  data-ocid="job_apply.experience_textarea"
                />
              </div>

              <div>
                <Label className="text-slate-300 text-sm">
                  Available Dates
                </Label>
                <Input
                  value={form.availableDates}
                  onChange={(e) =>
                    setForm({ ...form, availableDates: e.target.value })
                  }
                  placeholder="e.g. 15 Dec - 20 Dec 2025"
                  className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  data-ocid="job_apply.dates_input"
                />
              </div>

              {submitting && (
                <div
                  className="flex items-center gap-2 text-slate-400 text-sm"
                  data-ocid="job_apply.loading_state"
                >
                  <Loader2 size={14} className="animate-spin" />
                  Submitting your application...
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-white/10 text-slate-300 hover:bg-white/5"
                  data-ocid="job_apply.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 gradient-gold text-[oklch(0.1_0.01_260)] font-bold hover:opacity-90"
                  data-ocid="job_apply.submit_button"
                >
                  {submitting ? (
                    <Loader2 size={14} className="mr-2 animate-spin" />
                  ) : null}
                  Submit Application
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
