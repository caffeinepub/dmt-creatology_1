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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useAllCateringVendors,
  useCreateCateringVendor,
  useDeleteCateringVendor,
  useUpdateCateringVendor,
} from "@/hooks/useCateringQueries";
import { Loader2, Pencil, Plus, Trash2, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { CateringVendor } from "../../backend.d";

// ── Form State ────────────────────────────────────────────────────────────────

interface CateringFormState {
  name: string;
  city: string;
  cuisineType: string;
  pricePerPlate: string;
  minimumGuests: string;
  photoUrls: string;
  description: string;
}

function makeEmptyForm(): CateringFormState {
  return {
    name: "",
    city: "",
    cuisineType: "",
    pricePerPlate: "",
    minimumGuests: "",
    photoUrls: "",
    description: "",
  };
}

function vendorToForm(vendor: CateringVendor): CateringFormState {
  return {
    name: vendor.name,
    city: vendor.city,
    cuisineType: vendor.cuisineType,
    pricePerPlate: String(Number(vendor.pricePerPlate)),
    minimumGuests: String(Number(vendor.minimumGuests)),
    photoUrls: vendor.photoUrls.join("\n"),
    description: vendor.description,
  };
}

function parseUrls(raw: string): string[] {
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

// ── Form Dialog ───────────────────────────────────────────────────────────────

function CateringFormDialog({
  open,
  mode,
  editVendor,
  onClose,
}: {
  open: boolean;
  mode: "add" | "edit";
  editVendor: CateringVendor | null;
  onClose: () => void;
}) {
  const createVendor = useCreateCateringVendor();
  const updateVendor = useUpdateCateringVendor();
  const isPending = createVendor.isPending || updateVendor.isPending;

  const [form, setForm] = useState<CateringFormState>(() =>
    editVendor ? vendorToForm(editVendor) : makeEmptyForm(),
  );

  const handleOpenChange = (o: boolean) => {
    if (!o) onClose();
  };

  const handleClose = () => {
    setForm(editVendor ? vendorToForm(editVendor) : makeEmptyForm());
    onClose();
  };

  const handleField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = Number(form.pricePerPlate);
    const minNum = Number(form.minimumGuests);
    if (
      !form.name.trim() ||
      !form.city.trim() ||
      !form.cuisineType.trim() ||
      Number.isNaN(priceNum) ||
      priceNum <= 0 ||
      Number.isNaN(minNum) ||
      minNum <= 0
    ) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      city: form.city.trim(),
      cuisineType: form.cuisineType.trim(),
      pricePerPlate: BigInt(Math.round(priceNum)),
      minimumGuests: BigInt(Math.round(minNum)),
      photoUrls: parseUrls(form.photoUrls),
      description: form.description.trim(),
    };

    try {
      if (mode === "add") {
        await createVendor.mutateAsync(payload);
        toast.success("Catering vendor added successfully.");
      } else if (editVendor) {
        await updateVendor.mutateAsync({ id: editVendor.id, ...payload });
        toast.success("Catering vendor updated.");
      }
      handleClose();
    } catch {
      toast.error("Failed to save. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-lg bg-slate-900 border-slate-700 text-white max-h-[90vh] overflow-y-auto"
        data-ocid={`admin-catering.${mode}.dialog`}
      >
        <DialogHeader>
          <DialogTitle className="text-white font-display text-xl">
            {mode === "add" ? "Add Catering Vendor" : "Edit Catering Vendor"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label className="text-slate-300 text-sm">
                Business Name <span className="text-red-400">*</span>
              </Label>
              <Input
                name="name"
                value={form.name}
                onChange={handleField}
                placeholder="e.g. Royal Feast Caterers"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600"
                data-ocid="admin-catering.form.name.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">
                City <span className="text-red-400">*</span>
              </Label>
              <Input
                name="city"
                value={form.city}
                onChange={handleField}
                placeholder="e.g. Mumbai"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600"
                data-ocid="admin-catering.form.city.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">
                Cuisine Type <span className="text-red-400">*</span>
              </Label>
              <Input
                name="cuisineType"
                value={form.cuisineType}
                onChange={handleField}
                placeholder="e.g. North Indian, Mughlai"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600"
                data-ocid="admin-catering.form.cuisine.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">
                Price per Plate (₹) <span className="text-red-400">*</span>
              </Label>
              <Input
                name="pricePerPlate"
                type="number"
                min="1"
                value={form.pricePerPlate}
                onChange={handleField}
                placeholder="e.g. 850"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600"
                data-ocid="admin-catering.form.price.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">
                Minimum Guests <span className="text-red-400">*</span>
              </Label>
              <Input
                name="minimumGuests"
                type="number"
                min="1"
                value={form.minimumGuests}
                onChange={handleField}
                placeholder="e.g. 50"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600"
                data-ocid="admin-catering.form.min-guests.input"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-slate-300 text-sm">
              Photo URLs <span className="text-slate-500">(one per line)</span>
            </Label>
            <Textarea
              name="photoUrls"
              value={form.photoUrls}
              onChange={handleField}
              placeholder="https://example.com/photo1.jpg
https://example.com/photo2.jpg"
              rows={3}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 resize-none"
              data-ocid="admin-catering.form.photos.textarea"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-slate-300 text-sm">Description</Label>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleField}
              placeholder="Describe the catering service, specialties, experience..."
              rows={3}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 resize-none"
              data-ocid="admin-catering.form.description.textarea"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="text-slate-400 hover:text-white"
              data-ocid="admin-catering.form.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
              data-ocid="admin-catering.form.save_button"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {mode === "add" ? "Add Vendor" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminCateringPage() {
  const { data: vendors, isLoading } = useAllCateringVendors();
  const deleteVendor = useDeleteCateringVendor();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [editVendor, setEditVendor] = useState<CateringVendor | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<bigint | null>(null);

  const deleteVendorName =
    vendors?.find((v) => v.id === deleteConfirmId)?.name ?? "";

  const handleAdd = () => {
    setEditVendor(null);
    setDialogMode("add");
    setDialogOpen(true);
  };

  const handleEdit = (vendor: CateringVendor) => {
    setEditVendor(vendor);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (deleteConfirmId === null) return;
    try {
      await deleteVendor.mutateAsync(deleteConfirmId);
      toast.success("Catering vendor deleted.");
    } catch {
      toast.error("Failed to delete vendor.");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6" data-ocid="admin-catering.page">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-white font-display font-bold text-2xl">
            Catering Management
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Manage catering vendors visible on the /food page
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-2"
          data-ocid="admin-catering.add.primary_button"
        >
          <Plus size={16} />
          Add Vendor
        </Button>
      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        {isLoading ? (
          <div
            className="space-y-2 p-4"
            data-ocid="admin-catering.loading_state"
          >
            {[1, 2, 3, 4, 5].map((k) => (
              <Skeleton key={k} className="h-12 w-full bg-slate-800/50" />
            ))}
          </div>
        ) : !vendors?.length ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
            data-ocid="admin-catering.empty_state"
          >
            <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mb-4">
              <UtensilsCrossed size={24} className="text-slate-600" />
            </div>
            <p className="text-slate-400 font-medium">
              No catering vendors yet
            </p>
            <p className="text-slate-600 text-sm mt-1">
              Add your first catering vendor to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table data-ocid="admin-catering.table">
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400 text-xs uppercase tracking-wider font-medium min-w-[160px]">
                    Business Name
                  </TableHead>
                  <TableHead className="text-slate-400 text-xs uppercase tracking-wider font-medium">
                    City
                  </TableHead>
                  <TableHead className="text-slate-400 text-xs uppercase tracking-wider font-medium">
                    Cuisine Type
                  </TableHead>
                  <TableHead className="text-slate-400 text-xs uppercase tracking-wider font-medium">
                    Price/Plate
                  </TableHead>
                  <TableHead className="text-slate-400 text-xs uppercase tracking-wider font-medium">
                    Min Guests
                  </TableHead>
                  <TableHead className="text-slate-400 text-xs uppercase tracking-wider font-medium w-24">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((vendor, index) => (
                  <TableRow
                    key={String(vendor.id)}
                    className="border-slate-800 hover:bg-slate-800/40 transition-colors"
                    data-ocid={`admin-catering.item.${index + 1}`}
                  >
                    <TableCell>
                      <p className="text-white font-medium text-sm">
                        {vendor.name}
                      </p>
                      {vendor.description && (
                        <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">
                          {vendor.description}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-slate-300 text-sm">
                        {vendor.city}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-red-500/30 text-red-400 text-xs"
                      >
                        {vendor.cuisineType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-white font-semibold text-sm">
                        ₹{Number(vendor.pricePerPlate).toLocaleString("en-IN")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-slate-300 text-sm">
                        {Number(vendor.minimumGuests).toLocaleString("en-IN")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(vendor)}
                          className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700"
                          data-ocid={`admin-catering.edit_button.${index + 1}`}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setDeleteConfirmId(vendor.id)}
                          className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                          data-ocid={`admin-catering.delete_button.${index + 1}`}
                        >
                          <Trash2 size={14} />
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

      {/* Add/Edit Dialog */}
      {dialogOpen && (
        <CateringFormDialog
          open={dialogOpen}
          mode={dialogMode}
          editVendor={editVendor}
          onClose={() => {
            setDialogOpen(false);
            setEditVendor(null);
          }}
        />
      )}

      {/* Delete Confirm Dialog */}
      <Dialog
        open={deleteConfirmId !== null}
        onOpenChange={(o) => !o && setDeleteConfirmId(null)}
      >
        <DialogContent
          className="sm:max-w-sm bg-slate-900 border-slate-700 text-white"
          data-ocid="admin-catering.delete.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-white">Delete Vendor?</DialogTitle>
          </DialogHeader>
          <p className="text-slate-400 text-sm">
            Are you sure you want to delete{" "}
            <span className="text-white font-semibold">{deleteVendorName}</span>
            ? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDeleteConfirmId(null)}
              className="text-slate-400 hover:text-white"
              data-ocid="admin-catering.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteVendor.isPending}
              onClick={handleDelete}
              data-ocid="admin-catering.delete.confirm_button"
            >
              {deleteVendor.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
