import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BookingStatus, TransactionStatus } from "../backend.d";
import { useActor } from "./useActor";

// Legacy type aliases for backward compatibility with older code
// These types existed in a previous backend.d.ts version
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ListingStatus = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Status = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UserStatus = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type VendorStatus = any;

// Helper: cast actor to any for calling legacy backend methods not in current type definition
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function legacyActor(actor: unknown): any {
  return actor;
}

// ── Analytics ──────────────────────────────────────────────────────────────

export function useAnalytics() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      if (!actor) return null;
      return legacyActor(actor).getAnalytics();
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
      return legacyActor(actor).getAllEvents();
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
      return legacyActor(actor).createEvent(
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
      return legacyActor(actor).deleteEvent(id);
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
      return legacyActor(actor).getAllVendors();
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
      return legacyActor(actor).updateVendorStatus(id, status);
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
      return legacyActor(actor).getAllBookings();
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
      return legacyActor(actor).updateBookingStatus(id, status);
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
      return legacyActor(actor).createBookingRequest(
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
      return legacyActor(actor).getAllUsers();
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
      return legacyActor(actor).updateUserStatus(id, status);
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
      return legacyActor(actor).getAllListings();
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
      return legacyActor(actor).updateListingStatus(id, status);
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
      return legacyActor(actor).getPublishedEvents();
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
      return legacyActor(actor).getTicketCategoriesByEvent(eventId);
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
      return legacyActor(actor).addTicketCategory(
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
      return legacyActor(actor).deleteTicketCategory(data.id);
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
      return legacyActor(actor).getAllEventBookings();
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
      return legacyActor(actor).createEventBooking(
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
      return legacyActor(actor).updateEventBookingStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["eventBookings"] }),
  });
}

// ── Payment Transactions ────────────────────────────────────────────────────

export function useCreatePaymentTransaction() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      transactionId: string;
      paymentMethod: string;
      amount: bigint;
      bookingId: bigint;
      status: TransactionStatus;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createPaymentTransaction(
        data.transactionId,
        data.paymentMethod,
        data.amount,
        data.bookingId,
        data.status,
      );
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["paymentTransactions"] }),
  });
}

export function useAllPaymentTransactions() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["paymentTransactions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPaymentTransactions();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Hotels ──────────────────────────────────────────────────────────────────

import type { RoomType } from "../backend.d";

export function useAllHotels() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["hotels"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllHotels();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateHotel() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      city: string;
      address: string;
      description: string;
      roomTypes: Array<RoomType>;
      amenities: Array<string>;
      photoUrls: Array<string>;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createHotel(
        data.name,
        data.city,
        data.address,
        data.description,
        data.roomTypes,
        data.amenities,
        data.photoUrls,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["hotels"] }),
  });
}

export function useUpdateHotel() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      city: string;
      address: string;
      description: string;
      roomTypes: Array<RoomType>;
      amenities: Array<string>;
      photoUrls: Array<string>;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateHotel(
        data.id,
        data.name,
        data.city,
        data.address,
        data.description,
        data.roomTypes,
        data.amenities,
        data.photoUrls,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["hotels"] }),
  });
}

export function useDeleteHotel() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteHotel(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["hotels"] }),
  });
}

// ── Hotel Bookings ──────────────────────────────────────────────────────────

export function useCreateHotelBooking() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      hotelId: bigint;
      hotelName: string;
      roomType: string;
      pricePerNight: bigint;
      guestName: string;
      guestPhone: string;
      guestEmail: string;
      checkInDate: bigint;
      checkOutDate: bigint;
      numberOfNights: bigint;
      totalAmount: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createHotelBooking(
        data.hotelId,
        data.hotelName,
        data.roomType,
        data.pricePerNight,
        data.guestName,
        data.guestPhone,
        data.guestEmail,
        data.checkInDate,
        data.checkOutDate,
        data.numberOfNights,
        data.totalAmount,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["hotelBookings"] }),
  });
}

export function useAllHotelBookings() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["hotelBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllHotelBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateHotelBookingStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: { id: bigint; status: BookingStatus }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateHotelBookingStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["hotelBookings"] }),
  });
}

export function useUpdateHotelBookingPaymentStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      paymentStatus,
    }: { id: bigint; paymentStatus: TransactionStatus }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateHotelBookingPaymentStatus(id, paymentStatus);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["hotelBookings"] }),
  });
}

// ── Transport Options ───────────────────────────────────────────────────────

import type { TransportType } from "../backend.d";

export function useAllTransportOptions() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["transportOptions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTransportOptions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateTransportOption() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      transportType: TransportType;
      operatorName: string;
      route: string;
      city: string;
      price: bigint;
      availableSeats: bigint;
      photoUrls: Array<string>;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createTransportOption(
        data.transportType,
        data.operatorName,
        data.route,
        data.city,
        data.price,
        data.availableSeats,
        data.photoUrls,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transportOptions"] }),
  });
}

export function useUpdateTransportOption() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      transportType: TransportType;
      operatorName: string;
      route: string;
      city: string;
      price: bigint;
      availableSeats: bigint;
      photoUrls: Array<string>;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateTransportOption(
        data.id,
        data.transportType,
        data.operatorName,
        data.route,
        data.city,
        data.price,
        data.availableSeats,
        data.photoUrls,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transportOptions"] }),
  });
}

export function useDeleteTransportOption() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteTransportOption(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transportOptions"] }),
  });
}

// ── Transport Bookings ──────────────────────────────────────────────────────

export function useAllTransportBookings() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["transportBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTransportBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateTransportBooking() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      transportId: bigint;
      transportName: string;
      transportType: string;
      operatorName: string;
      route: string;
      passengerName: string;
      passengerPhone: string;
      passengerEmail: string;
      city: string;
      travelDate: bigint;
      seats: bigint;
      totalAmount: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createTransportBooking(
        data.transportId,
        data.transportName,
        data.transportType,
        data.operatorName,
        data.route,
        data.passengerName,
        data.passengerPhone,
        data.passengerEmail,
        data.city,
        data.travelDate,
        data.seats,
        data.totalAmount,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transportBookings"] }),
  });
}

export function useUpdateTransportBookingStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: { id: bigint; status: BookingStatus }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateTransportBookingStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transportBookings"] }),
  });
}

export function useUpdateTransportBookingPaymentStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      paymentStatus,
    }: { id: bigint; paymentStatus: TransactionStatus }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateTransportBookingPaymentStatus(id, paymentStatus);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transportBookings"] }),
  });
}

// ── Razorpay Config ─────────────────────────────────────────────────────────

export function useGetRazorpayConfig() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["razorpayConfig"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return await (actor as any).getRazorpayConfig();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateRazorpayConfig() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      keyId: string;
      keySecret: string;
      testMode: boolean;
    }) => {
      if (!actor) throw new Error("Actor not available");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).updateRazorpayConfig(
        data.keyId,
        data.keySecret,
        data.testMode,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["razorpayConfig"] }),
  });
}
