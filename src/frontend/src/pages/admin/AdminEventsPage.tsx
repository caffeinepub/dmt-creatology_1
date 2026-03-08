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
  useAddTicketCategory,
  useAllEvents,
  useCreateEvent,
  useDeleteEvent,
  useDeleteTicketCategory,
  useTicketCategoriesByEvent,
} from "@/hooks/useAdminQueries";
import { Loader2, Plus, Ticket, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
// Status enum and Event type - defined locally since they were removed from the reduced backend.d.ts
const Status = {
  draft: "draft",
  published: "published",
  cancelled: "cancelled",
} as const;
type Status = (typeof Status)[keyof typeof Status];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Event = any;

function formatNanoDate(ns: bigint): string {
  return new Date(Number(ns) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusBadge(status: Status) {
  switch (status) {
    case Status.published:
      return (
        <Badge className="bg-green-500/15 text-green-300 border-green-500/30">
          Published
        </Badge>
      );
    case Status.draft:
      return (
        <Badge className="bg-slate-500/15 text-slate-300 border-slate-500/30">
          Draft
        </Badge>
      );
    case Status.cancelled:
      return (
        <Badge className="bg-red-500/15 text-red-300 border-red-500/30">
          Cancelled
        </Badge>
      );
  }
}

const EMPTY_FORM = {
  name: "",
  category: "",
  subCategory: "",
  venue: "",
  city: "",
  state: "",
  country: "India",
  date: "",
  time: "",
  duration: "",
  ageLimit: "18",
  description: "",
  posterUrl: "",
  bannerUrl: "",
  status: Status.draft,
};

const EMPTY_TICKET_FORM = { name: "", price: "", availableQty: "" };

// ── Ticket Categories Modal ─────────────────────────────────────────────────

function TicketCategoriesDialog({
  event,
  onClose,
}: {
  event: Event | null;
  onClose: () => void;
}) {
  const isOpen = event !== null;
  const { data: tickets, isLoading } = useTicketCategoriesByEvent(
    isOpen ? event!.id : null,
  );
  const addTicket = useAddTicketCategory();
  const deleteTicket = useDeleteTicketCategory();

  const [ticketForm, setTicketForm] = useState(EMPTY_TICKET_FORM);
  const [deleteConfirmId, setDeleteConfirmId] = useState<bigint | null>(null);

  const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTicketForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    try {
      await addTicket.mutateAsync({
        eventId: event.id,
        name: ticketForm.name,
        price: BigInt(Math.round(Number(ticketForm.price)) || 0),
        availableQty: BigInt(Math.round(Number(ticketForm.availableQty)) || 0),
      });
      toast.success("Ticket category added");
      setTicketForm(EMPTY_TICKET_FORM);
    } catch {
      toast.error("Failed to add ticket category");
    }
  };

  const handleDeleteTicket = async (id: bigint) => {
    if (!event) return;
    try {
      await deleteTicket.mutateAsync({ id, eventId: event.id });
      toast.success("Ticket category deleted");
      setDeleteConfirmId(null);
    } catch {
      toast.error("Failed to delete ticket category");
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
        <DialogContent
          className="bg-slate-900 border-white/10 text-white max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="admin.tickets.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-white font-display text-lg">
              Ticket Categories — {event?.name}
            </DialogTitle>
          </DialogHeader>

          {/* Existing tickets list */}
          <div className="space-y-2 mt-2">
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-10 w-full bg-slate-800" />
                ))}
              </div>
            ) : !tickets?.length ? (
              <p className="text-slate-500 text-sm text-center py-4">
                No ticket categories yet. Add one below.
              </p>
            ) : (
              <div className="rounded-lg border border-white/10 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-slate-400 text-xs">
                        Name
                      </TableHead>
                      <TableHead className="text-slate-400 text-xs">
                        Price
                      </TableHead>
                      <TableHead className="text-slate-400 text-xs">
                        Qty
                      </TableHead>
                      <TableHead className="text-slate-400 text-xs text-right">
                        Del
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.map((tc, i) => (
                      <TableRow
                        key={String(tc.id)}
                        className="border-white/5"
                        data-ocid={`admin.tickets.row.${i + 1}`}
                      >
                        <TableCell className="text-white text-sm font-medium">
                          {tc.name}
                        </TableCell>
                        <TableCell className="text-gold text-sm font-semibold">
                          ₹{Number(tc.price).toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell className="text-slate-300 text-sm">
                          {Number(tc.availableQty)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirmId(tc.id)}
                            className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 h-7 w-7 p-0"
                            data-ocid={`admin.tickets.delete_button.${i + 1}`}
                          >
                            <Trash2 size={13} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Add ticket form */}
          <div className="border-t border-white/10 pt-4 mt-2">
            <p className="text-slate-300 text-sm font-semibold mb-3">
              Add Ticket Category
            </p>
            <form onSubmit={handleAddTicket} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-3 space-y-1.5">
                  <Label className="text-slate-400 text-xs">Name *</Label>
                  <Input
                    name="name"
                    value={ticketForm.name}
                    onChange={handleTicketChange}
                    placeholder="e.g. VIP, General, Early Bird"
                    required
                    className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500 h-9"
                    data-ocid="admin.tickets.name_input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-400 text-xs">Price (₹) *</Label>
                  <Input
                    name="price"
                    type="number"
                    min={0}
                    value={ticketForm.price}
                    onChange={handleTicketChange}
                    placeholder="0"
                    required
                    className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500 h-9"
                    data-ocid="admin.tickets.price_input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-400 text-xs">
                    Available Qty *
                  </Label>
                  <Input
                    name="availableQty"
                    type="number"
                    min={1}
                    value={ticketForm.availableQty}
                    onChange={handleTicketChange}
                    placeholder="100"
                    required
                    className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500 h-9"
                    data-ocid="admin.tickets.qty_input"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="submit"
                    disabled={addTicket.isPending}
                    className="w-full bg-gold text-slate-950 hover:bg-gold/90 font-semibold h-9 text-sm"
                    data-ocid="admin.tickets.add_button"
                  >
                    {addTicket.isPending ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <>
                        <Plus size={14} className="mr-1" />
                        Add
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>

          <DialogFooter className="pt-2">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-slate-400 hover:text-white"
              data-ocid="admin.tickets.close_button"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete ticket confirm dialog */}
      <Dialog
        open={deleteConfirmId !== null}
        onOpenChange={(o) => !o && setDeleteConfirmId(null)}
      >
        <DialogContent
          className="bg-slate-900 border-white/10 text-white max-w-xs"
          data-ocid="admin.tickets.delete.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-white font-display">
              Delete Ticket Category?
            </DialogTitle>
          </DialogHeader>
          <p className="text-slate-400 text-sm">
            This will permanently remove this ticket category.
          </p>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDeleteConfirmId(null)}
              className="text-slate-400"
              data-ocid="admin.tickets.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteTicket.isPending}
              onClick={() =>
                deleteConfirmId !== null && handleDeleteTicket(deleteConfirmId)
              }
              data-ocid="admin.tickets.delete.confirm_button"
            >
              {deleteTicket.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────

export default function AdminEventsPage() {
  const { data: events, isLoading } = useAllEvents();
  const createEvent = useCreateEvent();
  const deleteEvent = useDeleteEvent();

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirmId, setDeleteConfirmId] = useState<bigint | null>(null);
  const [ticketEvent, setTicketEvent] = useState<Event | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEvent.mutateAsync({
        name: form.name,
        category: form.category,
        subCategory: form.subCategory,
        venue: form.venue,
        city: form.city,
        state: form.state,
        country: form.country,
        date: BigInt(new Date(form.date).getTime() * 1_000_000),
        time: form.time,
        duration: form.duration,
        ageLimit: BigInt(Number.parseInt(form.ageLimit) || 0),
        description: form.description,
        posterUrl: form.posterUrl,
        bannerUrl: form.bannerUrl,
        status: form.status,
      });
      toast.success("Event created successfully");
      setShowCreate(false);
      setForm(EMPTY_FORM);
    } catch {
      toast.error("Failed to create event");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteEvent.mutateAsync(id);
      toast.success("Event deleted");
      setDeleteConfirmId(null);
    } catch {
      toast.error("Failed to delete event");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6" data-ocid="admin.events.page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white font-display font-bold text-2xl tracking-tight">
            Events
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Manage platform events and ticket categories
          </p>
        </div>
        <Button
          onClick={() => setShowCreate(true)}
          className="bg-gold text-slate-950 hover:bg-gold/90 font-semibold"
          data-ocid="admin.events.create.open_modal_button"
        >
          <Plus size={16} className="mr-1.5" />
          Create Event
        </Button>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3" data-ocid="admin.events.loading_state">
            {["s1", "s2", "s3", "s4", "s5"].map((sk) => (
              <Skeleton key={sk} className="h-10 w-full bg-slate-800" />
            ))}
          </div>
        ) : !events?.length ? (
          <div
            className="text-center py-16 text-slate-500"
            data-ocid="admin.events.empty_state"
          >
            <p className="font-display text-base font-semibold text-slate-400 mb-1">
              No events yet
            </p>
            <p className="text-sm">Click "Create Event" to add one.</p>
          </div>
        ) : (
          <Table data-ocid="admin.events.table">
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-slate-400 text-xs">Name</TableHead>
                <TableHead className="text-slate-400 text-xs">
                  Category
                </TableHead>
                <TableHead className="text-slate-400 text-xs">City</TableHead>
                <TableHead className="text-slate-400 text-xs">Date</TableHead>
                <TableHead className="text-slate-400 text-xs">Status</TableHead>
                <TableHead className="text-slate-400 text-xs text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event, i) => (
                <TableRow
                  key={String(event.id)}
                  className="border-white/5 hover:bg-white/3"
                  data-ocid={`admin.events.row.${i + 1}`}
                >
                  <TableCell className="text-white text-sm font-medium">
                    {event.name}
                  </TableCell>
                  <TableCell className="text-slate-300 text-sm">
                    {event.category}
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    {event.city}
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    {formatNanoDate(event.date)}
                  </TableCell>
                  <TableCell>{statusBadge(event.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setTicketEvent(event)}
                        className="text-slate-400 hover:text-gold hover:bg-gold/10 h-7 px-2 text-xs gap-1"
                        data-ocid={`admin.events.tickets_button.${i + 1}`}
                      >
                        <Ticket size={13} />
                        Tickets
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirmId(event.id)}
                        className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 h-7 w-7 p-0"
                        data-ocid={`admin.events.delete_button.${i + 1}`}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Ticket Categories Dialog */}
      <TicketCategoriesDialog
        event={ticketEvent}
        onClose={() => setTicketEvent(null)}
      />

      {/* Create Event Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent
          className="bg-slate-900 border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto"
          data-ocid="admin.events.create.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-white font-display text-xl">
              Create New Event
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label className="text-slate-300 text-sm">Event Name *</Label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Sunburn Arena Mumbai"
                  required
                  className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500"
                  data-ocid="admin.events.create.name_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm">Category *</Label>
                <Input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Music, Sports"
                  required
                  className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500"
                  data-ocid="admin.events.create.category_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm">Sub-Category</Label>
                <Input
                  name="subCategory"
                  value={form.subCategory}
                  onChange={handleChange}
                  placeholder="e.g. EDM, Cricket"
                  className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500"
                  data-ocid="admin.events.create.subcategory_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm">Venue *</Label>
                <Input
                  name="venue"
                  value={form.venue}
                  onChange={handleChange}
                  placeholder="Venue name"
                  required
                  className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500"
                  data-ocid="admin.events.create.venue_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm">City *</Label>
                <Input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                  className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500"
                  data-ocid="admin.events.create.city_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm">State</Label>
                <Input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500"
                  data-ocid="admin.events.create.state_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm">Country</Label>
                <Input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Country"
                  className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500"
                  data-ocid="admin.events.create.country_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm">Date *</Label>
                <Input
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="bg-slate-800 border-white/10 text-white"
                  data-ocid="admin.events.create.date_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm">Time</Label>
                <Input
                  name="time"
                  type="time"
                  value={form.time}
                  onChange={handleChange}
                  className="bg-slate-800 border-white/10 text-white"
                  data-ocid="admin.events.create.time_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm">Duration</Label>
                <Input
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="e.g. 3 hours"
                  className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500"
                  data-ocid="admin.events.create.duration_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm">Age Limit</Label>
                <Input
                  name="ageLimit"
                  type="number"
                  value={form.ageLimit}
                  onChange={handleChange}
                  placeholder="18"
                  className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500"
                  data-ocid="admin.events.create.agelimit_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    setForm((prev) => ({ ...prev, status: v as any }))
                  }
                >
                  <SelectTrigger
                    className="bg-slate-800 border-white/10 text-white"
                    data-ocid="admin.events.create.status_select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    <SelectItem value={Status.draft} className="text-white">
                      Draft
                    </SelectItem>
                    <SelectItem value={Status.published} className="text-white">
                      Published
                    </SelectItem>
                    <SelectItem value={Status.cancelled} className="text-white">
                      Cancelled
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label className="text-slate-300 text-sm">Description</Label>
                <Textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Event description..."
                  rows={3}
                  className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500 resize-none"
                  data-ocid="admin.events.create.description_textarea"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm">Poster URL</Label>
                <Input
                  name="posterUrl"
                  value={form.posterUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500"
                  data-ocid="admin.events.create.poster_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm">Banner URL</Label>
                <Input
                  name="bannerUrl"
                  value={form.bannerUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500"
                  data-ocid="admin.events.create.banner_input"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowCreate(false)}
                className="text-slate-400 hover:text-white"
                data-ocid="admin.events.create.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createEvent.isPending}
                className="bg-gold text-slate-950 hover:bg-gold/90 font-semibold"
                data-ocid="admin.events.create.submit_button"
              >
                {createEvent.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Event"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={deleteConfirmId !== null}
        onOpenChange={(o) => !o && setDeleteConfirmId(null)}
      >
        <DialogContent
          className="bg-slate-900 border-white/10 text-white max-w-sm"
          data-ocid="admin.events.delete.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-white font-display">
              Delete Event?
            </DialogTitle>
          </DialogHeader>
          <p className="text-slate-400 text-sm">
            This action is permanent and cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDeleteConfirmId(null)}
              className="text-slate-400"
              data-ocid="admin.events.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteEvent.isPending}
              onClick={() =>
                deleteConfirmId !== null && handleDelete(deleteConfirmId)
              }
              data-ocid="admin.events.delete.confirm_button"
            >
              {deleteEvent.isPending ? (
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
