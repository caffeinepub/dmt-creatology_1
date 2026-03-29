import { useActor } from "@/hooks/useActor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BookingStatus, TransactionStatus } from "../backend.d";

// ── Catering Vendors ──────────────────────────────────────────────────────────

export function useAllCateringVendors() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["cateringVendors"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCateringVendors();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCateringVendor(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["cateringVendor", String(id)],
    queryFn: async () => {
      if (!actor || id === null) return null;
      const result = await actor.getCateringVendor(id);
      return result ?? null;
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreateCateringVendor() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      city: string;
      cuisineType: string;
      pricePerPlate: bigint;
      minimumGuests: bigint;
      photoUrls: string[];
      description: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createCateringVendor(
        data.name,
        data.city,
        data.cuisineType,
        data.pricePerPlate,
        data.minimumGuests,
        data.photoUrls,
        data.description,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cateringVendors"] }),
  });
}

export function useUpdateCateringVendor() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      city: string;
      cuisineType: string;
      pricePerPlate: bigint;
      minimumGuests: bigint;
      photoUrls: string[];
      description: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateCateringVendor(
        data.id,
        data.name,
        data.city,
        data.cuisineType,
        data.pricePerPlate,
        data.minimumGuests,
        data.photoUrls,
        data.description,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cateringVendors"] }),
  });
}

export function useDeleteCateringVendor() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteCateringVendor(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cateringVendors"] }),
  });
}

// ── Food Bookings ─────────────────────────────────────────────────────────────

export function useAllFoodBookings() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["foodBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFoodBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateFoodBooking() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      vendorId: bigint;
      vendorName: string;
      guestName: string;
      guestPhone: string;
      guestEmail: string;
      eventDate: bigint;
      guestCount: bigint;
      totalAmount: bigint;
      eventLocation: string;
      specialRequests: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createFoodBooking(
        data.vendorId,
        data.vendorName,
        data.guestName,
        data.guestPhone,
        data.guestEmail,
        data.eventDate,
        data.guestCount,
        data.totalAmount,
        data.eventLocation,
        data.specialRequests,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["foodBookings"] }),
  });
}

export function useUpdateFoodBookingStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: bigint; status: BookingStatus }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateFoodBookingStatus(data.id, data.status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["foodBookings"] }),
  });
}

export function useUpdateFoodBookingPaymentStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      paymentStatus: TransactionStatus;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateFoodBookingPaymentStatus(data.id, data.paymentStatus);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["foodBookings"] }),
  });
}
