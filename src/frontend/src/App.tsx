import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
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

// Root layout
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

const routeTree = rootRoute.addChildren([
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

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
