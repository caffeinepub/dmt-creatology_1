import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useAddServiceListing,
  useDeleteServiceListing,
  useMyServiceListings,
  useMyVendorApplication,
  useUpdateMyVendorApplication,
  useUpdateServiceListing,
  useVendorBookings,
} from "@/hooks/useVendorQueries";
import {
  BookOpen,
  Briefcase,
  Edit2,
  Loader2,
  LogOut,
  Package,
  Plus,
  Store,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
// ServiceListing type - defined locally since it was removed from the reduced backend.d.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ServiceListing = any;

const SERVICE_CATEGORIES = [
  "Photographer",
  "Makeup Artist",
  "Decorator",
  "Caterer",
  "DJ",
  "Band",
  "Wedding Planner",
  "Sound & Lighting",
  "Transport",
  "Other",
];

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 6) return phone;
  return `${digits.slice(0, 2)}XXXX${digits.slice(-4)}`;
}

function formatDate(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ── Profile Edit Form ──────────────────────────────────────────────────────

interface ProfileFormData {
  businessName: string;
  ownerName: string;
  city: string;
  serviceCategory: string;
  description: string;
  phone: string;
  email: string;
  portfolioImages: string[];
}

function ProfileEditForm({
  initial,
  onSave,
  isSaving,
  disabled,
}: {
  initial: ProfileFormData;
  onSave: (data: ProfileFormData) => void;
  isSaving: boolean;
  disabled?: boolean;
}) {
  const [form, setForm] = useState<ProfileFormData>(initial);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (index: number, value: string) => {
    setForm((prev) => {
      const images = [...prev.portfolioImages];
      images[index] = value;
      return { ...prev, portfolioImages: images };
    });
  };

  return (
    <div className="space-y-4" data-ocid="vendor.profile.panel">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-slate-300 text-sm">Business Name</Label>
          <Input
            name="businessName"
            value={form.businessName}
            onChange={handleChange}
            disabled={disabled}
            className="bg-slate-900 border-white/15 text-white"
            data-ocid="vendor.profile.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-slate-300 text-sm">Owner Name</Label>
          <Input
            name="ownerName"
            value={form.ownerName}
            onChange={handleChange}
            disabled={disabled}
            className="bg-slate-900 border-white/15 text-white"
            data-ocid="vendor.profile.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-slate-300 text-sm">City</Label>
          <Input
            name="city"
            value={form.city}
            onChange={handleChange}
            disabled={disabled}
            className="bg-slate-900 border-white/15 text-white"
            data-ocid="vendor.profile.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-slate-300 text-sm">Service Category</Label>
          <Select
            value={form.serviceCategory}
            onValueChange={(val) =>
              setForm((prev) => ({ ...prev, serviceCategory: val }))
            }
            disabled={disabled}
          >
            <SelectTrigger
              className="bg-slate-900 border-white/15 text-white"
              data-ocid="vendor.profile.select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/15">
              {SERVICE_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat} className="text-white">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-slate-300 text-sm">Phone</Label>
          <Input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            disabled={disabled}
            className="bg-slate-900 border-white/15 text-white"
            data-ocid="vendor.profile.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-slate-300 text-sm">Email</Label>
          <Input
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={disabled}
            type="email"
            className="bg-slate-900 border-white/15 text-white"
            data-ocid="vendor.profile.input"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-slate-300 text-sm">Description</Label>
        <Textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          disabled={disabled}
          rows={3}
          className="bg-slate-900 border-white/15 text-white resize-none"
          data-ocid="vendor.profile.textarea"
        />
      </div>
      {/* Portfolio images */}
      <div className="space-y-2">
        <Label className="text-slate-300 text-sm">Portfolio Image URLs</Label>
        {(["img1", "img2", "img3", "img4", "img5"] as const).map(
          (slot, idx) => (
            <Input
              key={slot}
              value={form.portfolioImages[idx]}
              onChange={(e) => handleImageChange(idx, e.target.value)}
              disabled={disabled}
              placeholder={`Portfolio Image ${idx + 1} URL`}
              className="bg-slate-900 border-white/15 text-white placeholder:text-slate-600"
              data-ocid="vendor.profile.input"
            />
          ),
        )}
      </div>
      {!disabled && (
        <Button
          onClick={() => onSave(form)}
          disabled={isSaving}
          className="gradient-gold text-[oklch(0.1_0.01_260)] font-bold"
          data-ocid="vendor.profile.save_button"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Profile"
          )}
        </Button>
      )}
    </div>
  );
}

// ── Service Listing Dialog ─────────────────────────────────────────────────

interface ServiceForm {
  title: string;
  category: string;
  description: string;
  price: string;
}

const emptyServiceForm: ServiceForm = {
  title: "",
  category: "",
  description: "",
  price: "",
};

function ServiceListingDialog({
  open,
  onClose,
  initial,
  onSave,
  isSaving,
  mode,
}: {
  open: boolean;
  onClose: () => void;
  initial?: ServiceForm;
  onSave: (data: ServiceForm) => void;
  isSaving: boolean;
  mode: "add" | "edit";
}) {
  const [form, setForm] = useState<ServiceForm>(initial ?? emptyServiceForm);

  useEffect(() => {
    if (open) {
      setForm(initial ?? emptyServiceForm);
    }
  }, [open, initial]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="bg-slate-900 border-white/15 text-white max-w-md"
        data-ocid="vendor.service.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-white font-display">
            {mode === "add" ? "Add Service Listing" : "Edit Service Listing"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-slate-300 text-sm">Title *</Label>
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Wedding Photography Package"
              className="bg-slate-800 border-white/15 text-white placeholder:text-slate-500"
              data-ocid="vendor.service.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-slate-300 text-sm">Category *</Label>
            <Select
              value={form.category}
              onValueChange={(val) =>
                setForm((prev) => ({ ...prev, category: val }))
              }
            >
              <SelectTrigger
                className="bg-slate-800 border-white/15 text-white"
                data-ocid="vendor.service.select"
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/15">
                {SERVICE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-white">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-slate-300 text-sm">Description *</Label>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe what's included..."
              className="bg-slate-800 border-white/15 text-white placeholder:text-slate-500 resize-none"
              data-ocid="vendor.service.textarea"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-slate-300 text-sm">Price (₹) *</Label>
            <Input
              name="price"
              value={form.price}
              onChange={handleChange}
              type="number"
              min="0"
              placeholder="e.g. 25000"
              className="bg-slate-800 border-white/15 text-white placeholder:text-slate-500"
              data-ocid="vendor.service.input"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
            data-ocid="vendor.service.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onSave(form)}
            disabled={
              isSaving ||
              !form.title ||
              !form.category ||
              !form.description ||
              !form.price
            }
            className="gradient-gold text-[oklch(0.1_0.01_260)] font-bold"
            data-ocid="vendor.service.save_button"
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {mode === "add" ? "Add Listing" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Delete Confirmation Dialog ─────────────────────────────────────────────

function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  isDeleting,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="bg-slate-900 border-white/15 text-white max-w-sm"
        data-ocid="vendor.service.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-white font-display">
            Delete Service Listing?
          </DialogTitle>
        </DialogHeader>
        <p className="text-slate-400 text-sm py-2">
          This action cannot be undone. The listing will be permanently removed.
        </p>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
            data-ocid="vendor.service.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-500/80 hover:bg-red-500 text-white font-bold"
            data-ocid="vendor.service.delete_button"
          >
            {isDeleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Dashboard Component ───────────────────────────────────────────────

export default function VendorDashboardPage() {
  const { identity, clear, isInitializing } = useInternetIdentity();
  const { data: application, isLoading: appLoading } = useMyVendorApplication();
  const { data: serviceListings, isLoading: listingsLoading } =
    useMyServiceListings();
  const { data: bookings, isLoading: bookingsLoading } = useVendorBookings();
  const updateApp = useUpdateMyVendorApplication();
  const addService = useAddServiceListing();
  const updateService = useUpdateServiceListing();
  const deleteService = useDeleteServiceListing();

  // Service dialog state
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [serviceDialogMode, setServiceDialogMode] = useState<"add" | "edit">(
    "add",
  );
  const [editingListing, setEditingListing] = useState<ServiceListing | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isInitializing && !identity) {
      window.location.href = "/vendor/login";
    }
  }, [identity, isInitializing]);

  if (isInitializing || !identity) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="text-gold animate-spin" size={32} />
      </div>
    );
  }

  const principalShort = `${identity.getPrincipal().toString().slice(0, 12)}...`;

  const handleLogout = () => {
    clear();
    window.location.href = "/vendor/login";
  };

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSaveProfile = async (data: ProfileFormData) => {
    try {
      await updateApp.mutateAsync({
        businessName: data.businessName,
        ownerName: data.ownerName,
        city: data.city,
        serviceCategory: data.serviceCategory,
        description: data.description,
        phone: data.phone,
        email: data.email,
        portfolioImages: data.portfolioImages.filter(
          (img) => img.trim() !== "",
        ),
      });
      toast.success("Profile updated successfully");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to update profile";
      toast.error(msg);
    }
  };

  const handleAddService = async (data: ServiceForm) => {
    try {
      await addService.mutateAsync({
        title: data.title,
        category: data.category,
        description: data.description,
        price: BigInt(data.price),
      });
      setServiceDialogOpen(false);
      toast.success("Service listing added");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to add listing";
      toast.error(msg);
    }
  };

  const handleUpdateService = async (data: ServiceForm) => {
    if (!editingListing) return;
    try {
      await updateService.mutateAsync({
        id: editingListing.id,
        input: {
          title: data.title,
          category: data.category,
          description: data.description,
          price: BigInt(data.price),
        },
      });
      setServiceDialogOpen(false);
      setEditingListing(null);
      toast.success("Service listing updated");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to update listing";
      toast.error(msg);
    }
  };

  const handleDeleteService = async () => {
    if (!deletingId) return;
    try {
      await deleteService.mutateAsync(deletingId);
      setDeleteDialogOpen(false);
      setDeletingId(null);
      toast.success("Service listing deleted");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to delete listing";
      toast.error(msg);
    }
  };

  const openEditService = (listing: ServiceListing) => {
    setEditingListing(listing);
    setServiceDialogMode("edit");
    setServiceDialogOpen(true);
  };

  const openDeleteService = (id: bigint) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  // ── Loading ────────────────────────────────────────────────────────────────

  if (appLoading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="p-8 space-y-4">
          <Skeleton className="h-12 w-64 bg-slate-800" />
          <Skeleton className="h-48 w-full bg-slate-800" />
        </div>
      </div>
    );
  }

  // ── No Application ────────────────────────────────────────────────────────

  if (!application) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        {/* Header */}
        <header className="bg-slate-900 border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
              <Store className="text-gold" size={16} />
            </div>
            <span className="text-white font-display font-bold text-base">
              Vendor Dashboard
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-slate-500 font-mono bg-white/5 px-2.5 py-1 rounded-full">
              {principalShort}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-xs"
              data-ocid="vendor.logout_button"
            >
              <LogOut size={14} className="mr-1.5" />
              Sign out
            </Button>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-8">
          <div
            className="max-w-md w-full text-center bg-card border border-white/10 rounded-2xl p-10"
            data-ocid="vendor.dashboard.panel"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 mb-5">
              <Store className="text-gold" size={28} />
            </div>
            <h2 className="text-white font-display font-bold text-xl mb-2">
              You haven't registered as a vendor yet
            </h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Submit your business profile to get listed on the DMT CREATOLOGY
              marketplace. Our team will review your application within 2–3
              business days.
            </p>
            <a href="/vendor/register">
              <Button
                className="gradient-gold text-[oklch(0.1_0.01_260)] font-bold px-8"
                data-ocid="vendor.register.primary_button"
              >
                Register as Vendor
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ── Pending / Rejected ────────────────────────────────────────────────────

  if (application.status !== "approved") {
    const isPending = application.status === "pending";
    const profileData: ProfileFormData = {
      businessName: application.businessName,
      ownerName: application.ownerName,
      city: application.city,
      serviceCategory: application.serviceCategory,
      description: application.description,
      phone: application.phone,
      email: application.email,
      portfolioImages: [
        ...application.portfolioImages,
        "",
        "",
        "",
        "",
        "",
      ].slice(0, 5),
    };

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        {/* Header */}
        <header className="bg-slate-900 border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
              <Store className="text-gold" size={16} />
            </div>
            <span className="text-white font-display font-bold text-base">
              Vendor Dashboard
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-xs"
            data-ocid="vendor.logout_button"
          >
            <LogOut size={14} className="mr-1.5" />
            Sign out
          </Button>
        </header>

        <div className="flex-1 p-6 md:p-8 max-w-2xl mx-auto w-full space-y-6">
          {/* Status Card */}
          <div
            className={`rounded-xl border p-5 ${
              isPending
                ? "bg-amber-500/5 border-amber-500/20"
                : "bg-red-500/5 border-red-500/20"
            }`}
            data-ocid="vendor.application.panel"
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isPending
                    ? "bg-amber-500/10 border border-amber-500/20"
                    : "bg-red-500/10 border border-red-500/20"
                }`}
              >
                <Briefcase
                  className={isPending ? "text-amber-400" : "text-red-400"}
                  size={18}
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-white font-display font-bold text-base">
                    Application Status
                  </h2>
                  <Badge
                    className={
                      isPending
                        ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                        : "bg-red-500/15 text-red-300 border-red-500/30"
                    }
                  >
                    {isPending ? "Under Review" : "Not Approved"}
                  </Badge>
                </div>
                <p
                  className={`text-sm ${isPending ? "text-amber-300/80" : "text-red-300/80"}`}
                >
                  {isPending
                    ? "Your application is under review. We'll notify you once a decision has been made."
                    : "Your application was not approved. Please update your profile and resubmit."}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Profile */}
          <div className="bg-card border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-display font-bold text-lg mb-5 flex items-center gap-2">
              <User size={18} className="text-gold" />
              {isPending ? "Your Application Details" : "Edit & Resubmit"}
            </h3>
            <ProfileEditForm
              initial={profileData}
              onSave={handleSaveProfile}
              isSaving={updateApp.isPending}
              disabled={!isPending}
            />
            {!isPending && (
              <p className="text-red-400/70 text-xs mt-3">
                Editing is disabled for rejected applications. Contact support
                if you believe this is an error.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Approved: Full Dashboard ───────────────────────────────────────────────

  const profileData: ProfileFormData = {
    businessName: application.businessName,
    ownerName: application.ownerName,
    city: application.city,
    serviceCategory: application.serviceCategory,
    description: application.description,
    phone: application.phone,
    email: application.email,
    portfolioImages: [...application.portfolioImages, "", "", "", "", ""].slice(
      0,
      5,
    ),
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-white/10 px-4 md:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
            <Store className="text-gold" size={16} />
          </div>
          <div>
            <span className="text-white font-display font-bold text-base">
              {application.businessName}
            </span>
            <span className="hidden sm:inline ml-2 text-xs text-gold/70 bg-gold/10 border border-gold/20 px-2 py-0.5 rounded-full">
              {application.serviceCategory}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="hidden sm:flex bg-green-500/15 text-green-300 border-green-500/30">
            Approved
          </Badge>
          <span className="hidden md:block text-xs text-slate-500 font-mono bg-white/5 px-2.5 py-1 rounded-full">
            {principalShort}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-xs"
            data-ocid="vendor.logout_button"
          >
            <LogOut size={14} className="mr-1.5" />
            Sign out
          </Button>
        </div>
      </header>

      {/* Dashboard Tabs */}
      <div className="flex-1 p-4 md:p-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList
            className="bg-slate-900 border border-white/10 rounded-xl mb-6 h-auto p-1"
            data-ocid="vendor.dashboard.tab"
          >
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-gold/15 data-[state=active]:text-gold rounded-lg px-4 py-2 text-sm"
              data-ocid="vendor.profile.tab"
            >
              <User size={14} className="mr-1.5" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="data-[state=active]:bg-gold/15 data-[state=active]:text-gold rounded-lg px-4 py-2 text-sm"
              data-ocid="vendor.services.tab"
            >
              <Package size={14} className="mr-1.5" />
              My Services
            </TabsTrigger>
            <TabsTrigger
              value="bookings"
              className="data-[state=active]:bg-gold/15 data-[state=active]:text-gold rounded-lg px-4 py-2 text-sm"
              data-ocid="vendor.bookings.tab"
            >
              <BookOpen size={14} className="mr-1.5" />
              Booking Requests
            </TabsTrigger>
          </TabsList>

          {/* ── Profile Tab ── */}
          <TabsContent value="profile">
            <div className="max-w-2xl bg-card border border-white/10 rounded-2xl p-6">
              <h2 className="text-white font-display font-bold text-lg mb-5 flex items-center gap-2">
                <User size={18} className="text-gold" />
                Business Profile
              </h2>
              <ProfileEditForm
                initial={profileData}
                onSave={handleSaveProfile}
                isSaving={updateApp.isPending}
              />
            </div>
          </TabsContent>

          {/* ── Services Tab ── */}
          <TabsContent value="services">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-display font-bold text-lg">
                  Service Listings
                </h2>
                <Button
                  onClick={() => {
                    setServiceDialogMode("add");
                    setEditingListing(null);
                    setServiceDialogOpen(true);
                  }}
                  className="gradient-gold text-[oklch(0.1_0.01_260)] font-bold text-sm"
                  data-ocid="vendor.services.open_modal_button"
                >
                  <Plus size={14} className="mr-1.5" />
                  Add Service
                </Button>
              </div>

              {listingsLoading ? (
                <div
                  className="space-y-3"
                  data-ocid="vendor.services.loading_state"
                >
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full bg-slate-800" />
                  ))}
                </div>
              ) : !serviceListings?.length ? (
                <div
                  className="text-center py-16 bg-card border border-white/10 rounded-2xl"
                  data-ocid="vendor.services.empty_state"
                >
                  <Package className="mx-auto text-slate-600 mb-3" size={32} />
                  <p className="text-slate-400 font-semibold">
                    No service listings yet
                  </p>
                  <p className="text-slate-500 text-sm mt-1">
                    Add your first service to start receiving bookings.
                  </p>
                </div>
              ) : (
                <div className="bg-card border border-white/10 rounded-2xl overflow-hidden">
                  <Table data-ocid="vendor.services.table">
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-slate-400 text-xs">
                          Service
                        </TableHead>
                        <TableHead className="text-slate-400 text-xs">
                          Category
                        </TableHead>
                        <TableHead className="text-slate-400 text-xs">
                          Price
                        </TableHead>
                        <TableHead className="text-slate-400 text-xs text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {serviceListings.map((listing, i) => (
                        <TableRow
                          key={String(listing.id)}
                          className="border-white/5 hover:bg-white/3"
                          data-ocid={`vendor.services.item.${i + 1}`}
                        >
                          <TableCell>
                            <div className="text-white text-sm font-medium">
                              {listing.title}
                            </div>
                            <div className="text-slate-500 text-xs mt-0.5 line-clamp-1">
                              {listing.description}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-white/8 text-slate-300 border-white/10 text-xs">
                              {listing.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gold font-bold text-sm">
                            ₹{Number(listing.price).toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openEditService(listing)}
                                className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-white/10"
                                data-ocid={`vendor.services.edit_button.${i + 1}`}
                              >
                                <Edit2 size={13} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openDeleteService(listing.id)}
                                className="h-7 w-7 p-0 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                                data-ocid={`vendor.services.delete_button.${i + 1}`}
                              >
                                <Trash2 size={13} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── Bookings Tab ── */}
          <TabsContent value="bookings">
            <div className="space-y-4">
              <h2 className="text-white font-display font-bold text-lg">
                Booking Requests
              </h2>

              {bookingsLoading ? (
                <div
                  className="space-y-3"
                  data-ocid="vendor.bookings.loading_state"
                >
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full bg-slate-800" />
                  ))}
                </div>
              ) : !bookings?.length ? (
                <div
                  className="text-center py-16 bg-card border border-white/10 rounded-2xl"
                  data-ocid="vendor.bookings.empty_state"
                >
                  <BookOpen className="mx-auto text-slate-600 mb-3" size={32} />
                  <p className="text-slate-400 font-semibold">
                    No booking requests yet
                  </p>
                  <p className="text-slate-500 text-sm mt-1">
                    Bookings related to your services will appear here.
                  </p>
                </div>
              ) : (
                <div className="bg-card border border-white/10 rounded-2xl overflow-x-auto">
                  <Table data-ocid="vendor.bookings.table">
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-slate-400 text-xs">
                          Name
                        </TableHead>
                        <TableHead className="text-slate-400 text-xs">
                          Phone
                        </TableHead>
                        <TableHead className="text-slate-400 text-xs">
                          Service
                        </TableHead>
                        <TableHead className="text-slate-400 text-xs">
                          City
                        </TableHead>
                        <TableHead className="text-slate-400 text-xs">
                          Date
                        </TableHead>
                        <TableHead className="text-slate-400 text-xs">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking, i) => (
                        <TableRow
                          key={String(booking.id)}
                          className="border-white/5 hover:bg-white/3"
                          data-ocid={`vendor.bookings.item.${i + 1}`}
                        >
                          <TableCell className="text-white text-sm font-medium">
                            {booking.name}
                          </TableCell>
                          <TableCell className="text-slate-400 text-sm font-mono">
                            {maskPhone(booking.phone)}
                          </TableCell>
                          <TableCell className="text-slate-300 text-sm">
                            {booking.serviceType}
                          </TableCell>
                          <TableCell className="text-slate-400 text-sm">
                            {booking.city}
                          </TableCell>
                          <TableCell className="text-slate-400 text-sm">
                            {formatDate(booking.date)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                booking.status === "confirmed"
                                  ? "bg-green-500/15 text-green-300 border-green-500/30"
                                  : booking.status === "cancelled"
                                    ? "bg-red-500/15 text-red-300 border-red-500/30"
                                    : booking.status === "reviewed"
                                      ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
                                      : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                              }
                            >
                              {String(booking.status).charAt(0).toUpperCase() +
                                String(booking.status).slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Service Listing Dialogs */}
      <ServiceListingDialog
        open={serviceDialogOpen}
        onClose={() => {
          setServiceDialogOpen(false);
          setEditingListing(null);
        }}
        initial={
          editingListing
            ? {
                title: editingListing.title,
                category: editingListing.category,
                description: editingListing.description,
                price: String(editingListing.price),
              }
            : undefined
        }
        onSave={
          serviceDialogMode === "add" ? handleAddService : handleUpdateService
        }
        isSaving={addService.isPending || updateService.isPending}
        mode={serviceDialogMode}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeletingId(null);
        }}
        onConfirm={handleDeleteService}
        isDeleting={deleteService.isPending}
      />
    </div>
  );
}
