import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import StaffProtectedRoute from "./components/StaffProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdvertisePage from "./pages/AdvertisePage";
import ArtistsPage from "./pages/ArtistsPage";
import BusinessServicesPage from "./pages/BusinessServicesPage";
import ContactPage from "./pages/ContactPage";
import DigitalProductsPage from "./pages/DigitalProductsPage";
import EventsPage from "./pages/EventsPage";
import FoodPage from "./pages/FoodPage";
import HomePage from "./pages/HomePage";
import HotelConfirmationPage from "./pages/HotelConfirmationPage";
import HotelsPage from "./pages/HotelsPage";
import RankingsPage from "./pages/RankingsPage";
import ScanPage from "./pages/ScanPage";
import StaffJobsPage from "./pages/StaffJobsPage";
import StaffLoginPage from "./pages/StaffLoginPage";
import TicketPage from "./pages/TicketPage";
import TransportConfirmationPage from "./pages/TransportConfirmationPage";
import TransportPage from "./pages/TransportPage";
import VendorDashboardPage from "./pages/VendorDashboardPage";
import VendorLoginPage from "./pages/VendorLoginPage";
import VendorRegisterPage from "./pages/VendorRegisterPage";
import VendorsPage from "./pages/VendorsPage";
import VenuesPage from "./pages/VenuesPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";
import AdminBookingsPage from "./pages/admin/AdminBookingsPage";
import AdminConfigPage from "./pages/admin/AdminConfigPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminEventsPage from "./pages/admin/AdminEventsPage";
import AdminHotelBookingsPage from "./pages/admin/AdminHotelBookingsPage";
import AdminHotelsPage from "./pages/admin/AdminHotelsPage";
import AdminListingsPage from "./pages/admin/AdminListingsPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminPaymentsPage from "./pages/admin/AdminPaymentsPage";
import AdminStaffPage from "./pages/admin/AdminStaffPage";
import AdminTransportBookingsPage from "./pages/admin/AdminTransportBookingsPage";
import AdminTransportPage from "./pages/admin/AdminTransportPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminVendorsPage from "./pages/admin/AdminVendorsPage";

// Protected scan page wrapper
function ProtectedScanPage() {
  return (
    <StaffProtectedRoute>
      <ScanPage />
    </StaffProtectedRoute>
  );
}

// ── Public Root Layout ─────────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const eventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events",
  component: EventsPage,
});
const hotelsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/hotels",
  component: HotelsPage,
});
const foodRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/food",
  component: FoodPage,
});
const venuesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/venues",
  component: VenuesPage,
});
const transportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/transport",
  component: TransportPage,
});
const vendorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/vendors",
  component: VendorsPage,
});
const artistsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/artists",
  component: ArtistsPage,
});
const staffJobsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/staff-jobs",
  component: StaffJobsPage,
});
const digitalProductsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/digital-products",
  component: DigitalProductsPage,
});
const businessServicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/business-services",
  component: BusinessServicesPage,
});
const rankingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rankings",
  component: RankingsPage,
});
const advertiseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/advertise",
  component: AdvertisePage,
});
const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

// ── Vendor Register (public layout with Navbar + Footer) ───────────────────
const vendorRegisterPublicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/vendor/register",
  component: VendorRegisterPage,
});

// ── Ticket page (public layout with Navbar + Footer) ───────────────────────
const ticketRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ticket/$bookingId",
  component: TicketPage,
});

// ── Staff scan page (protected) with Navbar + Footer ───────────────────────
const scanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/scan",
  component: ProtectedScanPage,
});

// ── Hotel confirmation (public layout with Navbar + Footer) ────────────────
const hotelConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/hotel-confirmation/$bookingId",
  component: HotelConfirmationPage,
});

// ── Admin Root (no Navbar/Footer) ──────────────────────────────────────────
const adminRootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Admin Login — standalone (no AdminLayout)
const adminLoginRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/admin/login",
  component: AdminLoginPage,
});

// Admin Layout wrapper
const adminLayoutRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/admin",
  component: AdminLayout,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/",
  component: AdminDashboardPage,
});
const adminEventsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/events",
  component: AdminEventsPage,
});
const adminHotelsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/hotels",
  component: AdminHotelsPage,
});
const adminVendorsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/vendors",
  component: AdminVendorsPage,
});
const adminBookingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/bookings",
  component: AdminBookingsPage,
});
const adminUsersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/users",
  component: AdminUsersPage,
});
const adminListingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/listings",
  component: AdminListingsPage,
});
const adminAnalyticsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/analytics",
  component: AdminAnalyticsPage,
});
const adminStaffRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/staff",
  component: AdminStaffPage,
});

const adminPaymentsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/payments",
  component: AdminPaymentsPage,
});

const adminConfigRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/config",
  component: AdminConfigPage,
});

const adminHotelBookingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/hotel-bookings",
  component: AdminHotelBookingsPage,
});

const adminTransportRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/transport",
  component: AdminTransportPage,
});

const adminTransportBookingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/transport-bookings",
  component: AdminTransportBookingsPage,
});

const transportConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/transport-confirmation/$bookingId",
  component: TransportConfirmationPage,
});

// Wire admin layout children
adminLayoutRoute.addChildren([
  adminDashboardRoute,
  adminEventsRoute,
  adminHotelsRoute,
  adminVendorsRoute,
  adminBookingsRoute,
  adminPaymentsRoute,
  adminHotelBookingsRoute,
  adminTransportRoute,
  adminTransportBookingsRoute,
  adminUsersRoute,
  adminListingsRoute,
  adminAnalyticsRoute,
  adminStaffRoute,
  adminConfigRoute,
]);

// ── Vendor Root (no Navbar/Footer) ─────────────────────────────────────────
const vendorRootRoute = createRootRoute({
  component: () => <Outlet />,
});

const vendorLoginRoute = createRoute({
  getParentRoute: () => vendorRootRoute,
  path: "/vendor/login",
  component: VendorLoginPage,
});

const vendorDashboardRoute = createRoute({
  getParentRoute: () => vendorRootRoute,
  path: "/vendor/dashboard",
  component: VendorDashboardPage,
});

// ── Staff Auth Root (no Navbar/Footer) ─────────────────────────────────────
const staffAuthRootRoute = createRootRoute({
  component: () => <Outlet />,
});

const staffLoginRoute = createRoute({
  getParentRoute: () => staffAuthRootRoute,
  path: "/staff/login",
  component: StaffLoginPage,
});

// Public route tree
const publicRouteTree = rootRoute.addChildren([
  indexRoute,
  eventsRoute,
  hotelsRoute,
  foodRoute,
  venuesRoute,
  transportRoute,
  vendorsRoute,
  artistsRoute,
  staffJobsRoute,
  digitalProductsRoute,
  businessServicesRoute,
  rankingsRoute,
  advertiseRoute,
  contactRoute,
  vendorRegisterPublicRoute,
  ticketRoute,
  hotelConfirmationRoute,
  transportConfirmationRoute,
  scanRoute,
]);

// Admin route tree
const adminRouteTree = adminRootRoute.addChildren([
  adminLoginRoute,
  adminLayoutRoute,
]);

// Vendor route tree
const vendorRouteTree = vendorRootRoute.addChildren([
  vendorLoginRoute,
  vendorDashboardRoute,
]);

// Staff auth route tree
const staffAuthRouteTree = staffAuthRootRoute.addChildren([staffLoginRoute]);

// Build routers
const publicRouter = createRouter({ routeTree: publicRouteTree });
const adminRouter = createRouter({ routeTree: adminRouteTree });
const vendorRouter = createRouter({ routeTree: vendorRouteTree });
const staffAuthRouter = createRouter({ routeTree: staffAuthRouteTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof publicRouter;
  }
}

// Determine which router to use based on pathname
function isAdminPath(pathname: string) {
  return pathname.startsWith("/admin");
}

function isVendorOnlyPath(pathname: string) {
  // Only standalone vendor paths — /vendor/register uses public layout
  return (
    pathname.startsWith("/vendor/login") ||
    pathname.startsWith("/vendor/dashboard")
  );
}

function isStaffAuthPath(pathname: string) {
  return pathname.startsWith("/staff/login");
}

export default function App() {
  const pathname = window.location.pathname;
  if (isAdminPath(pathname)) {
    return <RouterProvider router={adminRouter} />;
  }
  if (isVendorOnlyPath(pathname)) {
    return <RouterProvider router={vendorRouter} />;
  }
  if (isStaffAuthPath(pathname)) {
    return <RouterProvider router={staffAuthRouter} />;
  }
  return <RouterProvider router={publicRouter} />;
}
