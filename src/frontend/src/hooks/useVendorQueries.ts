import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ServiceListingInput } from "../backend.d";
import { useActor } from "./useActor";

// ApplicationStatus type matching backend Motoko type
export type ApplicationStatus = "pending" | "approved" | "rejected";

// ── Public: Approved Vendors ───────────────────────────────────────────────

export function useApprovedVendors() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["approvedVendors"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getApprovedVendors();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── My Vendor Application ──────────────────────────────────────────────────

export function useMyVendorApplication() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["myVendorApplication"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyVendorApplication();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Submit Vendor Application ──────────────────────────────────────────────

export function useSubmitVendorApplication() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      businessName: string;
      ownerName: string;
      city: string;
      serviceCategory: string;
      description: string;
      phone: string;
      email: string;
      portfolioImages: string[];
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitVendorApplication(
        data.businessName,
        data.ownerName,
        data.city,
        data.serviceCategory,
        data.description,
        data.phone,
        data.email,
        data.portfolioImages,
      );
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["myVendorApplication"] }),
  });
}

// ── Update My Vendor Application ───────────────────────────────────────────

export function useUpdateMyVendorApplication() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      businessName: string;
      ownerName: string;
      city: string;
      serviceCategory: string;
      description: string;
      phone: string;
      email: string;
      portfolioImages: string[];
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateMyVendorApplication(
        data.businessName,
        data.ownerName,
        data.city,
        data.serviceCategory,
        data.description,
        data.phone,
        data.email,
        data.portfolioImages,
      );
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["myVendorApplication"] }),
  });
}

// ── All Vendor Applications (Admin) ───────────────────────────────────────

export function useAllVendorApplications() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["vendorApplications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVendorApplications();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Review Vendor Application (Admin) ─────────────────────────────────────

export function useReviewVendorApplication() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: bigint;
      status: ApplicationStatus;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.reviewVendorApplication(id, status as never);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendorApplications"] });
      qc.invalidateQueries({ queryKey: ["approvedVendors"] });
    },
  });
}

// ── My Service Listings ────────────────────────────────────────────────────

export function useMyServiceListings() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["myServiceListings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyServiceListings();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Add Service Listing ────────────────────────────────────────────────────

export function useAddServiceListing() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ServiceListingInput) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addServiceListing(input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myServiceListings"] }),
  });
}

// ── Update Service Listing ─────────────────────────────────────────────────

export function useUpdateServiceListing() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: bigint;
      input: ServiceListingInput;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateServiceListing(id, input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myServiceListings"] }),
  });
}

// ── Delete Service Listing ─────────────────────────────────────────────────

export function useDeleteServiceListing() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteServiceListing(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myServiceListings"] }),
  });
}

// ── Vendor Bookings ────────────────────────────────────────────────────────

export function useVendorBookings() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["vendorBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBookingsForMyVendor();
    },
    enabled: !!actor && !isFetching,
  });
}
