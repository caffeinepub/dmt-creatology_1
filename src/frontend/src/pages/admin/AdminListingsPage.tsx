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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAllListings,
  useUpdateListingStatus,
} from "@/hooks/useAdminQueries";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
// ListingStatus enum and Listing type - defined locally since they were removed from the reduced backend.d.ts
const ListingStatus = {
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
} as const;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ListingStatus = (typeof ListingStatus)[keyof typeof ListingStatus];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Listing = any;

function listingStatusBadge(status: ListingStatus) {
  switch (status) {
    case ListingStatus.pending:
      return (
        <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30">
          Pending
        </Badge>
      );
    case ListingStatus.approved:
      return (
        <Badge className="bg-green-500/15 text-green-300 border-green-500/30">
          Approved
        </Badge>
      );
    case ListingStatus.rejected:
      return (
        <Badge className="bg-red-500/15 text-red-300 border-red-500/30">
          Rejected
        </Badge>
      );
  }
}

type FilterTab = "all" | ListingStatus;

const FILTER_TABS: { value: FilterTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: ListingStatus.pending, label: "Pending" },
  { value: ListingStatus.approved, label: "Approved" },
  { value: ListingStatus.rejected, label: "Rejected" },
];

function filterListings(listings: Listing[], tab: FilterTab): Listing[] {
  if (tab === "all") return listings;
  return listings.filter((l) => l.status === tab);
}

export default function AdminListingsPage() {
  const { data: listings, isLoading } = useAllListings();
  const updateStatus = useUpdateListingStatus();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const handleStatus = async (id: bigint, status: ListingStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success(
        `Listing ${status === ListingStatus.approved ? "approved" : "rejected"}`,
      );
    } catch {
      toast.error("Failed to update listing");
    }
  };

  const filtered = filterListings(listings ?? [], activeTab);

  return (
    <div className="p-4 md:p-6 space-y-6" data-ocid="admin.listings.page">
      <div>
        <h1 className="text-white font-display font-bold text-2xl tracking-tight">
          Listings
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Approve or reject vendor listing submissions
        </p>
      </div>

      {/* Filter Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as FilterTab)}
      >
        <TabsList
          className="bg-slate-900 border border-white/10"
          data-ocid="admin.listings.filter.tab"
        >
          {FILTER_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-slate-400 data-[state=active]:bg-white/10 data-[state=active]:text-white text-xs"
              data-ocid={`admin.listings.filter.${tab.value}.tab`}
            >
              {tab.label}
              {listings && tab.value !== "all" && (
                <span className="ml-1.5 text-[10px] text-slate-500">
                  ({listings.filter((l) => l.status === tab.value).length})
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
        {isLoading ? (
          <div
            className="p-4 space-y-3"
            data-ocid="admin.listings.loading_state"
          >
            {["s1", "s2", "s3", "s4", "s5"].map((sk) => (
              <Skeleton key={sk} className="h-10 w-full bg-slate-800" />
            ))}
          </div>
        ) : !filtered.length ? (
          <div
            className="text-center py-16 text-slate-500"
            data-ocid="admin.listings.empty_state"
          >
            <p className="font-display text-base font-semibold text-slate-400 mb-1">
              No listings found
            </p>
            <p className="text-sm">
              {activeTab === "all"
                ? "Listing submissions will appear here."
                : `No ${activeTab} listings.`}
            </p>
          </div>
        ) : (
          <Table data-ocid="admin.listings.table">
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-slate-400 text-xs">Title</TableHead>
                <TableHead className="text-slate-400 text-xs">
                  Category
                </TableHead>
                <TableHead className="text-slate-400 text-xs">City</TableHead>
                <TableHead className="text-slate-400 text-xs">
                  Price (₹)
                </TableHead>
                <TableHead className="text-slate-400 text-xs">
                  Submitted By
                </TableHead>
                <TableHead className="text-slate-400 text-xs">Status</TableHead>
                <TableHead className="text-slate-400 text-xs text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((listing, i) => (
                <TableRow
                  key={String(listing.id)}
                  className="border-white/5 hover:bg-white/3"
                  data-ocid={`admin.listings.row.${i + 1}`}
                >
                  <TableCell className="text-white text-sm font-medium max-w-[160px] truncate">
                    {listing.title}
                  </TableCell>
                  <TableCell className="text-slate-300 text-sm">
                    {listing.category}
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    {listing.city}
                  </TableCell>
                  <TableCell className="text-slate-300 text-sm font-mono">
                    ₹{Number(listing.price).toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm max-w-[120px] truncate">
                    {listing.submittedBy}
                  </TableCell>
                  <TableCell>{listingStatusBadge(listing.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      {listing.status !== ListingStatus.approved && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={updateStatus.isPending}
                          onClick={() =>
                            handleStatus(listing.id, ListingStatus.approved)
                          }
                          className="h-7 text-xs bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 hover:text-green-300"
                          data-ocid={`admin.listings.approve_button.${i + 1}`}
                        >
                          {updateStatus.isPending ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            "Approve"
                          )}
                        </Button>
                      )}
                      {listing.status !== ListingStatus.rejected && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={updateStatus.isPending}
                          onClick={() =>
                            handleStatus(listing.id, ListingStatus.rejected)
                          }
                          className="h-7 text-xs bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                          data-ocid={`admin.listings.reject_button.${i + 1}`}
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
        )}
      </div>
    </div>
  );
}
