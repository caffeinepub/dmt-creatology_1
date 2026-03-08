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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAllBookings,
  useAllEventBookings,
  useUpdateBookingStatus,
  useUpdateEventBookingStatus,
} from "@/hooks/useAdminQueries";
import { ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BookingStatus } from "../../backend.d";
// Booking and EventBooking types - defined locally since they were removed from the reduced backend.d.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Booking = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventBooking = any;

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

// ── General Bookings Filter ─────────────────────────────────────────────────

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

// ── General Bookings Panel ──────────────────────────────────────────────────

function GeneralBookingsPanel() {
  const { data: bookings, isLoading } = useAllBookings();
  const updateStatus = useUpdateBookingStatus();
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  const handleStatus = async (id: bigint, status: BookingStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success("Booking status updated");
    } catch {
      toast.error("Failed to update booking");
    }
  };

  const filtered = filterBookings(bookings ?? [], activeFilter);

  return (
    <div className="space-y-4">
      {/* Sub-filter tabs */}
      <Tabs
        value={activeFilter}
        onValueChange={(v) => setActiveFilter(v as FilterTab)}
      >
        <TabsList
          className="bg-slate-900 border border-white/10"
          data-ocid="admin.bookings.general.filter.tab"
        >
          {FILTER_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-slate-400 data-[state=active]:bg-white/10 data-[state=active]:text-white text-xs"
              data-ocid={`admin.bookings.general.filter.${tab.value}.tab`}
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
            data-ocid="admin.bookings.general.loading_state"
          >
            {["s1", "s2", "s3", "s4", "s5"].map((sk) => (
              <Skeleton key={sk} className="h-10 w-full bg-slate-800" />
            ))}
          </div>
        ) : !filtered.length ? (
          <div
            className="text-center py-16 text-slate-500"
            data-ocid="admin.bookings.general.empty_state"
          >
            <p className="font-display text-base font-semibold text-slate-400 mb-1">
              No bookings found
            </p>
            <p className="text-sm">
              {activeFilter === "all"
                ? "Booking requests will appear here."
                : `No ${activeFilter} bookings.`}
            </p>
          </div>
        ) : (
          <Table data-ocid="admin.bookings.general.table">
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
                  data-ocid={`admin.bookings.general.row.${i + 1}`}
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
                          data-ocid={`admin.bookings.general.action.dropdown_menu.${i + 1}`}
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
                        data-ocid={`admin.bookings.general.action.popover.${i + 1}`}
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

// ── Event Bookings Panel ────────────────────────────────────────────────────

function EventBookingsPanel() {
  const { data: eventBookings, isLoading } = useAllEventBookings();
  const updateStatus = useUpdateEventBookingStatus();
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  const handleStatus = async (id: bigint, status: BookingStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success("Booking status updated");
    } catch {
      toast.error("Failed to update booking");
    }
  };

  const filtered: EventBooking[] =
    activeFilter === "all"
      ? (eventBookings ?? [])
      : (eventBookings ?? []).filter((b) => b.status === activeFilter);

  return (
    <div className="space-y-4">
      {/* Sub-filter tabs */}
      <Tabs
        value={activeFilter}
        onValueChange={(v) => setActiveFilter(v as FilterTab)}
      >
        <TabsList
          className="bg-slate-900 border border-white/10"
          data-ocid="admin.bookings.events.filter.tab"
        >
          {FILTER_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-slate-400 data-[state=active]:bg-white/10 data-[state=active]:text-white text-xs"
              data-ocid={`admin.bookings.events.filter.${tab.value}.tab`}
            >
              {tab.label}
              {eventBookings && tab.value !== "all" && (
                <span className="ml-1.5 text-[10px] text-slate-500">
                  ({eventBookings.filter((b) => b.status === tab.value).length})
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
            data-ocid="admin.bookings.events.loading_state"
          >
            {["s1", "s2", "s3", "s4", "s5"].map((sk) => (
              <Skeleton key={sk} className="h-10 w-full bg-slate-800" />
            ))}
          </div>
        ) : !filtered.length ? (
          <div
            className="text-center py-16 text-slate-500"
            data-ocid="admin.bookings.events.empty_state"
          >
            <p className="font-display text-base font-semibold text-slate-400 mb-1">
              No event bookings found
            </p>
            <p className="text-sm">
              {activeFilter === "all"
                ? "Event booking requests will appear here."
                : `No ${activeFilter} event bookings.`}
            </p>
          </div>
        ) : (
          <Table data-ocid="admin.eventbookings.table">
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-slate-400 text-xs">Event</TableHead>
                <TableHead className="text-slate-400 text-xs">Ticket</TableHead>
                <TableHead className="text-slate-400 text-xs">Name</TableHead>
                <TableHead className="text-slate-400 text-xs">Phone</TableHead>
                <TableHead className="text-slate-400 text-xs">City</TableHead>
                <TableHead className="text-slate-400 text-xs">Qty</TableHead>
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
                  data-ocid={`admin.eventbookings.row.${i + 1}`}
                >
                  <TableCell className="text-white text-sm font-medium max-w-[120px] truncate">
                    {booking.eventName}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-gold/15 text-gold border-gold/30 text-xs">
                      {booking.ticketCategory}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-300 text-sm">
                    {booking.name}
                  </TableCell>
                  <TableCell className="text-slate-300 text-sm font-mono">
                    {booking.phone}
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    {booking.city}
                  </TableCell>
                  <TableCell className="text-slate-300 text-sm font-semibold">
                    {Number(booking.quantity)}
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    {formatNanoDate(booking.createdAt)}
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
                          data-ocid={`admin.eventbookings.action.dropdown_menu.${i + 1}`}
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
                        data-ocid={`admin.eventbookings.action.popover.${i + 1}`}
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

// ── Main Page ───────────────────────────────────────────────────────────────

export default function AdminBookingsPage() {
  const { data: allBookings } = useAllBookings();
  const { data: allEventBookings } = useAllEventBookings();

  return (
    <div className="p-4 md:p-6 space-y-6" data-ocid="admin.bookings.page">
      <div>
        <h1 className="text-white font-display font-bold text-2xl tracking-tight">
          Bookings
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Manage all booking requests from customers
        </p>
      </div>

      {/* Main tabs: General vs Event */}
      <Tabs defaultValue="general">
        <TabsList className="bg-slate-900 border border-white/10 mb-2">
          <TabsTrigger
            value="general"
            className="text-slate-400 data-[state=active]:bg-white/10 data-[state=active]:text-white text-sm"
            data-ocid="admin.bookings.general.tab"
          >
            General Bookings
            {allBookings && allBookings.length > 0 && (
              <span className="ml-2 text-[10px] text-slate-500">
                ({allBookings.length})
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="text-slate-400 data-[state=active]:bg-white/10 data-[state=active]:text-white text-sm"
            data-ocid="admin.bookings.events.tab"
          >
            Event Bookings
            {allEventBookings && allEventBookings.length > 0 && (
              <span className="ml-2 text-[10px] text-slate-500">
                ({allEventBookings.length})
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralBookingsPanel />
        </TabsContent>

        <TabsContent value="events">
          <EventBookingsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
