import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AdminLayout from "./components/admin/AdminLayout";
import AdvertisePage from "./pages/AdvertisePage";
import ArtistsPage from "./pages/ArtistsPage";
import BusinessServicesPage from "./pages/BusinessServicesPage";
import ContactPage from "./pages/ContactPage";
import DigitalProductsPage from "./pages/DigitalProductsPage";
import EventsPage from "./pages/EventsPage";
import FoodPage from "./pages/FoodPage";
import HomePage from "./pages/HomePage";
import HotelsPage from "./pages/HotelsPage";
import RankingsPage from "./pages/RankingsPage";
import StaffJobsPage from "./pages/StaffJobsPage";
import TransportPage from "./pages/TransportPage";
import VendorsPage from "./pages/VendorsPage";
import VenuesPage from "./pages/VenuesPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";
import AdminBookingsPage from "./pages/admin/AdminBookingsPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminEventsPage from "./pages/admin/AdminEventsPage";
import AdminListingsPage from "./pages/admin/AdminListingsPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminVendorsPage from "./pages/admin/AdminVendorsPage";

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

// Wire admin layout children
adminLayoutRoute.addChildren([
  adminDashboardRoute,
  adminEventsRoute,
  adminVendorsRoute,
  adminBookingsRoute,
  adminUsersRoute,
  adminListingsRoute,
  adminAnalyticsRoute,
]);

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
]);

// Admin route tree
const adminRouteTree = adminRootRoute.addChildren([
  adminLoginRoute,
  adminLayoutRoute,
]);

// Build routers
const publicRouter = createRouter({ routeTree: publicRouteTree });
const adminRouter = createRouter({ routeTree: adminRouteTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof publicRouter;
  }
}

// Determine which router to use based on pathname
function isAdminPath(pathname: string) {
  return pathname.startsWith("/admin");
}

export default function App() {
  const pathname = window.location.pathname;
  if (isAdminPath(pathname)) {
    return <RouterProvider router={adminRouter} />;
  }
  return <RouterProvider router={publicRouter} />;
}
