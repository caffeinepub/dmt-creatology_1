import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  useAllVenueBookings,
  useUpdateVenueBookingStatus,
} from "@/hooks/useVenueQueries";
import { Building2, IndianRupee } from "lucide-react";
import { BookingStatus, TransactionStatus } from "../../backend.d";
import type { VenueBooking } from "../../backend.d";

function formatNanoDate(ns: bigint): string {
  return new Date(Number(ns) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(amount: bigint): string {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

function PaymentStatusBadge({ status }: { status: TransactionStatus }) {
  switch (status) {
    case TransactionStatus.completed:
      return (
        <Badge className="bg-green-500/15 text-green-400 border-green-500/30 text-xs">
          Paid
        </Badge>
      );
    case TransactionStatus.pending:
      return (
        <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-xs">
          Pending
        </Badge>
      );
    case TransactionStatus.failed:
      return (
        <Badge className="bg-red-500/15 text-red-400 border-red-500/30 text-xs">
          Failed
        </Badge>
      );
    default:
      return (
        <Badge className="bg-slate-500/15 text-slate-400 border-slate-500/30 text-xs">
          Unknown
        </Badge>
      );
  }
}

function BookingStatusBadge({ status }: { status: BookingStatus }) {
  switch (status) {
    case BookingStatus.new_:
      return (
        <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/30 text-xs">
          New
        </Badge>
      );
    case BookingStatus.reviewed:
      return (
        <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-xs">
          Reviewed
        </Badge>
      );
    case BookingStatus.confirmed:
      return (
        <Badge className="bg-green-500/15 text-green-400 border-green-500/30 text-xs">
          Confirmed
        </Badge>
      );
    case BookingStatus.cancelled:
      return (
        <Badge className="bg-red-500/15 text-red-400 border-red-500/30 text-xs">
          Cancelled
        </Badge>
      );
    default:
      return (
        <Badge className="bg-slate-500/15 text-slate-400 border-slate-500/30 text-xs">
          Unknown
        </Badge>
      );
  }
}

function BookingStatusSelect({ booking }: { booking: VenueBooking }) {
  const updateStatus = useUpdateVenueBookingStatus();

  const handleChange = (val: string) => {
    updateStatus.mutate({ id: booking.id, status: val as BookingStatus });
  };

  return (
    <Select value={booking.status} onValueChange={handleChange}>
      <SelectTrigger
        className="h-7 w-32 text-xs bg-slate-800 border-slate-700 text-slate-300"
        data-ocid="admin-venue-bookings.status.select.1"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-slate-800 border-slate-700">
        <SelectItem
          value={BookingStatus.new_}
          className="text-xs text-slate-300"
        >
          New
        </SelectItem>
        <SelectItem
          value={BookingStatus.reviewed}
          className="text-xs text-slate-300"
        >
          Reviewed
        </SelectItem>
        <SelectItem
          value={BookingStatus.confirmed}
          className="text-xs text-slate-300"
        >
          Confirmed
        </SelectItem>
        <SelectItem
          value={BookingStatus.cancelled}
          className="text-xs text-slate-300"
        >
          Cancelled
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

function BookingsTable({
  bookings,
  isLoading,
}: {
  bookings: VenueBooking[] | undefined;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div
        className="space-y-2 p-4"
        data-ocid="admin-venue-bookings.loading_state"
      >
        {[1, 2, 3, 4, 5].map((k) => (
          <Skeleton key={k} className="h-12 w-full bg-slate-800/50" />
        ))}
      </div>
    );
  }

  if (!bookings?.length) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 text-center"
        data-ocid="admin-venue-bookings.empty_state"
      >
        <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mb-4">
          <Building2 size={24} className="text-slate-600" />
        </div>
        <p className="text-slate-400 font-medium">No venue bookings found</p>
        <p className="text-slate-600 text-sm mt-1">
          Venue booking records will appear here after guests complete payment.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table data-ocid="admin-venue-bookings.table">
        <TableHeader>
          <TableRow className="border-slate-800 hover:bg-transparent">
            <TableHead className="text-slate-400 text-xs uppercase tracking-wider font-medium min-w-[140px]">
              Venue Name
            </TableHead>
            <TableHead className="text-slate-400 text-xs uppercase tracking-wider font-medium min-w-[120px]">
              Guest Name
            </TableHead>
            <TableHead className="text-slate-400 text-xs uppercase tracking-wider font-medium">
              Phone
            </TableHead>
            <TableHead className="text-slate-400 text-xs uppercase tracking-wider font-medium">
              Event Date
            </TableHead>
            <TableHead className="text-slate-400 text-xs uppercase tracking-wider font-medium">
              Total
            </TableHead>
            <TableHead className="text-slate-400 text-xs uppercase tracking-wider font-medium">
              Payment
            </TableHead>
            <TableHead className="text-slate-400 text-xs uppercase tracking-wider font-medium">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking, index) => (
            <TableRow
              key={String(booking.id)}
              className="border-slate-800 hover:bg-slate-800/40 transition-colors"
              data-ocid={`admin-venue-bookings.item.${index + 1}`}
            >
              <TableCell>
                <div>
                  <p className="text-white font-medium text-sm line-clamp-1">
                    {booking.venueName}
                  </p>
                  <p className="text-slate-500 text-xs font-mono">
                    #{String(booking.id)}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-slate-300 text-sm font-medium">
                  {booking.guestName}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-slate-400 text-xs font-mono">
                  {booking.guestPhone}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-slate-300 text-sm">
                  {formatNanoDate(booking.eventDate)}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-white font-semibold text-sm">
                  {formatAmount(booking.totalAmount)}
                </span>
              </TableCell>
              <TableCell>
                <PaymentStatusBadge status={booking.paymentStatus} />
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <BookingStatusBadge status={booking.status} />
                  <BookingStatusSelect booking={booking} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function AdminVenueBookingsPage() {
  const { data: bookings, isLoading } = useAllVenueBookings();

  const paid = bookings?.filter(
    (b) => b.paymentStatus === TransactionStatus.completed,
  );
  const pending = bookings?.filter(
    (b) => b.paymentStatus === TransactionStatus.pending,
  );
  const confirmed = bookings?.filter(
    (b) => b.status === BookingStatus.confirmed,
  );

  const totalRevenue =
    paid?.reduce((sum, b) => sum + Number(b.totalAmount), 0) ?? 0;

  return (
    <div className="p-4 md:p-6 space-y-6" data-ocid="admin-venue-bookings.page">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-white font-display font-bold text-2xl">
            Venue Bookings
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            All venue reservation records
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/60 px-4 py-2.5 rounded-xl border border-slate-700/50">
          <IndianRupee size={16} className="text-[oklch(0.75_0.15_45)]" />
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider leading-none">
              Total Revenue
            </p>
            <p className="text-white font-bold text-lg leading-tight">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">
            {bookings?.length ?? 0}
          </p>
          <p className="text-slate-500 text-xs mt-0.5">Total Bookings</p>
        </div>
        <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 p-4 text-center">
          <p className="text-2xl font-bold text-green-400">
            {confirmed?.length ?? 0}
          </p>
          <p className="text-slate-500 text-xs mt-0.5">Confirmed</p>
        </div>
        <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">
            {pending?.length ?? 0}
          </p>
          <p className="text-slate-500 text-xs mt-0.5">Pending Payment</p>
        </div>
      </div>

      {/* Table with tabs */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <Tabs defaultValue="all">
          <div className="px-4 pt-4 border-b border-slate-800">
            <TabsList className="bg-slate-800/60 border-0">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 text-xs"
              >
                All ({bookings?.length ?? 0})
              </TabsTrigger>
              <TabsTrigger
                value="paid"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-slate-400 text-xs"
              >
                Paid ({paid?.length ?? 0})
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-slate-400 text-xs"
              >
                Pending ({pending?.length ?? 0})
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all" className="mt-0">
            <BookingsTable bookings={bookings} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="paid" className="mt-0">
            <BookingsTable bookings={paid} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="pending" className="mt-0">
            <BookingsTable bookings={pending} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
