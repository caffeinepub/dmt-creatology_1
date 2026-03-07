import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BookingStatus,
  ListingStatus,
  Status,
  VendorStatus,
} from "../backend.d";

// UserStatus is used in the backend interface but not exported as an enum
type UserStatus = "active" | "inactive";
import { useActor } from "./useActor";

// ── Analytics ──────────────────────────────────────────────────────────────

export function useAnalytics() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAnalytics();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Events ─────────────────────────────────────────────────────────────────

export function useAllEvents() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEvents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateEvent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      category: string;
      subCategory: string;
      venue: string;
      city: string;
      state: string;
      country: string;
      date: bigint;
      time: string;
      duration: string;
      ageLimit: bigint;
      description: string;
      posterUrl: string;
      bannerUrl: string;
      status: Status;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createEvent(
        data.name,
        data.category,
        data.subCategory,
        data.venue,
        data.city,
        data.state,
        data.country,
        data.date,
        data.time,
        data.duration,
        data.ageLimit,
        data.description,
        data.posterUrl,
        data.bannerUrl,
        data.status,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useDeleteEvent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteEvent(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

// ── Vendors ────────────────────────────────────────────────────────────────

export function useAllVendors() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVendors();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateVendorStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: { id: bigint; status: VendorStatus }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateVendorStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vendors"] }),
  });
}

// ── Bookings ───────────────────────────────────────────────────────────────

export function useAllBookings() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: bigint;
      status: BookingStatus;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateBookingStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookings"] }),
  });
}

export function useCreateBookingRequest() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      phone: string;
      serviceType: string;
      city: string;
      date: bigint;
      message: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createBookingRequest(
        data.name,
        data.phone,
        data.serviceType,
        data.city,
        data.date,
        data.message,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookings"] }),
  });
}

// ── Users ──────────────────────────────────────────────────────────────────

export function useAllUsers() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateUserStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: bigint;
      status: UserStatus;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateUserStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

// ── Listings ───────────────────────────────────────────────────────────────

export function useAllListings() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["listings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateListingStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: bigint;
      status: ListingStatus;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateListingStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["listings"] }),
  });
}

// ── Admin check ────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Published Events (public) ───────────────────────────────────────────────

export function usePublishedEvents() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["publishedEvents"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublishedEvents();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Ticket Categories ───────────────────────────────────────────────────────

export function useTicketCategoriesByEvent(eventId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["ticketCategories", String(eventId)],
    queryFn: async () => {
      if (!actor || eventId === null) return [];
      return actor.getTicketCategoriesByEvent(eventId);
    },
    enabled: !!actor && !isFetching && eventId !== null,
  });
}

export function useAddTicketCategory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      eventId: bigint;
      name: string;
      price: bigint;
      availableQty: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addTicketCategory(
        data.eventId,
        data.name,
        data.price,
        data.availableQty,
      );
    },
    onSuccess: (_result, vars) =>
      qc.invalidateQueries({
        queryKey: ["ticketCategories", String(vars.eventId)],
      }),
  });
}

export function useDeleteTicketCategory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: bigint; eventId: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteTicketCategory(data.id);
    },
    onSuccess: (_result, vars) =>
      qc.invalidateQueries({
        queryKey: ["ticketCategories", String(vars.eventId)],
      }),
  });
}

// ── Event Bookings ──────────────────────────────────────────────────────────

export function useAllEventBookings() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["eventBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEventBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateEventBooking() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      eventId: bigint;
      eventName: string;
      ticketCategory: string;
      name: string;
      phone: string;
      city: string;
      quantity: bigint;
      message: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createEventBooking(
        data.eventId,
        data.eventName,
        data.ticketCategory,
        data.name,
        data.phone,
        data.city,
        data.quantity,
        data.message,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["eventBookings"] }),
  });
}

export function useUpdateEventBookingStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: bigint;
      status: BookingStatus;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateEventBookingStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["eventBookings"] }),
  });
}
