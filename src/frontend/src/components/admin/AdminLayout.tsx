import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  BedDouble,
  BookOpen,
  Building2,
  CalendarDays,
  Car,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  LayoutDashboard,
  List,
  LogOut,
  MapPin,
  Menu,
  Settings2,
  Store,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Events", href: "/admin/events", icon: CalendarDays },
  { label: "Hotels", href: "/admin/hotels", icon: Building2 },
  { label: "Hotel Bookings", href: "/admin/hotel-bookings", icon: BedDouble },
  { label: "Transport", href: "/admin/transport", icon: Car },
  {
    label: "Transport Bookings",
    href: "/admin/transport-bookings",
    icon: MapPin,
  },
  { label: "Vendors", href: "/admin/vendors", icon: Store },
  { label: "Bookings", href: "/admin/bookings", icon: BookOpen },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Staff", href: "/admin/staff", icon: UserCog },
  { label: "Listings", href: "/admin/listings", icon: List },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Configuration", href: "/admin/config", icon: Settings2 },
];

function NavItem({
  item,
  currentPath,
  collapsed,
  onClick,
}: {
  item: (typeof NAV_ITEMS)[number];
  currentPath: string;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const isActive =
    item.href === "/admin"
      ? currentPath === "/admin"
      : currentPath.startsWith(item.href);
  const Icon = item.icon;

  return (
    <Link
      to={item.href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
        isActive
          ? "bg-gold/15 text-gold border border-gold/20"
          : "text-slate-400 hover:text-white hover:bg-white/5"
      }`}
      data-ocid={`admin.nav.${item.label.toLowerCase()}.link`}
    >
      <Icon
        size={18}
        className={`shrink-0 ${isActive ? "text-gold" : "text-slate-500 group-hover:text-slate-300"}`}
      />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}

export default function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { clear, identity } = useInternetIdentity();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const handleLogout = () => {
    clear();
    window.location.href = "/admin/login";
  };

  const principalShort = identity
    ? `${identity.getPrincipal().toString().slice(0, 12)}...`
    : "Unknown";

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
        {(!sidebarCollapsed || mobile) && (
          <div>
            <div className="text-gold font-display font-bold text-lg leading-none">
              DMT
            </div>
            <div className="text-slate-400 text-[10px] font-body tracking-widest uppercase mt-0.5">
              Admin Panel
            </div>
          </div>
        )}
        {!mobile && (
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-slate-500 hover:text-white transition-colors p-1 rounded"
            data-ocid="admin.sidebar.toggle"
          >
            {sidebarCollapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </button>
        )}
        {mobile && (
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="text-slate-500 hover:text-white p-1"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            currentPath={currentPath}
            collapsed={!mobile && sidebarCollapsed}
            onClick={mobile ? () => setMobileSidebarOpen(false) : undefined}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10 space-y-2">
        {(!sidebarCollapsed || mobile) && (
          <div className="px-3 py-2 rounded-lg bg-white/5 mb-2">
            <div className="text-[11px] text-slate-500 uppercase tracking-wider">
              Logged in as
            </div>
            <div className="text-xs text-slate-300 font-mono mt-0.5 truncate">
              {principalShort}
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
          data-ocid="admin.logout_button"
        >
          <LogOut size={18} className="shrink-0" />
          {(!sidebarCollapsed || mobile) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col flex-shrink-0 bg-slate-900 border-r border-white/10 transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-60"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close sidebar"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm w-full cursor-default"
            onClick={() => setMobileSidebarOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setMobileSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-white/10">
            <SidebarContent mobile />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-slate-900 border-b border-white/10 px-4 md:px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="md:hidden text-slate-400 hover:text-white p-1"
              onClick={() => setMobileSidebarOpen(true)}
              data-ocid="admin.mobile_menu.button"
            >
              <Menu size={20} />
            </button>
            <div>
              <span className="text-white font-display font-semibold text-base tracking-tight">
                DMT CREATOLOGY
              </span>
              <span className="hidden sm:inline ml-2 text-slate-500 text-sm">
                Admin Control System
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-xs text-slate-500 bg-white/5 px-2.5 py-1 rounded-full font-mono">
              {principalShort}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-xs"
              data-ocid="admin.header.logout_button"
            >
              <LogOut size={14} className="mr-1.5" />
              Sign out
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
