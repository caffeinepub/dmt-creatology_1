import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalytics } from "@/hooks/useAdminQueries";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  List,
  Store,
  TrendingUp,
  Users,
} from "lucide-react";

interface StatBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
}

function StatBar({ label, value, max, color }: StatBarProps) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="text-white font-semibold font-mono">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const { data: analytics, isLoading } = useAnalytics();

  const metrics = analytics
    ? [
        {
          label: "Events",
          value: Number(analytics.totalEvents),
          icon: CalendarDays,
          color: "text-purple-400",
          barColor: "bg-purple-500",
        },
        {
          label: "Bookings",
          value: Number(analytics.totalBookings),
          icon: BookOpen,
          color: "text-blue-400",
          barColor: "bg-blue-500",
        },
        {
          label: "Vendors",
          value: Number(analytics.totalVendors),
          icon: Store,
          color: "text-green-400",
          barColor: "bg-green-500",
        },
        {
          label: "Users",
          value: Number(analytics.totalUsers),
          icon: Users,
          color: "text-amber-400",
          barColor: "bg-amber-500",
        },
        {
          label: "Listings",
          value: Number(analytics.totalListings),
          icon: List,
          color: "text-rose-400",
          barColor: "bg-rose-500",
        },
      ]
    : [];

  const maxVal = metrics.length
    ? Math.max(...metrics.map((m) => m.value), 1)
    : 1;

  return (
    <div className="p-4 md:p-6 space-y-6" data-ocid="admin.analytics.page">
      <div>
        <h1 className="text-white font-display font-bold text-2xl tracking-tight">
          Analytics
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Platform performance overview
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {isLoading
          ? ["s1", "s2", "s3", "s4", "s5"].map((sk) => (
              <Card
                key={sk}
                className="bg-slate-900 border-white/10"
                data-ocid="admin.analytics.loading_state"
              >
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-20 bg-slate-800 mb-3" />
                  <Skeleton className="h-8 w-12 bg-slate-800" />
                </CardContent>
              </Card>
            ))
          : metrics.map((m, i) => {
              const Icon = m.icon;
              return (
                <Card
                  key={m.label}
                  className="bg-slate-900 border-white/10"
                  data-ocid={`admin.analytics.stat.item.${i + 1}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={16} className={m.color} />
                      <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                        {m.label}
                      </span>
                    </div>
                    <p className={`text-3xl font-display font-bold ${m.color}`}>
                      {m.value}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {/* Distribution Chart */}
      <Card className="bg-slate-900 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-white font-display text-base font-semibold flex items-center gap-2">
            <BarChart3 size={18} className="text-gold" />
            Platform Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          {isLoading ? (
            <div className="space-y-3">
              {["s1", "s2", "s3", "s4", "s5"].map((sk) => (
                <Skeleton key={sk} className="h-8 w-full bg-slate-800" />
              ))}
            </div>
          ) : (
            metrics.map((m) => (
              <StatBar
                key={m.label}
                label={m.label}
                value={m.value}
                max={maxVal}
                color={m.barColor}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-900 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white font-display text-sm font-semibold flex items-center gap-2">
              <TrendingUp size={16} className="text-green-400" />
              Growth Indicators
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-slate-400">Booking conversion rate</span>
              <span className="text-green-400 font-semibold font-mono">
                {analytics
                  ? analytics.totalBookings > 0
                    ? "Active"
                    : "—"
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-slate-400">Vendor approval queue</span>
              <span className="text-amber-400 font-semibold font-mono">
                Pending review
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-400">Platform status</span>
              <span className="text-green-400 font-semibold">
                ● Operational
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white font-display text-sm font-semibold flex items-center gap-2">
              <BookOpen size={16} className="text-blue-400" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!analytics?.recentBookings?.length ? (
              <p
                className="text-slate-500 text-sm py-4 text-center"
                data-ocid="admin.analytics.empty_state"
              >
                No recent activity yet.
              </p>
            ) : (
              <div className="space-y-2">
                {analytics.recentBookings.slice(0, 5).map((b, i) => (
                  <div
                    key={String(b.id)}
                    className="flex justify-between items-center py-1.5 border-b border-white/5 text-sm"
                    data-ocid={`admin.analytics.recent.item.${i + 1}`}
                  >
                    <span className="text-slate-300">{b.name}</span>
                    <span className="text-slate-500 text-xs">{b.city}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
