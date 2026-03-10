import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActor } from "@/hooks/useActor";
import { FileText, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type AppStatus = "pending" | "approved" | "rejected";

interface JobApplication {
  id: bigint;
  jobId: bigint;
  jobTitle: string;
  fullName: string;
  phone: string;
  city: string;
  skills: string;
  experience: string;
  availableDates: string;
  status: { pending: null } | { approved: null } | { rejected: null };
  createdAt: bigint;
}

function getStatusKey(status: JobApplication["status"]): AppStatus {
  if ("approved" in status) return "approved";
  if ("rejected" in status) return "rejected";
  return "pending";
}

const STATUS_COLORS: Record<AppStatus, string> = {
  pending: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
  approved: "bg-green-500/15 text-green-400 border border-green-500/20",
  rejected: "bg-red-500/15 text-red-400 border border-red-500/20",
};

export default function AdminJobApplicationsPage() {
  const { actor } = useActor();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | AppStatus>("all");
  const [updatingId, setUpdatingId] = useState<bigint | null>(null);

  const loadApplications = useCallback(async () => {
    if (!actor) return;
    try {
      setLoading(true);
      const result = await (actor as any).getAllJobApplications();
      setApplications(result as JobApplication[]);
    } catch {
      toast.error("Failed to load job applications.");
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const handleStatusChange = async (
    app: JobApplication,
    newStatus: AppStatus,
  ) => {
    if (!actor) return;
    setUpdatingId(app.id);
    try {
      const statusVariant =
        newStatus === "approved"
          ? { approved: null }
          : newStatus === "rejected"
            ? { rejected: null }
            : { pending: null };
      await (actor as any).updateJobApplicationStatus(app.id, statusVariant);
      toast.success("Status updated.");
      await loadApplications();
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered =
    filter === "all"
      ? applications
      : applications.filter((a) => getStatusKey(a.status) === filter);

  const formatDate = (ts: bigint) =>
    new Date(Number(ts)).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="text-gold" size={24} />
        <div>
          <h1 className="text-white font-display font-bold text-2xl">
            Job Applications
          </h1>
          <p className="text-slate-400 text-sm">
            Review and manage staff applications
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList className="bg-slate-800 border border-white/10">
          {(["all", "pending", "approved", "rejected"] as const).map((t) => (
            <TabsTrigger
              key={t}
              value={t}
              className="capitalize data-[state=active]:bg-gold data-[state=active]:text-slate-950"
              data-ocid="job_applications.filter.tab"
            >
              {t}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {loading ? (
        <div
          className="flex justify-center py-16"
          data-ocid="job_applications.loading_state"
        >
          <Loader2 className="animate-spin text-gold" size={28} />
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="text-center py-20 text-slate-400"
          data-ocid="job_applications.empty_state"
        >
          <FileText size={40} className="mx-auto mb-3 opacity-30" />
          <p>No applications found.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-white/10 overflow-hidden">
          <Table data-ocid="job_applications.table">
            <TableHeader>
              <TableRow className="border-white/10 bg-slate-800/50">
                <TableHead className="text-slate-300">Applicant</TableHead>
                <TableHead className="text-slate-300">Phone</TableHead>
                <TableHead className="text-slate-300">Job Title</TableHead>
                <TableHead className="text-slate-300">City</TableHead>
                <TableHead className="text-slate-300">Skills</TableHead>
                <TableHead className="text-slate-300">Experience</TableHead>
                <TableHead className="text-slate-300">
                  Available Dates
                </TableHead>
                <TableHead className="text-slate-300">Applied</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((app, i) => {
                const statusKey = getStatusKey(app.status);
                return (
                  <TableRow
                    key={String(app.id)}
                    className="border-white/10 hover:bg-white/5"
                    data-ocid={`job_applications.item.${i + 1}`}
                  >
                    <TableCell className="text-white font-medium">
                      {app.fullName}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {app.phone}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {app.jobTitle}
                    </TableCell>
                    <TableCell className="text-slate-300">{app.city}</TableCell>
                    <TableCell
                      className="text-slate-300 max-w-[120px] truncate"
                      title={app.skills}
                    >
                      {app.skills}
                    </TableCell>
                    <TableCell
                      className="text-slate-300 max-w-[120px] truncate"
                      title={app.experience}
                    >
                      {app.experience}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {app.availableDates}
                    </TableCell>
                    <TableCell className="text-slate-300 whitespace-nowrap">
                      {formatDate(app.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${STATUS_COLORS[statusKey]}`}
                        >
                          {statusKey}
                        </span>
                        <Select
                          value={statusKey}
                          onValueChange={(v) =>
                            handleStatusChange(app, v as AppStatus)
                          }
                          disabled={updatingId === app.id}
                        >
                          <SelectTrigger
                            className="h-7 w-7 p-0 bg-transparent border-white/20 text-slate-400"
                            data-ocid={`job_applications.status.select.${i + 1}`}
                          >
                            {updatingId === app.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <SelectValue />
                            )}
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-white/10">
                            <SelectItem
                              value="pending"
                              className="text-yellow-400"
                            >
                              Pending
                            </SelectItem>
                            <SelectItem
                              value="approved"
                              className="text-green-400"
                            >
                              Approved
                            </SelectItem>
                            <SelectItem
                              value="rejected"
                              className="text-red-400"
                            >
                              Rejected
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
