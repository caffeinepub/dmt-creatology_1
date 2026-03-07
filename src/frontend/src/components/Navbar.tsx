import { Button } from "@/components/ui/button";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, QrCode, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Events", path: "/events" },
  { label: "Hotels", path: "/hotels" },
  { label: "Food", path: "/food" },
  { label: "Venues", path: "/venues" },
  { label: "Transport", path: "/transport" },
  { label: "Vendors", path: "/vendors" },
  { label: "Artists", path: "/artists" },
  { label: "Staff Jobs", path: "/staff-jobs" },
  { label: "Digital", path: "/digital-products" },
  { label: "Business", path: "/business-services" },
  { label: "Rankings", path: "/rankings" },
  { label: "Advertise", path: "/advertise" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-[oklch(0.12_0.018_260/95%)] backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0"
            data-ocid="nav.link"
          >
            <img
              src="/assets/generated/dmt-logo-transparent.dim_300x100.png"
              alt="DMT Creatology"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = "none";
                const next = target.nextElementSibling as HTMLElement | null;
                if (next) next.style.display = "flex";
              }}
            />
            <span
              className="hidden font-display font-black text-xl tracking-tight items-center"
              style={{ display: "none" }}
            >
              <span className="text-gradient-gold">DMT</span>
              <span className="text-foreground ml-1.5">CREATOLOGY</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors duration-200 whitespace-nowrap ${
                  isActive(link.path)
                    ? "text-gold bg-gold/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
                data-ocid="nav.link"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Staff Scan button (desktop) */}
          <Link
            to="/scan"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium text-muted-foreground hover:text-gold hover:bg-gold/10 transition-colors duration-200 shrink-0 border border-border/40 hover:border-gold/40"
            title="Staff Entry Scan"
            data-ocid="nav.scan_link"
          >
            <QrCode className="h-3.5 w-3.5" />
            Staff Scan
          </Link>

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-foreground hover:bg-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            data-ocid="nav.mobile_toggle"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border/50 bg-[oklch(0.14_0.02_260)] animate-fade-in">
          <nav className="container mx-auto px-4 py-3 grid grid-cols-2 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? "text-gold bg-gold/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
                onClick={() => setMobileOpen(false)}
                data-ocid="nav.link"
              >
                {link.label}
              </Link>
            ))}
            {/* Staff Scan link in mobile menu */}
            <Link
              to="/scan"
              className={`px-3 py-2 rounded text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 col-span-2 border border-border/30 mt-1 ${
                isActive("/scan")
                  ? "text-gold bg-gold/10"
                  : "text-muted-foreground hover:text-gold hover:bg-gold/5"
              }`}
              onClick={() => setMobileOpen(false)}
              data-ocid="nav.scan_link"
            >
              <QrCode className="h-3.5 w-3.5" />
              Staff Entry Scan
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
