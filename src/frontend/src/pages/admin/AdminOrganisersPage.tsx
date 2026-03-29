import type { Organiser } from "@/backend";
import { OrganiserStatus } from "@/backend";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useActor } from "@/hooks/useActor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2, UserPlus, Users2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function formatDate(ns: bigint) {
  return new Date(Number(ns) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface AddForm {
  username: string;
  password: string;
  name: string;
  email: string;
}

interface EditForm {
  name: string;
  email: string;
  status: OrganiserStatus;
}

export default function AdminOrganisersPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const [addOpen, setAddOpen] = useState(false);
  const [editOrganiser, setEditOrganiser] = useState<Organiser | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const [addForm, setAddForm] = useState<AddForm>({
    username: "",
    password: "",
    name: "",
    email: "",
  });
  const [editForm, setEditForm] = useState<EditForm>({
    name: "",
    email: "",
    status: OrganiserStatus.active,
  });

  const {
    data: organisers = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Organiser[]>({
    queryKey: ["organisers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrganisers();
    },
    enabled: !!actor,
  });

  const createMutation = useMutation({
    mutationFn: async (form: AddForm) => {
      if (!actor) throw new Error("Not connected");
      return actor.createOrganiser(
        form.username,
        form.password,
        form.name,
        form.email,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organisers"] });
      toast.success("Organiser account created!");
      setAddOpen(false);
      setAddForm({ username: "", password: "", name: "", email: "" });
    },
    onError: (err) =>
      toast.error(
        err instanceof Error ? err.message : "Failed to create organiser",
      ),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, form }: { id: bigint; form: EditForm }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateOrganiser(id, form.name, form.email, form.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organisers"] });
      toast.success("Organiser updated!");
      setEditOrganiser(null);
    },
    onError: () => toast.error("Failed to update organiser"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteOrganiser(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organisers"] });
      toast.success("Organiser deleted");
      setDeleteId(null);
    },
    onError: () => toast.error("Failed to delete organiser"),
  });

  const openEdit = (org: Organiser) => {
    setEditOrganiser(org);
    setEditForm({ name: org.name, email: org.email ?? "", status: org.status });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !addForm.username.trim() ||
      !addForm.password.trim() ||
      !addForm.name.trim()
    ) {
      toast.error("Username, password, and name are required");
      return;
    }
    createMutation.mutate(addForm);
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Users2 size={24} className="text-gold" />
            Organisers
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage organiser accounts — only admin can create these
          </p>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          className="bg-gold text-slate-950 hover:bg-gold/90 font-semibold"
          data-ocid="admin.organisers.open_modal_button"
        >
          <UserPlus size={16} className="mr-2" /> Add Organiser
        </Button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          className="flex items-center justify-center py-16 text-slate-500"
          data-ocid="admin.organisers.loading_state"
        >
          <Loader2 size={24} className="animate-spin mr-3" /> Loading
          organisers...
        </div>
      )}

      {/* Error */}
      {isError && (
        <div
          className="bg-red-500/10 border border-red-500/25 rounded-xl p-6 text-center"
          data-ocid="admin.organisers.error_state"
        >
          <p className="text-red-400">
            Failed to load organisers.{" "}
            <button
              type="button"
              onClick={() => refetch()}
              className="underline hover:no-underline"
            >
              Try again
            </button>
          </p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && organisers.length === 0 && (
        <div
          className="bg-slate-900/50 border border-white/10 rounded-xl p-12 text-center"
          data-ocid="admin.organisers.empty_state"
        >
          <Users2 size={40} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-base font-medium mb-1">
            No organiser accounts yet
          </p>
          <p className="text-slate-600 text-sm mb-6">
            Create organiser accounts to let event organisers manage their own
            events.
          </p>
          <Button
            onClick={() => setAddOpen(true)}
            className="bg-gold text-slate-950 hover:bg-gold/90 font-semibold"
            data-ocid="admin.organisers.add_first_button"
          >
            <UserPlus size={16} className="mr-2" /> Create First Organiser
          </Button>
        </div>
      )}

      {/* Table */}
      {!isLoading && organisers.length > 0 && (
        <div
          className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden"
          data-ocid="admin.organisers.table"
        >
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-slate-400 font-medium">ID</TableHead>
                <TableHead className="text-slate-400 font-medium">
                  Name
                </TableHead>
                <TableHead className="text-slate-400 font-medium">
                  Username
                </TableHead>
                <TableHead className="text-slate-400 font-medium hidden md:table-cell">
                  Email
                </TableHead>
                <TableHead className="text-slate-400 font-medium">
                  Status
                </TableHead>
                <TableHead className="text-slate-400 font-medium hidden md:table-cell">
                  Created
                </TableHead>
                <TableHead className="text-slate-400 font-medium text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organisers.map((org, index) => (
                <TableRow
                  key={String(org.id)}
                  className="border-white/10 hover:bg-white/2"
                  data-ocid={`admin.organisers.row.${index + 1}`}
                >
                  <TableCell className="text-slate-500 text-xs font-mono">
                    #{String(org.id)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-xs font-bold uppercase">
                        {org.name.charAt(0)}
                      </div>
                      <span className="text-white font-medium text-sm">
                        {org.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-300 text-sm font-mono">
                    {org.username}
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm hidden md:table-cell">
                    {org.email || "—"}
                  </TableCell>
                  <TableCell>
                    {org.status === OrganiserStatus.active ? (
                      <Badge className="bg-green-500/15 text-green-400 border-green-500/25 text-xs">
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/15 text-red-400 border-red-500/25 text-xs">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm hidden md:table-cell">
                    {formatDate(org.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(org)}
                        className="text-slate-500 hover:text-white hover:bg-white/5 h-8 px-3 text-xs"
                        data-ocid={`admin.organisers.edit_button.${index + 1}`}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(org.id)}
                        className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 p-0"
                        data-ocid={`admin.organisers.delete_button.${index + 1}`}
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

      {/* Add Modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent
          className="bg-slate-900 border-white/10 text-white max-w-md"
          data-ocid="admin.organisers.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-white">
              Add Organiser Account
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Username *</Label>
              <Input
                value={addForm.username}
                onChange={(e) =>
                  setAddForm((prev) => ({ ...prev, username: e.target.value }))
                }
                placeholder="Enter username"
                autoComplete="off"
                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500 focus:border-gold/50"
                data-ocid="admin.organisers.username_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Password *</Label>
              <Input
                type="password"
                value={addForm.password}
                onChange={(e) =>
                  setAddForm((prev) => ({ ...prev, password: e.target.value }))
                }
                placeholder="Enter password"
                autoComplete="new-password"
                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500 focus:border-gold/50"
                data-ocid="admin.organisers.password_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Full Name *</Label>
              <Input
                value={addForm.name}
                onChange={(e) =>
                  setAddForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter full name"
                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500 focus:border-gold/50"
                data-ocid="admin.organisers.name_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Email</Label>
              <Input
                type="email"
                value={addForm.email}
                onChange={(e) =>
                  setAddForm((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Enter email address"
                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500 focus:border-gold/50"
                data-ocid="admin.organisers.email_input"
              />
            </div>
            <DialogFooter className="mt-6 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddOpen(false)}
                className="border-white/10 text-slate-300 hover:bg-white/5"
                data-ocid="admin.organisers.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  createMutation.isPending ||
                  !addForm.username.trim() ||
                  !addForm.password.trim() ||
                  !addForm.name.trim()
                }
                className="bg-gold text-slate-950 hover:bg-gold/90 font-semibold"
                data-ocid="admin.organisers.submit_button"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 size={14} className="mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog
        open={!!editOrganiser}
        onOpenChange={(open) => !open && setEditOrganiser(null)}
      >
        <DialogContent
          className="bg-slate-900 border-white/10 text-white max-w-md"
          data-ocid="admin.organisers.edit_dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-white">
              Edit Organiser
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Full Name</Label>
              <Input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="bg-slate-800 border-white/10 text-white focus:border-gold/50"
                data-ocid="admin.organisers.edit_name_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Email</Label>
              <Input
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, email: e.target.value }))
                }
                className="bg-slate-800 border-white/10 text-white focus:border-gold/50"
                data-ocid="admin.organisers.edit_email_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(v) =>
                  setEditForm((prev) => ({
                    ...prev,
                    status: v as OrganiserStatus,
                  }))
                }
              >
                <SelectTrigger
                  className="bg-slate-800 border-white/10 text-white"
                  data-ocid="admin.organisers.edit_select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/10">
                  <SelectItem value={OrganiserStatus.active}>Active</SelectItem>
                  <SelectItem value={OrganiserStatus.inactive}>
                    Inactive
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-6 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditOrganiser(null)}
              className="border-white/10 text-slate-300 hover:bg-white/5"
              data-ocid="admin.organisers.edit_cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                editOrganiser &&
                updateMutation.mutate({ id: editOrganiser.id, form: editForm })
              }
              disabled={updateMutation.isPending}
              className="bg-gold text-slate-950 hover:bg-gold/90 font-semibold"
              data-ocid="admin.organisers.edit_save_button"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 size={14} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <DialogContent
          className="bg-slate-900 border-white/10 text-white max-w-sm"
          data-ocid="admin.organisers.delete_dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-lg text-white">
              Delete Organiser
            </DialogTitle>
          </DialogHeader>
          <p className="text-slate-400 text-sm mt-1">
            Are you sure you want to delete this organiser account? This cannot
            be undone.
          </p>
          <DialogFooter className="mt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              className="border-white/10 text-slate-300 hover:bg-white/5"
              data-ocid="admin.organisers.delete_cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                deleteId !== null && deleteMutation.mutate(deleteId)
              }
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
              data-ocid="admin.organisers.delete_confirm_button"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 size={14} className="mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={14} className="mr-2" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
