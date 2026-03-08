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
import { Textarea } from "@/components/ui/textarea";
import {
  useAllTransportOptions,
  useCreateTransportOption,
  useDeleteTransportOption,
  useUpdateTransportOption,
} from "@/hooks/useAdminQueries";
import {
  Bus,
  Car,
  Loader2,
  Pencil,
  Plane,
  Plus,
  Ship,
  Train,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TransportType } from "../../backend.d";
import type { TransportOption } from "../../backend.d";

// ── Transport type helpers ─────────────────────────────────────────────────────

function getTransportIcon(type: TransportType) {
  switch (type) {
    case TransportType.car:
      return Car;
    case TransportType.bus:
      return Bus;
    case TransportType.flight:
    case TransportType.helicopter:
      return Plane;
    case TransportType.train:
      return Train;
    case TransportType.cruise:
      return Ship;
    default:
      return Car;
  }
}

function getTransportLabel(type: TransportType): string {
  switch (type) {
    case TransportType.car:
      return "Car";
    case TransportType.bus:
      return "Bus";
    case TransportType.flight:
      return "Flight";
    case TransportType.train:
      return "Train";
    case TransportType.helicopter:
      return "Helicopter";
    case TransportType.cruise:
      return "Cruise";
    default:
      return String(type);
  }
}

function getTransportBadgeColor(type: TransportType): string {
  switch (type) {
    case TransportType.car:
      return "bg-blue-500/15 text-blue-400 border-blue-500/30";
    case TransportType.bus:
      return "bg-green-500/15 text-green-400 border-green-500/30";
    case TransportType.flight:
      return "bg-sky-500/15 text-sky-400 border-sky-500/30";
    case TransportType.train:
      return "bg-orange-500/15 text-orange-400 border-orange-500/30";
    case TransportType.helicopter:
      return "bg-purple-500/15 text-purple-400 border-purple-500/30";
    case TransportType.cruise:
      return "bg-teal-500/15 text-teal-400 border-teal-500/30";
    default:
      return "bg-slate-500/15 text-slate-400 border-slate-500/30";
  }
}

// ── Form types ─────────────────────────────────────────────────────────────────

interface TransportFormState {
  transportType: TransportType;
  operatorName: string;
  route: string;
  city: string;
  price: string;
  availableSeats: string;
  photoUrls: string;
}

function makeEmptyForm(): TransportFormState {
  return {
    transportType: TransportType.car,
    operatorName: "",
    route: "",
    city: "",
    price: "",
    availableSeats: "",
    photoUrls: "",
  };
}

function optionToForm(opt: TransportOption): TransportFormState {
  return {
    transportType: opt.transportType,
    operatorName: opt.operatorName,
    route: opt.route,
    city: opt.city,
    price: String(Number(opt.price)),
    availableSeats: String(Number(opt.availableSeats)),
    photoUrls: opt.photoUrls.join("\n"),
  };
}

function formToPhotoUrls(raw: string): string[] {
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

// ── Transport Form Dialog ──────────────────────────────────────────────────────

function TransportFormDialog({
  open,
  mode,
  editOption,
  onClose,
}: {
  open: boolean;
  mode: "add" | "edit";
  editOption: TransportOption | null;
  onClose: () => void;
}) {
  const createOption = useCreateTransportOption();
  const updateOption = useUpdateTransportOption();
  const isPending = createOption.isPending || updateOption.isPending;

  const [form, setForm] = useState<TransportFormState>(() =>
    editOption ? optionToForm(editOption) : makeEmptyForm(),
  );

  const handleOpenChange = (o: boolean) => {
    if (!o) onClose();
  };

  const handleClose = () => {
    setForm(editOption ? optionToForm(editOption) : makeEmptyForm());
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
      transportType: form.transportType,
      operatorName: form.operatorName.trim(),
      route: form.route.trim(),
      city: form.city.trim(),
      price: BigInt(Math.max(0, Math.round(Number(form.price) || 0))),
      availableSeats: BigInt(
        Math.max(0, Math.round(Number(form.availableSeats) || 0)),
      ),
      photoUrls: formToPhotoUrls(form.photoUrls),
    };

    try {
      if (mode === "edit" && editOption) {
        await updateOption.mutateAsync({ id: editOption.id, ...payload });
        toast.success("Transport option updated successfully");
      } else {
        await createOption.mutateAsync(payload);
        toast.success("Transport option added successfully");
      }
      handleClose();
    } catch {
      toast.error(
        mode === "edit"
          ? "Failed to update transport option"
          : "Failed to add transport option",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="bg-slate-900 border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto"
        data-ocid="admin.transport.form.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-white font-display text-xl">
            {mode === "edit" ? "Edit Transport Option" : "Add Transport Option"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Transport Type */}
          <div className="space-y-1.5">
            <Label className="text-slate-300 text-sm">Transport Type *</Label>
            <Select
              value={form.transportType}
              onValueChange={(val) =>
                setForm((prev) => ({
                  ...prev,
                  transportType: val as TransportType,
                }))
              }
            >
              <SelectTrigger
                className="bg-slate-800 border-white/10 text-white"
                data-ocid="admin.transport.form.type_select"
              >
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem
                  value={TransportType.car}
                  className="text-slate-300"
                >
                  <div className="flex items-center gap-2">
                    <Car size={14} />
                    Car
                  </div>
                </SelectItem>
                <SelectItem
                  value={TransportType.bus}
                  className="text-slate-300"
                >
                  <div className="flex items-center gap-2">
                    <Bus size={14} />
                    Bus
                  </div>
                </SelectItem>
                <SelectItem
                  value={TransportType.flight}
                  className="text-slate-300"
                >
                  <div className="flex items-center gap-2">
                    <Plane size={14} />
                    Flight
                  </div>
                </SelectItem>
                <SelectItem
                  value={TransportType.train}
                  className="text-slate-300"
                >
                  <div className="flex items-center gap-2">
                    <Train size={14} />
                    Train
                  </div>
                </SelectItem>
                <SelectItem
                  value={TransportType.helicopter}
                  className="text-slate-300"
                >
                  <div className="flex items-center gap-2">
                    <Plane size={14} />
                    Helicopter
                  </div>
                </SelectItem>
                <SelectItem
                  value={TransportType.cruise}
                  className="text-slate-300"
                >
                  <div className="flex items-center gap-2">
                    <Ship size={14} />
                    Cruise
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Operator + Route */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Operator Name *</Label>
              <Input
                name="operatorName"
                value={form.operatorName}
                onChange={handleField}
                placeholder="e.g. IndiGo Airlines"
                required
                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500"
                data-ocid="admin.transport.form.operator_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Route *</Label>
              <Input
                name="route"
                value={form.route}
                onChange={handleField}
                placeholder="e.g. Mumbai → Delhi"
                required
                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500"
                data-ocid="admin.transport.form.route_input"
              />
            </div>
          </div>

          {/* City + Price + Seats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">City *</Label>
              <Input
                name="city"
                value={form.city}
                onChange={handleField}
                placeholder="e.g. Mumbai"
                required
                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500"
                data-ocid="admin.transport.form.city_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Price (₹) *</Label>
              <Input
                name="price"
                type="number"
                min={0}
                value={form.price}
                onChange={handleField}
                placeholder="0"
                required
                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500"
                data-ocid="admin.transport.form.price_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">
                Available Seats *
              </Label>
              <Input
                name="availableSeats"
                type="number"
                min={1}
                value={form.availableSeats}
                onChange={handleField}
                placeholder="e.g. 50"
                required
                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500"
                data-ocid="admin.transport.form.seats_input"
              />
            </div>
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
              data-ocid="admin.transport.form.photos_textarea"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="text-slate-400 hover:text-white"
              data-ocid="admin.transport.form.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-gold text-slate-950 hover:bg-gold/90 font-semibold"
              data-ocid="admin.transport.form.submit_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "edit" ? "Saving..." : "Adding..."}
                </>
              ) : mode === "edit" ? (
                "Save Changes"
              ) : (
                "Add Transport"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function AdminTransportPage() {
  const { data: options, isLoading } = useAllTransportOptions();
  const deleteOption = useDeleteTransportOption();

  const [dialogMode, setDialogMode] = useState<"add" | "edit" | null>(null);
  const [editOption, setEditOption] = useState<TransportOption | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<bigint | null>(null);
  const [deleteOptionName, setDeleteOptionName] = useState("");

  const openAdd = () => {
    setEditOption(null);
    setDialogMode("add");
  };

  const openEdit = (opt: TransportOption) => {
    setEditOption(opt);
    setDialogMode("edit");
  };

  const openDeleteConfirm = (opt: TransportOption) => {
    setDeleteConfirmId(opt.id);
    setDeleteOptionName(`${opt.operatorName} (${opt.route})`);
  };

  const handleDelete = async () => {
    if (deleteConfirmId === null) return;
    try {
      await deleteOption.mutateAsync(deleteConfirmId);
      toast.success("Transport option deleted");
      setDeleteConfirmId(null);
    } catch {
      toast.error("Failed to delete transport option");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6" data-ocid="admin.transport.page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white font-display font-bold text-2xl tracking-tight">
            Transport Management
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Add, edit, and manage transport options on the public website
          </p>
        </div>
        <Button
          onClick={openAdd}
          className="bg-gold text-slate-950 hover:bg-gold/90 font-semibold"
          data-ocid="admin.transport.add.open_modal_button"
        >
          <Plus size={16} className="mr-1.5" />
          Add Transport
        </Button>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
        {isLoading ? (
          <div
            className="p-4 space-y-3"
            data-ocid="admin.transport.loading_state"
          >
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full bg-slate-800" />
            ))}
          </div>
        ) : !options?.length ? (
          <div
            className="text-center py-16 text-slate-500"
            data-ocid="admin.transport.empty_state"
          >
            <Car className="w-10 h-10 mx-auto mb-3 text-slate-700" />
            <p className="font-display text-base font-semibold text-slate-400 mb-1">
              No transport options yet
            </p>
            <p className="text-sm">
              Click "Add Transport" to add your first transport listing.
            </p>
          </div>
        ) : (
          <Table data-ocid="admin.transport.table">
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-slate-400 text-xs">Type</TableHead>
                <TableHead className="text-slate-400 text-xs">
                  Operator Name
                </TableHead>
                <TableHead className="text-slate-400 text-xs">Route</TableHead>
                <TableHead className="text-slate-400 text-xs">City</TableHead>
                <TableHead className="text-slate-400 text-xs">Price</TableHead>
                <TableHead className="text-slate-400 text-xs">Seats</TableHead>
                <TableHead className="text-slate-400 text-xs text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {options.map((opt, i) => {
                const Icon = getTransportIcon(opt.transportType);
                return (
                  <TableRow
                    key={String(opt.id)}
                    className="border-white/5 hover:bg-white/3"
                    data-ocid={`admin.transport.row.${i + 1}`}
                  >
                    <TableCell>
                      <Badge
                        className={`text-xs flex items-center gap-1.5 w-fit ${getTransportBadgeColor(opt.transportType)}`}
                      >
                        <Icon size={11} />
                        {getTransportLabel(opt.transportType)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white text-sm font-medium max-w-[160px]">
                      <div className="truncate">{opt.operatorName}</div>
                    </TableCell>
                    <TableCell className="text-slate-300 text-sm max-w-[160px]">
                      <div className="truncate">{opt.route}</div>
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {opt.city}
                    </TableCell>
                    <TableCell className="text-gold text-sm font-semibold">
                      ₹{Number(opt.price).toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {String(opt.availableSeats)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(opt)}
                          className="text-slate-400 hover:text-gold hover:bg-gold/10 h-7 w-7 p-0"
                          data-ocid={`admin.transport.edit_button.${i + 1}`}
                        >
                          <Pencil size={13} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteConfirm(opt)}
                          className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 h-7 w-7 p-0"
                          data-ocid={`admin.transport.delete_button.${i + 1}`}
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add / Edit Dialog */}
      {dialogMode !== null && (
        <TransportFormDialog
          open={dialogMode !== null}
          mode={dialogMode}
          editOption={editOption}
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
          data-ocid="admin.transport.delete.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-white font-display">
              Delete Transport Option?
            </DialogTitle>
          </DialogHeader>
          <p className="text-slate-400 text-sm">
            Are you sure you want to delete{" "}
            <span className="text-white font-semibold">{deleteOptionName}</span>
            ? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDeleteConfirmId(null)}
              className="text-slate-400 hover:text-white"
              data-ocid="admin.transport.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteOption.isPending}
              onClick={handleDelete}
              data-ocid="admin.transport.delete.confirm_button"
            >
              {deleteOption.isPending ? (
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
