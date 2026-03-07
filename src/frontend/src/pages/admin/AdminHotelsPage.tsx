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
  useAllHotels,
  useCreateHotel,
  useDeleteHotel,
  useUpdateHotel,
} from "@/hooks/useAdminQueries";
import { Building2, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Hotel, RoomType } from "../../backend.d";

// ── Types ────────────────────────────────────────────────────────────────────

let _rowIdCounter = 0;
function nextRowId() {
  _rowIdCounter += 1;
  return _rowIdCounter;
}

interface RoomTypeRow {
  uid: number;
  name: string;
  price: string;
}

interface HotelFormState {
  name: string;
  city: string;
  address: string;
  description: string;
  amenities: string;
  photoUrls: string;
  roomTypes: RoomTypeRow[];
}

function makeEmptyRow(): RoomTypeRow {
  return { uid: nextRowId(), name: "", price: "" };
}

function makeEmptyForm(): HotelFormState {
  return {
    name: "",
    city: "",
    address: "",
    description: "",
    amenities: "",
    photoUrls: "",
    roomTypes: [makeEmptyRow()],
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getStartingPrice(hotel: Hotel): string {
  if (!hotel.roomTypes.length) return "Price on request";
  const prices = hotel.roomTypes.map((rt) => Number(rt.pricePerNight));
  const min = Math.min(...prices);
  return `₹${min.toLocaleString("en-IN")}/night`;
}

function hotelToForm(hotel: Hotel): HotelFormState {
  return {
    name: hotel.name,
    city: hotel.city,
    address: hotel.address,
    description: hotel.description,
    amenities: hotel.amenities.join(", "),
    photoUrls: hotel.photoUrls.join("\n"),
    roomTypes: hotel.roomTypes.length
      ? hotel.roomTypes.map((rt) => ({
          uid: nextRowId(),
          name: rt.name,
          price: String(Number(rt.pricePerNight)),
        }))
      : [makeEmptyRow()],
  };
}

function formToRoomTypes(rows: RoomTypeRow[]): RoomType[] {
  return rows
    .filter((r) => r.name.trim())
    .map((r) => ({
      name: r.name.trim(),
      pricePerNight: BigInt(Math.max(0, Math.round(Number(r.price) || 0))),
    }));
}

function formToAmenities(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function formToPhotoUrls(raw: string): string[] {
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

// ── Hotel Form Dialog ─────────────────────────────────────────────────────────

function HotelFormDialog({
  open,
  mode,
  editHotel,
  onClose,
}: {
  open: boolean;
  mode: "add" | "edit";
  editHotel: Hotel | null;
  onClose: () => void;
}) {
  const createHotel = useCreateHotel();
  const updateHotel = useUpdateHotel();
  const isPending = createHotel.isPending || updateHotel.isPending;

  const [form, setForm] = useState<HotelFormState>(() =>
    editHotel ? hotelToForm(editHotel) : makeEmptyForm(),
  );

  // Reset form when dialog opens
  const handleOpenChange = (o: boolean) => {
    if (!o) onClose();
  };

  // Reset form and close dialog
  const handleClose = () => {
    setForm(editHotel ? hotelToForm(editHotel) : makeEmptyForm());
    onClose();
  };

  const handleField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoomTypeChange = (
    idx: number,
    field: "name" | "price",
    value: string,
  ) => {
    setForm((prev) => {
      const updated = prev.roomTypes.map((rt, i) =>
        i === idx ? { ...rt, [field]: value } : rt,
      );
      return { ...prev, roomTypes: updated };
    });
  };

  const addRoomType = () => {
    setForm((prev) => ({
      ...prev,
      roomTypes: [...prev.roomTypes, makeEmptyRow()],
    }));
  };

  const removeRoomType = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      roomTypes: prev.roomTypes.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      city: form.city.trim(),
      address: form.address.trim(),
      description: form.description.trim(),
      roomTypes: formToRoomTypes(form.roomTypes),
      amenities: formToAmenities(form.amenities),
      photoUrls: formToPhotoUrls(form.photoUrls),
    };

    try {
      if (mode === "edit" && editHotel) {
        await updateHotel.mutateAsync({ id: editHotel.id, ...payload });
        toast.success("Hotel updated successfully");
      } else {
        await createHotel.mutateAsync(payload);
        toast.success("Hotel added successfully");
      }
      handleClose();
    } catch {
      toast.error(
        mode === "edit" ? "Failed to update hotel" : "Failed to add hotel",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="bg-slate-900 border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto"
        data-ocid="admin.hotels.form.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-white font-display text-xl">
            {mode === "edit" ? "Edit Hotel" : "Add Hotel"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Basic fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-slate-300 text-sm">Hotel Name *</Label>
              <Input
                name="name"
                value={form.name}
                onChange={handleField}
                placeholder="e.g. The Grand Palace Mumbai"
                required
                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500"
                data-ocid="admin.hotels.form.name_input"
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
                data-ocid="admin.hotels.form.city_input"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Address *</Label>
              <Input
                name="address"
                value={form.address}
                onChange={handleField}
                placeholder="Street address"
                required
                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500"
                data-ocid="admin.hotels.form.address_input"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-slate-300 text-sm">Description</Label>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleField}
                placeholder="Hotel description..."
                rows={3}
                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500 resize-none"
                data-ocid="admin.hotels.form.description_textarea"
              />
            </div>
          </div>

          {/* Room Types */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-slate-300 text-sm font-semibold">
                Room Types
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addRoomType}
                className="text-gold hover:text-gold hover:bg-gold/10 h-7 px-2 text-xs gap-1"
                data-ocid="admin.hotels.form.add_room_type_button"
              >
                <Plus size={13} />
                Add Room Type
              </Button>
            </div>

            <div className="space-y-2">
              {form.roomTypes.map((rt, idx) => (
                <div
                  key={rt.uid}
                  className="flex items-center gap-2 p-2 bg-slate-800/60 rounded-lg border border-white/5"
                  data-ocid={`admin.hotels.form.room_type.${idx + 1}`}
                >
                  <Input
                    value={rt.name}
                    onChange={(e) =>
                      handleRoomTypeChange(idx, "name", e.target.value)
                    }
                    placeholder="Room type (e.g. Deluxe)"
                    className="bg-slate-700 border-white/10 text-white placeholder:text-slate-500 h-8 text-sm flex-1"
                    data-ocid={`admin.hotels.form.room_name_input.${idx + 1}`}
                  />
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 text-sm">₹</span>
                    <Input
                      type="number"
                      min={0}
                      value={rt.price}
                      onChange={(e) =>
                        handleRoomTypeChange(idx, "price", e.target.value)
                      }
                      placeholder="0"
                      className="bg-slate-700 border-white/10 text-white placeholder:text-slate-500 h-8 text-sm w-28"
                      data-ocid={`admin.hotels.form.room_price_input.${idx + 1}`}
                    />
                    <span className="text-slate-500 text-xs whitespace-nowrap">
                      /night
                    </span>
                  </div>
                  {form.roomTypes.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRoomType(idx)}
                      className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 h-7 w-7 p-0 shrink-0"
                      data-ocid={`admin.hotels.form.remove_room_button.${idx + 1}`}
                    >
                      <X size={13} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
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
              placeholder="WiFi, Pool, Gym, Restaurant, Parking, Spa"
              className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500"
              data-ocid="admin.hotels.form.amenities_input"
            />
          </div>

          {/* Photo URLs */}
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
              data-ocid="admin.hotels.form.photos_textarea"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="text-slate-400 hover:text-white"
              data-ocid="admin.hotels.form.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-gold text-slate-950 hover:bg-gold/90 font-semibold"
              data-ocid="admin.hotels.form.submit_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "edit" ? "Saving..." : "Adding..."}
                </>
              ) : mode === "edit" ? (
                "Save Changes"
              ) : (
                "Add Hotel"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminHotelsPage() {
  const { data: hotels, isLoading } = useAllHotels();
  const deleteHotel = useDeleteHotel();

  const [dialogMode, setDialogMode] = useState<"add" | "edit" | null>(null);
  const [editHotel, setEditHotel] = useState<Hotel | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<bigint | null>(null);
  const [deleteHotelName, setDeleteHotelName] = useState("");

  const openAdd = () => {
    setEditHotel(null);
    setDialogMode("add");
  };

  const openEdit = (hotel: Hotel) => {
    setEditHotel(hotel);
    setDialogMode("edit");
  };

  const openDeleteConfirm = (hotel: Hotel) => {
    setDeleteConfirmId(hotel.id);
    setDeleteHotelName(hotel.name);
  };

  const handleDelete = async () => {
    if (deleteConfirmId === null) return;
    try {
      await deleteHotel.mutateAsync(deleteConfirmId);
      toast.success("Hotel deleted");
      setDeleteConfirmId(null);
    } catch {
      toast.error("Failed to delete hotel");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6" data-ocid="admin.hotels.page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white font-display font-bold text-2xl tracking-tight">
            Hotels Management
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Add, edit, and manage hotel listings on the public website
          </p>
        </div>
        <Button
          onClick={openAdd}
          className="bg-gold text-slate-950 hover:bg-gold/90 font-semibold"
          data-ocid="admin.hotels.add.open_modal_button"
        >
          <Plus size={16} className="mr-1.5" />
          Add Hotel
        </Button>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3" data-ocid="admin.hotels.loading_state">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full bg-slate-800" />
            ))}
          </div>
        ) : !hotels?.length ? (
          <div
            className="text-center py-16 text-slate-500"
            data-ocid="admin.hotels.empty_state"
          >
            <Building2 className="w-10 h-10 mx-auto mb-3 text-slate-700" />
            <p className="font-display text-base font-semibold text-slate-400 mb-1">
              No hotels yet
            </p>
            <p className="text-sm">
              Click "Add Hotel" to add your first hotel listing.
            </p>
          </div>
        ) : (
          <Table data-ocid="admin.hotels.table">
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-slate-400 text-xs">
                  Hotel Name
                </TableHead>
                <TableHead className="text-slate-400 text-xs">City</TableHead>
                <TableHead className="text-slate-400 text-xs">
                  Room Types
                </TableHead>
                <TableHead className="text-slate-400 text-xs">
                  Starting Price
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
              {hotels.map((hotel, i) => (
                <TableRow
                  key={String(hotel.id)}
                  className="border-white/5 hover:bg-white/3"
                  data-ocid={`admin.hotels.row.${i + 1}`}
                >
                  <TableCell className="text-white text-sm font-medium max-w-[180px]">
                    <div className="truncate">{hotel.name}</div>
                  </TableCell>
                  <TableCell className="text-slate-300 text-sm">
                    {hotel.city}
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    {hotel.roomTypes.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {hotel.roomTypes.slice(0, 3).map((rt) => (
                          <Badge
                            key={rt.name}
                            variant="outline"
                            className="border-white/10 text-slate-400 text-[10px] px-1.5 py-0"
                          >
                            {rt.name}
                          </Badge>
                        ))}
                        {hotel.roomTypes.length > 3 && (
                          <Badge
                            variant="outline"
                            className="border-white/10 text-slate-500 text-[10px] px-1.5 py-0"
                          >
                            +{hotel.roomTypes.length - 3}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-600 text-xs">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-gold text-sm font-semibold">
                    {getStartingPrice(hotel)}
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm max-w-[180px]">
                    <div className="truncate text-xs">
                      {hotel.amenities.length > 0 ? (
                        hotel.amenities.slice(0, 4).join(", ") +
                        (hotel.amenities.length > 4 ? "..." : "")
                      ) : (
                        <span className="text-slate-600">None</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(hotel)}
                        className="text-slate-400 hover:text-gold hover:bg-gold/10 h-7 w-7 p-0"
                        data-ocid={`admin.hotels.edit_button.${i + 1}`}
                      >
                        <Pencil size={13} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteConfirm(hotel)}
                        className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 h-7 w-7 p-0"
                        data-ocid={`admin.hotels.delete_button.${i + 1}`}
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
        <HotelFormDialog
          open={dialogMode !== null}
          mode={dialogMode}
          editHotel={editHotel}
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
          data-ocid="admin.hotels.delete.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-white font-display">
              Delete Hotel?
            </DialogTitle>
          </DialogHeader>
          <p className="text-slate-400 text-sm">
            Are you sure you want to delete{" "}
            <span className="text-white font-semibold">{deleteHotelName}</span>?
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDeleteConfirmId(null)}
              className="text-slate-400 hover:text-white"
              data-ocid="admin.hotels.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteHotel.isPending}
              onClick={handleDelete}
              data-ocid="admin.hotels.delete.confirm_button"
            >
              {deleteHotel.isPending ? (
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
