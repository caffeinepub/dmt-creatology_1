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
  useAllVenues,
  useCreateVenue,
  useDeleteVenue,
  useUpdateVenue,
} from "@/hooks/useVenueQueries";
import { Building2, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Venue } from "../../backend.d";

// ── Form State ────────────────────────────────────────────────────────────────

interface VenueFormState {
  name: string;
  city: string;
  capacity: string;
  pricePerDay: string;
  photoUrls: string;
  amenities: string;
  description: string;
}

function makeEmptyForm(): VenueFormState {
  return {
    name: "",
    city: "",
    capacity: "",
    pricePerDay: "",
    photoUrls: "",
    amenities: "",
    description: "",
  };
}

function venueToForm(venue: Venue): VenueFormState {
  return {
    name: venue.name,
    city: venue.city,
    capacity: String(Number(venue.capacity)),
    pricePerDay: String(Number(venue.pricePerDay)),
    photoUrls: venue.photoUrls.join("\n"),
    amenities: venue.amenities.join(", "),
    description: venue.description,
  };
}

function parseList(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseUrls(raw: string): string[] {
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

// ── Form Dialog ───────────────────────────────────────────────────────────────

function VenueFormDialog({
  open,
  mode,
  editVenue,
  onClose,
}: {
  open: boolean;
  mode: "add" | "edit";
  editVenue: Venue | null;
  onClose: () => void;
}) {
  const createVenue = useCreateVenue();
  const updateVenue = useUpdateVenue();
  const isPending = createVenue.isPending || updateVenue.isPending;

  const [form, setForm] = useState<VenueFormState>(() =>
    editVenue ? venueToForm(editVenue) : makeEmptyForm(),
  );

  const handleOpenChange = (o: boolean) => {
    if (!o) onClose();
  };

  const handleClose = () => {
    setForm(editVenue ? venueToForm(editVenue) : makeEmptyForm());
    onClose();
  };

  const handleField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      city: form.city.trim(),
      capacity: BigInt(Math.max(0, Math.round(Number(form.capacity) || 0))),
      pricePerDay: BigInt(
        Math.max(0, Math.round(Number(form.pricePerDay) || 0)),
      ),
      photoUrls: parseUrls(form.photoUrls),
      amenities: parseList(form.amenities),
      description: form.description.trim(),
    };

    try {
      if (mode === "edit" && editVenue) {
        await updateVenue.mutateAsync({ id: editVenue.id, ...payload });
        toast.success("Venue updated successfully");
      } else {
        await createVenue.mutateAsync(payload);
        toast.success("Venue added successfully");
      }
      handleClose();
    } catch {
      toast.error(
        mode === "edit" ? "Failed to update venue" : "Failed to add venue",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="bg-slate-900 border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto"
        data-ocid="admin-venues.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-white font-display text-xl">
            {mode === "edit" ? "Edit Venue" : "Add Venue"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-slate-300 text-sm">Venue Name *</Label>
              <Input
                name="name"
                value={form.name}
                onChange={handleField}
                placeholder="e.g. Grand Ballroom Mumbai"
                required
                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500"
                data-ocid="admin-venues.name.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">City *</Label>
              <Input
                name="city"
                value={form.city}
                onChange={handleField}
                placeholder="e.g. Mumbai"
                required
                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500"
                data-ocid="admin-venues.city.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Capacity *</Label>
              <Input
                name="capacity"
                type="number"
                min={0}
                value={form.capacity}
                onChange={handleField}
                placeholder="e.g. 500"
                required
                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500"
                data-ocid="admin-venues.capacity.input"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-slate-300 text-sm">
                Price per Day (₹) *
              </Label>
              <Input
                name="pricePerDay"
                type="number"
                min={0}
                value={form.pricePerDay}
                onChange={handleField}
                placeholder="e.g. 50000"
                required
                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500"
                data-ocid="admin-venues.price.input"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-slate-300 text-sm">Description</Label>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleField}
                placeholder="Describe the venue..."
                rows={3}
                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500 resize-none"
                data-ocid="admin-venues.description.textarea"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-slate-300 text-sm">
              Amenities{" "}
              <span className="text-slate-500 font-normal">
                (comma-separated)
              </span>
            </Label>
            <Input
              name="amenities"
              value={form.amenities}
              onChange={handleField}
              placeholder="AC, Stage, Catering, DJ System, Parking"
              className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500"
              data-ocid="admin-venues.amenities.input"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-slate-300 text-sm">
              Photo URLs{" "}
              <span className="text-slate-500 font-normal">(one per line)</span>
            </Label>
            <Textarea
              name="photoUrls"
              value={form.photoUrls}
              onChange={handleField}
              placeholder={
                "https://example.com/photo1.jpg\nhttps://example.com/photo2.jpg"
              }
              rows={3}
              className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500 resize-none font-mono text-xs"
              data-ocid="admin-venues.photos.textarea"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="text-slate-400 hover:text-white"
              data-ocid="admin-venues.cancel.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-gold text-slate-950 hover:bg-gold/90 font-semibold"
              data-ocid="admin-venues.save.submit_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "edit" ? "Saving..." : "Adding..."}
                </>
              ) : mode === "edit" ? (
                "Save Changes"
              ) : (
                "Add Venue"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminVenuesPage() {
  const { data: venues, isLoading } = useAllVenues();
  const deleteVenue = useDeleteVenue();

  const [dialogMode, setDialogMode] = useState<"add" | "edit" | null>(null);
  const [editVenue, setEditVenue] = useState<Venue | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<bigint | null>(null);
  const [deleteVenueName, setDeleteVenueName] = useState("");

  const openAdd = () => {
    setEditVenue(null);
    setDialogMode("add");
  };

  const openEdit = (venue: Venue) => {
    setEditVenue(venue);
    setDialogMode("edit");
  };

  const openDeleteConfirm = (venue: Venue) => {
    setDeleteConfirmId(venue.id);
    setDeleteVenueName(venue.name);
  };

  const handleDelete = async () => {
    if (deleteConfirmId === null) return;
    try {
      await deleteVenue.mutateAsync(deleteConfirmId);
      toast.success("Venue deleted");
      setDeleteConfirmId(null);
    } catch {
      toast.error("Failed to delete venue");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6" data-ocid="admin-venues.page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white font-display font-bold text-2xl tracking-tight">
            Venues Management
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Add, edit, and manage venue listings on the public website
          </p>
        </div>
        <Button
          onClick={openAdd}
          className="bg-gold text-slate-950 hover:bg-gold/90 font-semibold"
          data-ocid="admin-venues.add.open_modal_button"
        >
          <Plus size={16} className="mr-1.5" />
          Add Venue
        </Button>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3" data-ocid="admin-venues.loading_state">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full bg-slate-800" />
            ))}
          </div>
        ) : !venues?.length ? (
          <div
            className="text-center py-16 text-slate-500"
            data-ocid="admin-venues.empty_state"
          >
            <Building2 className="w-10 h-10 mx-auto mb-3 text-slate-700" />
            <p className="font-display text-base font-semibold text-slate-400 mb-1">
              No venues yet
            </p>
            <p className="text-sm">
              Click "Add Venue" to add your first venue listing.
            </p>
          </div>
        ) : (
          <Table data-ocid="admin-venues.table">
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-slate-400 text-xs">
                  Venue Name
                </TableHead>
                <TableHead className="text-slate-400 text-xs">City</TableHead>
                <TableHead className="text-slate-400 text-xs">
                  Capacity
                </TableHead>
                <TableHead className="text-slate-400 text-xs">
                  Price/Day
                </TableHead>
                <TableHead className="text-slate-400 text-xs">
                  Amenities
                </TableHead>
                <TableHead className="text-slate-400 text-xs text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {venues.map((venue, i) => (
                <TableRow
                  key={String(venue.id)}
                  className="border-white/5 hover:bg-white/3"
                  data-ocid={`admin-venues.item.${i + 1}`}
                >
                  <TableCell className="text-white text-sm font-medium max-w-[180px]">
                    <div className="truncate">{venue.name}</div>
                  </TableCell>
                  <TableCell className="text-slate-300 text-sm">
                    {venue.city}
                  </TableCell>
                  <TableCell className="text-slate-300 text-sm">
                    {Number(venue.capacity).toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-gold text-sm font-semibold">
                    ₹{Number(venue.pricePerDay).toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm max-w-[180px]">
                    <div className="flex flex-wrap gap-1">
                      {venue.amenities.slice(0, 3).map((a) => (
                        <Badge
                          key={a}
                          variant="outline"
                          className="border-white/10 text-slate-400 text-[10px] px-1.5 py-0"
                        >
                          {a}
                        </Badge>
                      ))}
                      {venue.amenities.length > 3 && (
                        <Badge
                          variant="outline"
                          className="border-white/10 text-slate-500 text-[10px] px-1.5 py-0"
                        >
                          +{venue.amenities.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(venue)}
                        className="text-slate-400 hover:text-gold hover:bg-gold/10 h-7 w-7 p-0"
                        data-ocid={`admin-venues.edit_button.${i + 1}`}
                      >
                        <Pencil size={13} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteConfirm(venue)}
                        className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 h-7 w-7 p-0"
                        data-ocid={`admin-venues.delete_button.${i + 1}`}
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add / Edit Dialog */}
      {dialogMode !== null && (
        <VenueFormDialog
          open={dialogMode !== null}
          mode={dialogMode}
          editVenue={editVenue}
          onClose={() => setDialogMode(null)}
        />
      )}

      {/* Delete Confirm Dialog */}
      <Dialog
        open={deleteConfirmId !== null}
        onOpenChange={(o) => !o && setDeleteConfirmId(null)}
      >
        <DialogContent
          className="bg-slate-900 border-white/10 text-white max-w-sm"
          data-ocid="admin-venues.delete.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-white font-display">
              Delete Venue?
            </DialogTitle>
          </DialogHeader>
          <p className="text-slate-400 text-sm">
            Are you sure you want to delete{" "}
            <span className="text-white font-semibold">{deleteVenueName}</span>?
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDeleteConfirmId(null)}
              className="text-slate-400 hover:text-white"
              data-ocid="admin-venues.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteVenue.isPending}
              onClick={handleDelete}
              data-ocid="admin-venues.delete.confirm_button"
            >
              {deleteVenue.isPending ? (
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
