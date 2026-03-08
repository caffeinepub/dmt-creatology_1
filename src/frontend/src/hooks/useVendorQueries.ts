import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// ServiceListingInput type - defined locally since it was removed from the reduced backend.d.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ServiceListingInput = any;
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).getPublicApprovedVendors();
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).getMyVendorApplication();
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).submitVendorApplication(
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).updateMyVendorApplication(
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).getAllVendorApplications();
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).reviewVendorApplication(id, status as never);
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).getMyServiceListings();
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).addServiceListing(input);
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).updateServiceListing(id, input);
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).deleteServiceListing(id);
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).getBookingsForMyVendor();
    },
    enabled: !!actor && !isFetching,
  });
}
