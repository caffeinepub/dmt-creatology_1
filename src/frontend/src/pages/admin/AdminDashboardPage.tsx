import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAnalytics, useIsCallerAdmin } from "@/hooks/useAdminQueries";
import {
  BookOpen,
  CalendarDays,
  List,
  ShieldAlert,
  Store,
  Users,
} from "lucide-react";
import { BookingStatus } from "../../backend.d";

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
        <Badge className="bg-blue-500/15 text-blue-300 border-blue-500/30 hover:bg-blue-500/20">
          New
        </Badge>
      );
    case BookingStatus.reviewed:
      return (
        <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/20">
          Reviewed
        </Badge>
      );
    case BookingStatus.confirmed:
      return (
        <Badge className="bg-green-500/15 text-green-300 border-green-500/30 hover:bg-green-500/20">
          Confirmed
        </Badge>
      );
    case BookingStatus.cancelled:
      return (
        <Badge className="bg-red-500/15 text-red-300 border-red-500/30 hover:bg-red-500/20">
          Cancelled
        </Badge>
      );
  }
}

export default function AdminDashboardPage() {
  const { data: analytics, isLoading } = useAnalytics();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();

  if (isAdminLoading) {
    return (
      <div
        className="flex items-center justify-center h-64"
        data-ocid="admin.dashboard.loading_state"
      >
        <div className="text-slate-400 text-sm">Verifying admin access...</div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div
        className="flex flex-col items-center justify-center h-64 gap-4"
        data-ocid="admin.dashboard.error_state"
      >
        <ShieldAlert className="text-red-400" size={48} />
        <div className="text-center">
          <h2 className="text-white font-display font-bold text-xl mb-1">
            Access Denied
          </h2>
          <p className="text-slate-400 text-sm">
            Your account does not have admin privileges.
          </p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Events",
      value: analytics?.totalEvents ?? BigInt(0),
      icon: CalendarDays,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      label: "Total Bookings",
      value: analytics?.totalBookings ?? BigInt(0),
      icon: BookOpen,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "Total Vendors",
      value: analytics?.totalVendors ?? BigInt(0),
      icon: Store,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    {
      label: "Total Users",
      value: analytics?.totalUsers ?? BigInt(0),
      icon: Users,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      label: "Total Listings",
      value: analytics?.totalListings ?? BigInt(0),
      icon: List,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6" data-ocid="admin.dashboard.page">
      {/* Header */}
      <div>
        <h1 className="text-white font-display font-bold text-2xl tracking-tight">
          Dashboard
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Overview of DMT CREATOLOGY platform metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.label}
              className={`bg-slate-900 border ${card.border}`}
              data-ocid={`admin.stat.item.${i + 1}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                      {card.label}
                    </p>
                    {isLoading ? (
                      <Skeleton className="h-8 w-12 mt-2 bg-slate-800" />
                    ) : (
                      <p
                        className={`text-3xl font-display font-bold mt-1 ${card.color}`}
                      >
                        {Number(card.value)}
                      </p>
                    )}
                  </div>
                  <div className={`${card.bg} p-2 rounded-lg`}>
                    <Icon size={18} className={card.color} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Bookings */}
      <Card className="bg-slate-900 border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-white font-display text-base font-semibold">
            Recent Bookings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div
              className="p-4 space-y-3"
              data-ocid="admin.recent_bookings.loading_state"
            >
              {["s1", "s2", "s3", "s4", "s5"].map((sk) => (
                <Skeleton key={sk} className="h-8 w-full bg-slate-800" />
              ))}
            </div>
          ) : !analytics?.recentBookings?.length ? (
            <div
              className="text-center py-12 text-slate-500 text-sm"
              data-ocid="admin.recent_bookings.empty_state"
            >
              No bookings yet.
            </div>
          ) : (
            <Table data-ocid="admin.recent_bookings.table">
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-slate-400 text-xs">Name</TableHead>
                  <TableHead className="text-slate-400 text-xs">
                    Service
                  </TableHead>
                  <TableHead className="text-slate-400 text-xs">City</TableHead>
                  <TableHead className="text-slate-400 text-xs">Date</TableHead>
                  <TableHead className="text-slate-400 text-xs">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.recentBookings.slice(0, 10).map((booking, i) => (
                  <TableRow
                    key={String(booking.id)}
                    className="border-white/5 hover:bg-white/3"
                    data-ocid={`admin.recent_bookings.row.${i + 1}`}
                  >
                    <TableCell className="text-white text-sm font-medium">
                      {booking.name}
                    </TableCell>
                    <TableCell className="text-slate-300 text-sm">
                      {booking.serviceType}
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {booking.city}
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {formatNanoDate(booking.date)}
                    </TableCell>
                    <TableCell>{bookingStatusBadge(booking.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
