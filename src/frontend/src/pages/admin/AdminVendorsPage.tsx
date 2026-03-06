import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAllVendorApplications,
  useReviewVendorApplication,
} from "@/hooks/useVendorQueries";
import type { ApplicationStatus } from "@/hooks/useVendorQueries";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

function applicationStatusBadge(status: ApplicationStatus) {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30">
          Pending
        </Badge>
      );
    case "approved":
      return (
        <Badge className="bg-green-500/15 text-green-300 border-green-500/30">
          Approved
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-red-500/15 text-red-300 border-red-500/30">
          Rejected
        </Badge>
      );
    default:
      return (
        <Badge className="bg-slate-500/15 text-slate-400 border-slate-500/30">
          {status}
        </Badge>
      );
  }
}

export default function AdminVendorsPage() {
  const { data: applications, isLoading } = useAllVendorApplications();
  const reviewVendor = useReviewVendorApplication();

  const handleReview = async (
    id: bigint,
    status: ApplicationStatus,
    label: string,
  ) => {
    try {
      await reviewVendor.mutateAsync({ id, status });
      toast.success(`Vendor application ${label}`);
    } catch {
      toast.error(`Failed to ${label.toLowerCase()} vendor application`);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6" data-ocid="admin.vendors.page">
      <div>
        <h1 className="text-white font-display font-bold text-2xl tracking-tight">
          Vendor Applications
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Review, approve, or reject vendor marketplace applications
        </p>
      </div>

      <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
        {isLoading ? (
          <div
            className="p-4 space-y-3"
            data-ocid="admin.vendors.loading_state"
          >
            {["s1", "s2", "s3", "s4", "s5"].map((sk) => (
              <Skeleton key={sk} className="h-10 w-full bg-slate-800" />
            ))}
          </div>
        ) : !applications?.length ? (
          <div
            className="text-center py-16 text-slate-500"
            data-ocid="admin.vendors.empty_state"
          >
            <p className="font-display text-base font-semibold text-slate-400 mb-1">
              No vendor applications yet
            </p>
            <p className="text-sm">
              Applications submitted via the public signup page will appear
              here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table data-ocid="admin.vendors.table">
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-slate-400 text-xs">
                    Business
                  </TableHead>
                  <TableHead className="text-slate-400 text-xs">
                    Owner
                  </TableHead>
                  <TableHead className="text-slate-400 text-xs">City</TableHead>
                  <TableHead className="text-slate-400 text-xs">
                    Category
                  </TableHead>
                  <TableHead className="text-slate-400 text-xs">
                    Email
                  </TableHead>
                  <TableHead className="text-slate-400 text-xs">
                    Phone
                  </TableHead>
                  <TableHead className="text-slate-400 text-xs">
                    Status
                  </TableHead>
                  <TableHead className="text-slate-400 text-xs text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app, i) => (
                  <TableRow
                    key={String(app.id)}
                    className="border-white/5 hover:bg-white/3"
                    data-ocid={`admin.vendors.row.${i + 1}`}
                  >
                    <TableCell className="text-white text-sm font-medium">
                      {app.businessName}
                    </TableCell>
                    <TableCell className="text-slate-300 text-sm">
                      {app.ownerName}
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {app.city}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-white/8 text-slate-300 border-white/10 text-xs">
                        {app.serviceCategory}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm max-w-[140px] truncate">
                      {app.email}
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {app.phone}
                    </TableCell>
                    <TableCell>
                      {applicationStatusBadge(app.status as ApplicationStatus)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        {app.status !== "approved" && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={reviewVendor.isPending}
                            onClick={() =>
                              handleReview(app.id, "approved", "approved")
                            }
                            className="h-7 text-xs bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 hover:text-green-300"
                            data-ocid={`admin.vendors.approve_button.${i + 1}`}
                          >
                            {reviewVendor.isPending ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              "Approve"
                            )}
                          </Button>
                        )}
                        {app.status === "approved" && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={reviewVendor.isPending}
                            onClick={() =>
                              handleReview(app.id, "rejected", "revoked")
                            }
                            className="h-7 text-xs bg-slate-500/10 border-slate-500/30 text-slate-400 hover:bg-slate-500/20"
                            data-ocid={`admin.vendors.reject_button.${i + 1}`}
                          >
                            Revoke
                          </Button>
                        )}
                        {app.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={reviewVendor.isPending}
                            onClick={() =>
                              handleReview(app.id, "rejected", "rejected")
                            }
                            className="h-7 text-xs bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                            data-ocid={`admin.vendors.reject_button.${i + 1}`}
                          >
                            Reject
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
