import { useActor } from "@/hooks/useActor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BookingStatus, TransactionStatus } from "../backend.d";

// ── Venues ──────────────────────────────────────────────────────────────────

export function useAllVenues() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["venues"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVenues();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateVenue() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      city: string;
      capacity: bigint;
      pricePerDay: bigint;
      photoUrls: string[];
      amenities: string[];
      description: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createVenue(
        data.name,
        data.city,
        data.capacity,
        data.pricePerDay,
        data.photoUrls,
        data.amenities,
        data.description,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["venues"] }),
  });
}

export function useUpdateVenue() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      city: string;
      capacity: bigint;
      pricePerDay: bigint;
      photoUrls: string[];
      amenities: string[];
      description: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateVenue(
        data.id,
        data.name,
        data.city,
        data.capacity,
        data.pricePerDay,
        data.photoUrls,
        data.amenities,
        data.description,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["venues"] }),
  });
}

export function useDeleteVenue() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteVenue(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["venues"] }),
  });
}

// ── Venue Bookings ───────────────────────────────────────────────────────────

export function useCreateVenueBooking() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      venueId: bigint;
      venueName: string;
      eventDate: bigint;
      eventDetails: string;
      guestName: string;
      guestPhone: string;
      guestEmail: string;
      totalAmount: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createVenueBooking(
        data.venueId,
        data.venueName,
        data.eventDate,
        data.eventDetails,
        data.guestName,
        data.guestPhone,
        data.guestEmail,
        data.totalAmount,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["venueBookings"] }),
  });
}

export function useAllVenueBookings() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["venueBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVenueBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateVenueBookingStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: bigint; status: BookingStatus }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateVenueBookingStatus(data.id, data.status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["venueBookings"] }),
  });
}

export function useUpdateVenueBookingPaymentStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      paymentStatus: TransactionStatus;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateVenueBookingPaymentStatus(data.id, data.paymentStatus);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["venueBookings"] }),
  });
}
