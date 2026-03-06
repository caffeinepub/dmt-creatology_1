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
import { useAllVendors, useUpdateVendorStatus } from "@/hooks/useAdminQueries";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { VendorStatus } from "../../backend.d";

function vendorStatusBadge(status: VendorStatus) {
  switch (status) {
    case VendorStatus.pending:
      return (
        <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30">
          Pending
        </Badge>
      );
    case VendorStatus.approved:
      return (
        <Badge className="bg-green-500/15 text-green-300 border-green-500/30">
          Approved
        </Badge>
      );
    case VendorStatus.rejected:
      return (
        <Badge className="bg-red-500/15 text-red-300 border-red-500/30">
          Rejected
        </Badge>
      );
    case VendorStatus.suspended:
      return (
        <Badge className="bg-slate-500/15 text-slate-400 border-slate-500/30">
          Suspended
        </Badge>
      );
  }
}

export default function AdminVendorsPage() {
  const { data: vendors, isLoading } = useAllVendors();
  const updateStatus = useUpdateVendorStatus();

  const handleStatus = async (
    id: bigint,
    status: VendorStatus,
    label: string,
  ) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success(`Vendor ${label}`);
    } catch {
      toast.error(`Failed to ${label.toLowerCase()} vendor`);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6" data-ocid="admin.vendors.page">
      <div>
        <h1 className="text-white font-display font-bold text-2xl tracking-tight">
          Vendors
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Review and manage vendor accounts
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
        ) : !vendors?.length ? (
          <div
            className="text-center py-16 text-slate-500"
            data-ocid="admin.vendors.empty_state"
          >
            <p className="font-display text-base font-semibold text-slate-400 mb-1">
              No vendors registered
            </p>
            <p className="text-sm">Vendor applications will appear here.</p>
          </div>
        ) : (
          <Table data-ocid="admin.vendors.table">
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-slate-400 text-xs">Name</TableHead>
                <TableHead className="text-slate-400 text-xs">
                  Business
                </TableHead>
                <TableHead className="text-slate-400 text-xs">City</TableHead>
                <TableHead className="text-slate-400 text-xs">
                  Services
                </TableHead>
                <TableHead className="text-slate-400 text-xs">Status</TableHead>
                <TableHead className="text-slate-400 text-xs text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor, i) => (
                <TableRow
                  key={String(vendor.id)}
                  className="border-white/5 hover:bg-white/3"
                  data-ocid={`admin.vendors.row.${i + 1}`}
                >
                  <TableCell className="text-white text-sm font-medium">
                    {vendor.name}
                  </TableCell>
                  <TableCell className="text-slate-300 text-sm">
                    {vendor.businessName}
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    {vendor.city}
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm max-w-[180px] truncate">
                    {vendor.services}
                  </TableCell>
                  <TableCell>{vendorStatusBadge(vendor.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      {vendor.status !== VendorStatus.approved && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={updateStatus.isPending}
                          onClick={() =>
                            handleStatus(
                              vendor.id,
                              VendorStatus.approved,
                              "approved",
                            )
                          }
                          className="h-7 text-xs bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 hover:text-green-300"
                          data-ocid={`admin.vendors.approve_button.${i + 1}`}
                        >
                          {updateStatus.isPending ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            "Approve"
                          )}
                        </Button>
                      )}
                      {vendor.status !== VendorStatus.rejected && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={updateStatus.isPending}
                          onClick={() =>
                            handleStatus(
                              vendor.id,
                              VendorStatus.rejected,
                              "rejected",
                            )
                          }
                          className="h-7 text-xs bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                          data-ocid={`admin.vendors.reject_button.${i + 1}`}
                        >
                          Reject
                        </Button>
                      )}
                      {vendor.status !== VendorStatus.suspended && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={updateStatus.isPending}
                          onClick={() =>
                            handleStatus(
                              vendor.id,
                              VendorStatus.suspended,
                              "suspended",
                            )
                          }
                          className="h-7 text-xs bg-slate-500/10 border-slate-500/30 text-slate-400 hover:bg-slate-500/20"
                          data-ocid={`admin.vendors.suspend_button.${i + 1}`}
                        >
                          Suspend
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
