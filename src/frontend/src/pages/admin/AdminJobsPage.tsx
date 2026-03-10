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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { Briefcase, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const JOB_CATEGORIES = [
  "Security",
  "Bouncer",
  "Bartender",
  "Technician",
  "Driver",
  "Volunteer",
  "Hotel Staff",
];

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

const emptyForm = {
  title: "",
  category: "Security",
  city: "",
  eventCompanyName: "",
  workDate: "",
  dailyWage: "",
  requiredStaffCount: "",
  description: "",
  isActive: true,
};

export default function AdminJobsPage() {
  const { actor } = useActor();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobListing | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<bigint | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadJobs = useCallback(async () => {
    if (!actor) return;
    try {
      setLoading(true);
      const result = await (actor as any).getAllJobListings();
      setJobs(result);
    } catch {
      setError("Failed to load job listings.");
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const openAdd = () => {
    setEditingJob(null);
    setForm({ ...emptyForm });
    setModalOpen(true);
  };

  const openEdit = (job: JobListing) => {
    setEditingJob(job);
    const d = new Date(Number(job.workDate));
    const dateStr = d.toISOString().split("T")[0];
    setForm({
      title: job.title,
      category: job.category,
      city: job.city,
      eventCompanyName: job.eventCompanyName,
      workDate: dateStr,
      dailyWage: String(job.dailyWage),
      requiredStaffCount: String(job.requiredStaffCount),
      description: job.description,
      isActive: job.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.title ||
      !form.city ||
      !form.eventCompanyName ||
      !form.workDate ||
      !form.dailyWage ||
      !form.requiredStaffCount
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!actor) return;
    setSubmitting(true);
    try {
      const workDateTs = BigInt(new Date(form.workDate).getTime());
      const wage = BigInt(Number(form.dailyWage));
      const count = BigInt(Number(form.requiredStaffCount));
      if (editingJob) {
        await (actor as any).updateJobListing(
          editingJob.id,
          form.title,
          form.category,
          form.city,
          form.eventCompanyName,
          workDateTs,
          wage,
          count,
          form.description,
          form.isActive,
        );
        toast.success("Job listing updated.");
      } else {
        await (actor as any).createJobListing(
          form.title,
          form.category,
          form.city,
          form.eventCompanyName,
          workDateTs,
          wage,
          count,
          form.description,
        );
        toast.success("Job listing created.");
      }
      setModalOpen(false);
      await loadJobs();
    } catch {
      toast.error("Failed to save job listing.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId || !actor) return;
    setDeleting(true);
    try {
      await (actor as any).deleteJobListing(deleteConfirmId);
      toast.success("Job listing deleted.");
      setDeleteConfirmId(null);
      await loadJobs();
    } catch {
      toast.error("Failed to delete job listing.");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (ts: bigint) => {
    return new Date(Number(ts)).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Briefcase className="text-gold" size={24} />
          <div>
            <h1 className="text-white font-display font-bold text-2xl">
              Job Listings
            </h1>
            <p className="text-slate-400 text-sm">Manage staff job postings</p>
          </div>
        </div>
        <Button
          onClick={openAdd}
          className="bg-gold text-slate-950 hover:bg-gold/90 font-semibold"
          data-ocid="jobs.add_button"
        >
          <Plus size={16} className="mr-2" />
          Add Job
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div
          className="flex justify-center py-16"
          data-ocid="jobs.loading_state"
        >
          <Loader2 className="animate-spin text-gold" size={28} />
        </div>
      ) : error ? (
        <div className="text-red-400 text-center py-10">{error}</div>
      ) : jobs.length === 0 ? (
        <div
          className="text-center py-20 text-slate-400"
          data-ocid="jobs.empty_state"
        >
          <Briefcase size={40} className="mx-auto mb-3 opacity-30" />
          <p>No job listings yet. Add your first job posting.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-white/10 overflow-hidden">
          <Table data-ocid="jobs.table">
            <TableHeader>
              <TableRow className="border-white/10 bg-slate-800/50">
                <TableHead className="text-slate-300">Title</TableHead>
                <TableHead className="text-slate-300">Category</TableHead>
                <TableHead className="text-slate-300">City</TableHead>
                <TableHead className="text-slate-300">
                  Event / Company
                </TableHead>
                <TableHead className="text-slate-300">Work Date</TableHead>
                <TableHead className="text-slate-300">Wage (₹)</TableHead>
                <TableHead className="text-slate-300">Staff Needed</TableHead>
                <TableHead className="text-slate-300">Active</TableHead>
                <TableHead className="text-slate-300 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job, i) => (
                <TableRow
                  key={String(job.id)}
                  className="border-white/10 hover:bg-white/5"
                  data-ocid={`jobs.item.${i + 1}`}
                >
                  <TableCell className="text-white font-medium">
                    {job.title}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-0.5 rounded text-xs bg-gold/10 text-gold border border-gold/20">
                      {job.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-300">{job.city}</TableCell>
                  <TableCell className="text-slate-300">
                    {job.eventCompanyName}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {formatDate(job.workDate)}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    ₹{String(job.dailyWage)}/day
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {String(job.requiredStaffCount)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        job.isActive
                          ? "bg-green-500/15 text-green-400"
                          : "bg-slate-500/15 text-slate-400"
                      }`}
                    >
                      {job.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEdit(job)}
                        className="text-slate-400 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
                        data-ocid={`jobs.edit_button.${i + 1}`}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteConfirmId(job.id)}
                        className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 p-0"
                        data-ocid={`jobs.delete_button.${i + 1}`}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          data-ocid="jobs.modal"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
            aria-label="Close"
          />
          <div className="relative bg-slate-900 border border-white/10 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <h2 className="text-white font-display font-bold text-xl mb-5">
                {editingJob ? "Edit Job Listing" : "Add Job Listing"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-slate-300 text-sm">Job Title *</Label>
                  <Input
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="e.g. Security Guard"
                    className="mt-1 bg-slate-800 border-white/10 text-white"
                    data-ocid="jobs.title_input"
                  />
                </div>

                <div>
                  <Label className="text-slate-300 text-sm">Category *</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => setForm({ ...form, category: v })}
                  >
                    <SelectTrigger
                      className="mt-1 bg-slate-800 border-white/10 text-white"
                      data-ocid="jobs.category_select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/10">
                      {JOB_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c} className="text-white">
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300 text-sm">City *</Label>
                    <Input
                      value={form.city}
                      onChange={(e) =>
                        setForm({ ...form, city: e.target.value })
                      }
                      placeholder="e.g. Mumbai"
                      className="mt-1 bg-slate-800 border-white/10 text-white"
                      data-ocid="jobs.city_input"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300 text-sm">
                      Event / Company *
                    </Label>
                    <Input
                      value={form.eventCompanyName}
                      onChange={(e) =>
                        setForm({ ...form, eventCompanyName: e.target.value })
                      }
                      placeholder="e.g. Sunburn Festival"
                      className="mt-1 bg-slate-800 border-white/10 text-white"
                      data-ocid="jobs.company_input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-slate-300 text-sm">
                      Work Date *
                    </Label>
                    <Input
                      type="date"
                      value={form.workDate}
                      onChange={(e) =>
                        setForm({ ...form, workDate: e.target.value })
                      }
                      className="mt-1 bg-slate-800 border-white/10 text-white"
                      data-ocid="jobs.work_date_input"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300 text-sm">
                      Daily Wage (₹) *
                    </Label>
                    <Input
                      type="number"
                      value={form.dailyWage}
                      onChange={(e) =>
                        setForm({ ...form, dailyWage: e.target.value })
                      }
                      placeholder="800"
                      className="mt-1 bg-slate-800 border-white/10 text-white"
                      data-ocid="jobs.wage_input"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300 text-sm">
                      Staff Count *
                    </Label>
                    <Input
                      type="number"
                      value={form.requiredStaffCount}
                      onChange={(e) =>
                        setForm({ ...form, requiredStaffCount: e.target.value })
                      }
                      placeholder="10"
                      className="mt-1 bg-slate-800 border-white/10 text-white"
                      data-ocid="jobs.staff_count_input"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-slate-300 text-sm">
                    Job Description
                  </Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Describe the role and requirements..."
                    className="mt-1 bg-slate-800 border-white/10 text-white resize-none"
                    rows={3}
                    data-ocid="jobs.description_textarea"
                  />
                </div>

                {editingJob && (
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={form.isActive}
                      onCheckedChange={(v) => setForm({ ...form, isActive: v })}
                      data-ocid="jobs.active_switch"
                    />
                    <Label className="text-slate-300 text-sm">
                      Active listing
                    </Label>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 border-white/10 text-slate-300 hover:bg-white/5"
                    data-ocid="jobs.cancel_button"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gold text-slate-950 hover:bg-gold/90 font-semibold"
                    data-ocid="jobs.submit_button"
                  >
                    {submitting && (
                      <Loader2 size={14} className="mr-2 animate-spin" />
                    )}
                    {editingJob ? "Update Job" : "Create Job"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setDeleteConfirmId(null)}
            aria-label="Close"
          />
          <div className="relative bg-slate-900 border border-white/10 rounded-xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="text-white font-bold text-lg mb-2">
              Delete Job Listing?
            </h3>
            <p className="text-slate-400 text-sm mb-5">
              This action cannot be undone. The job listing will be permanently
              removed.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 border-white/10 text-slate-300 hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold"
                data-ocid="jobs.confirm_button"
              >
                {deleting && (
                  <Loader2 size={14} className="mr-2 animate-spin" />
                )}
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
