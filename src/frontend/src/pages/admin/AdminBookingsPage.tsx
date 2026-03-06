import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  useAllBookings,
  useUpdateBookingStatus,
} from "@/hooks/useAdminQueries";
import { ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BookingStatus } from "../../backend.d";
import type { Booking } from "../../backend.d";

function formatNanoDate(ns: bigint): string {
  return new Date(Number(ns) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function bookingStatusBadge(status: BookingStatus) {
  switch (status) {
    case BookingStatus.new_:
      return (
        <Badge className="bg-blue-500/15 text-blue-300 border-blue-500/30">
          New
        </Badge>
      );
    case BookingStatus.reviewed:
      return (
        <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30">
          Reviewed
        </Badge>
      );
    case BookingStatus.confirmed:
      return (
        <Badge className="bg-green-500/15 text-green-300 border-green-500/30">
          Confirmed
        </Badge>
      );
    case BookingStatus.cancelled:
      return (
        <Badge className="bg-red-500/15 text-red-300 border-red-500/30">
          Cancelled
        </Badge>
      );
  }
}

type FilterTab = "all" | BookingStatus;

const FILTER_TABS: { value: FilterTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: BookingStatus.new_, label: "New" },
  { value: BookingStatus.reviewed, label: "Reviewed" },
  { value: BookingStatus.confirmed, label: "Confirmed" },
  { value: BookingStatus.cancelled, label: "Cancelled" },
];

function filterBookings(bookings: Booking[], tab: FilterTab): Booking[] {
  if (tab === "all") return bookings;
  return bookings.filter((b) => b.status === tab);
}

export default function AdminBookingsPage() {
  const { data: bookings, isLoading } = useAllBookings();
  const updateStatus = useUpdateBookingStatus();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const handleStatus = async (id: bigint, status: BookingStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success("Booking status updated");
    } catch {
      toast.error("Failed to update booking");
    }
  };

  const filtered = filterBookings(bookings ?? [], activeTab);

  return (
    <div className="p-4 md:p-6 space-y-6" data-ocid="admin.bookings.page">
      <div>
        <h1 className="text-white font-display font-bold text-2xl tracking-tight">
          Bookings
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Manage booking requests from customers
        </p>
      </div>

      {/* Filter Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as FilterTab)}
      >
        <TabsList
          className="bg-slate-900 border border-white/10"
          data-ocid="admin.bookings.filter.tab"
        >
          {FILTER_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-slate-400 data-[state=active]:bg-white/10 data-[state=active]:text-white text-xs"
              data-ocid={`admin.bookings.filter.${tab.value}.tab`}
            >
              {tab.label}
              {bookings && tab.value !== "all" && (
                <span className="ml-1.5 text-[10px] text-slate-500">
                  ({bookings.filter((b) => b.status === tab.value).length})
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
            data-ocid="admin.bookings.loading_state"
          >
            {["s1", "s2", "s3", "s4", "s5"].map((sk) => (
              <Skeleton key={sk} className="h-10 w-full bg-slate-800" />
            ))}
          </div>
        ) : !filtered.length ? (
          <div
            className="text-center py-16 text-slate-500"
            data-ocid="admin.bookings.empty_state"
          >
            <p className="font-display text-base font-semibold text-slate-400 mb-1">
              No bookings found
            </p>
            <p className="text-sm">
              {activeTab === "all"
                ? "Booking requests will appear here."
                : `No ${activeTab} bookings.`}
            </p>
          </div>
        ) : (
          <Table data-ocid="admin.bookings.table">
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-slate-400 text-xs">Name</TableHead>
                <TableHead className="text-slate-400 text-xs">Phone</TableHead>
                <TableHead className="text-slate-400 text-xs">
                  Service
                </TableHead>
                <TableHead className="text-slate-400 text-xs">City</TableHead>
                <TableHead className="text-slate-400 text-xs">Date</TableHead>
                <TableHead className="text-slate-400 text-xs">Status</TableHead>
                <TableHead className="text-slate-400 text-xs text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((booking, i) => (
                <TableRow
                  key={String(booking.id)}
                  className="border-white/5 hover:bg-white/3"
                  data-ocid={`admin.bookings.row.${i + 1}`}
                >
                  <TableCell className="text-white text-sm font-medium">
                    {booking.name}
                  </TableCell>
                  <TableCell className="text-slate-300 text-sm font-mono">
                    {booking.phone}
                  </TableCell>
                  <TableCell className="text-slate-300 text-sm max-w-[140px] truncate">
                    {booking.serviceType}
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    {booking.city}
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    {formatNanoDate(booking.date)}
                  </TableCell>
                  <TableCell>{bookingStatusBadge(booking.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={updateStatus.isPending}
                          className="h-7 text-xs text-slate-400 hover:text-white border border-white/10 hover:bg-white/5"
                          data-ocid={`admin.bookings.action.dropdown_menu.${i + 1}`}
                        >
                          {updateStatus.isPending ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <>
                              Update <ChevronDown size={12} className="ml-1" />
                            </>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="bg-slate-800 border-white/10"
                        align="end"
                        data-ocid={`admin.bookings.action.popover.${i + 1}`}
                      >
                        {booking.status !== BookingStatus.reviewed && (
                          <DropdownMenuItem
                            className="text-amber-300 hover:text-amber-200 focus:bg-amber-500/10 text-sm cursor-pointer"
                            onClick={() =>
                              handleStatus(booking.id, BookingStatus.reviewed)
                            }
                          >
                            Mark Reviewed
                          </DropdownMenuItem>
                        )}
                        {booking.status !== BookingStatus.confirmed && (
                          <DropdownMenuItem
                            className="text-green-300 hover:text-green-200 focus:bg-green-500/10 text-sm cursor-pointer"
                            onClick={() =>
                              handleStatus(booking.id, BookingStatus.confirmed)
                            }
                          >
                            Confirm
                          </DropdownMenuItem>
                        )}
                        {booking.status !== BookingStatus.cancelled && (
                          <DropdownMenuItem
                            className="text-red-300 hover:text-red-200 focus:bg-red-500/10 text-sm cursor-pointer"
                            onClick={() =>
                              handleStatus(booking.id, BookingStatus.cancelled)
                            }
                          >
                            Cancel
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
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
