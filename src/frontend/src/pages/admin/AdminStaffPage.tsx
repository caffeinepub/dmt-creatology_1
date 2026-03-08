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
import { Switch } from "@/components/ui/switch";
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
import { Loader2, RefreshCw, Trash2, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
// StaffAccount and StaffRole - defined locally since they were removed from the reduced backend.d.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StaffAccount = any;
const StaffRole = {
  gateStaff: "gateStaff",
  eventManager: "eventManager",
  admin: "admin",
} as const;
type StaffRole = (typeof StaffRole)[keyof typeof StaffRole];

// StaffStatus is not exported as an enum from backend.d — define it locally
const StaffStatus = {
  active: "active" as const,
  inactive: "inactive" as const,
} as const;
type StaffStatus = (typeof StaffStatus)[keyof typeof StaffStatus];

function getRoleBadge(role: StaffRole | string) {
  switch (role) {
    case StaffRole.admin:
      return (
        <Badge className="bg-red-500/15 text-red-400 border-red-500/25 hover:bg-red-500/20">
          Admin
        </Badge>
      );
    case StaffRole.eventManager:
      return (
        <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/25 hover:bg-blue-500/20">
          Event Manager
        </Badge>
      );
    default:
      return (
        <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/25 hover:bg-amber-500/20">
          Gate Staff
        </Badge>
      );
  }
}

function formatDate(ns: bigint) {
  return new Date(Number(ns) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminStaffPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<bigint | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<StaffRole>(StaffRole.gateStaff);
  const [isInitializing, setIsInitializing] = useState(false);

  // Fetch all staff accounts
  const {
    data: staffAccounts = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<StaffAccount[]>({
    queryKey: ["staffAccounts"],
    queryFn: async () => {
      if (!actor) return [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).getAllStaffAccounts();
    },
    enabled: !!actor,
  });

  // Create staff account mutation
  const createMutation = useMutation({
    mutationFn: async ({
      username,
      password,
      role,
    }: {
      username: string;
      password: string;
      role: StaffRole;
    }) => {
      if (!actor) throw new Error("Not connected");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).createStaffAccount(username, password, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffAccounts"] });
      toast.success("Staff account created successfully");
      setAddModalOpen(false);
      setNewUsername("");
      setNewPassword("");
      setNewRole(StaffRole.gateStaff);
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to create account",
      );
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: bigint;
      status: StaffStatus;
    }) => {
      if (!actor) throw new Error("Not connected");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).updateStaffAccountStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffAccounts"] });
      toast.success("Status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({
      id,
      role,
    }: {
      id: bigint;
      role: StaffRole;
    }) => {
      if (!actor) throw new Error("Not connected");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).updateStaffAccountRole(id, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffAccounts"] });
      toast.success("Role updated");
    },
    onError: () => toast.error("Failed to update role"),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).deleteStaffAccount(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffAccounts"] });
      toast.success("Staff account deleted");
      setDeleteConfirmId(null);
    },
    onError: () => toast.error("Failed to delete account"),
  });

  const handleInitDefault = async () => {
    if (!actor) {
      toast.error("Service unavailable");
      return;
    }
    setIsInitializing(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (actor as any).initDefaultStaffAccount();
      queryClient.invalidateQueries({ queryKey: ["staffAccounts"] });
      toast.success(
        "Default staff account initialized (gatestaff / Staff@123)",
      );
    } catch {
      toast.error("Failed to initialize default account");
    } finally {
      setIsInitializing(false);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim()) {
      toast.error("Username and password are required");
      return;
    }
    createMutation.mutate({
      username: newUsername.trim(),
      password: newPassword,
      role: newRole,
    });
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Users size={24} className="text-gold" />
            Staff Accounts
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage event staff access and scanner permissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleInitDefault}
            disabled={isInitializing}
            className="border-white/10 text-slate-400 hover:text-white hover:bg-white/5 text-xs"
            data-ocid="admin.staff.init_button"
          >
            {isInitializing ? (
              <Loader2 size={14} className="mr-1.5 animate-spin" />
            ) : (
              <RefreshCw size={14} className="mr-1.5" />
            )}
            Init Default Account
          </Button>
          <Button
            onClick={() => setAddModalOpen(true)}
            className="bg-gold text-slate-950 hover:bg-gold/90 font-semibold"
            data-ocid="admin.staff.open_modal_button"
          >
            <UserPlus size={16} className="mr-2" />
            Add Staff
          </Button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          className="flex items-center justify-center py-16 text-slate-500"
          data-ocid="admin.staff.loading_state"
        >
          <Loader2 size={24} className="animate-spin mr-3" />
          Loading staff accounts...
        </div>
      )}

      {/* Error */}
      {isError && (
        <div
          className="bg-red-500/10 border border-red-500/25 rounded-xl p-6 text-center"
          data-ocid="admin.staff.error_state"
        >
          <p className="text-red-400">
            Failed to load staff accounts.{" "}
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

      {/* Empty State */}
      {!isLoading && !isError && staffAccounts.length === 0 && (
        <div
          className="bg-slate-900/50 border border-white/10 rounded-xl p-12 text-center"
          data-ocid="admin.staff.empty_state"
        >
          <Users size={40} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-base font-medium mb-1">
            No staff accounts yet
          </p>
          <p className="text-slate-600 text-sm mb-6">
            Create one to enable scanner access for gate staff and event
            managers.
          </p>
          <Button
            onClick={() => setAddModalOpen(true)}
            className="bg-gold text-slate-950 hover:bg-gold/90 font-semibold"
            data-ocid="admin.staff.add_first_button"
          >
            <UserPlus size={16} className="mr-2" />
            Create First Staff Account
          </Button>
        </div>
      )}

      {/* Table */}
      {!isLoading && staffAccounts.length > 0 && (
        <div
          className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden"
          data-ocid="admin.staff.table"
        >
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-slate-400 font-medium">
                  Username
                </TableHead>
                <TableHead className="text-slate-400 font-medium">
                  Role
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
              {staffAccounts.map((account, index) => (
                <TableRow
                  key={String(account.id)}
                  className="border-white/10 hover:bg-white/2"
                  data-ocid={`admin.staff.row.${index + 1}`}
                >
                  {/* Username */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-xs font-bold uppercase">
                        {account.username.charAt(0)}
                      </div>
                      <span className="text-white font-medium text-sm">
                        {account.username}
                      </span>
                    </div>
                  </TableCell>

                  {/* Role (editable) */}
                  <TableCell>
                    <Select
                      value={account.role as string}
                      onValueChange={(val) =>
                        updateRoleMutation.mutate({
                          id: account.id,
                          role: val as StaffRole,
                        })
                      }
                    >
                      <SelectTrigger
                        className="w-[160px] bg-transparent border-white/10 text-sm h-8"
                        data-ocid={`admin.staff.role_select.${index + 1}`}
                      >
                        <SelectValue>{getRoleBadge(account.role)}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/10">
                        <SelectItem value={StaffRole.gateStaff}>
                          Gate Staff
                        </SelectItem>
                        <SelectItem value={StaffRole.eventManager}>
                          Event Manager
                        </SelectItem>
                        <SelectItem value={StaffRole.admin}>Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* Status toggle */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={account.status === StaffStatus.active}
                        onCheckedChange={(checked) =>
                          updateStatusMutation.mutate({
                            id: account.id,
                            status: checked
                              ? StaffStatus.active
                              : StaffStatus.inactive,
                          })
                        }
                        data-ocid={`admin.staff.switch.${index + 1}`}
                      />
                      <span
                        className={`text-xs font-medium ${
                          account.status === StaffStatus.active
                            ? "text-green-400"
                            : "text-slate-500"
                        }`}
                      >
                        {account.status === StaffStatus.active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>
                  </TableCell>

                  {/* Created */}
                  <TableCell className="text-slate-400 text-sm hidden md:table-cell">
                    {formatDate(account.createdAt)}
                  </TableCell>

                  {/* Delete */}
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirmId(account.id)}
                      className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 p-0"
                      data-ocid={`admin.staff.delete_button.${index + 1}`}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Staff Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent
          className="bg-slate-900 border-white/10 text-white max-w-md"
          data-ocid="admin.staff.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-white">
              Add Staff Account
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Username</Label>
              <Input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="off"
                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500 focus:border-gold/50"
                data-ocid="admin.staff.username_input"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="new-password"
                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500 focus:border-gold/50"
                data-ocid="admin.staff.password_input"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Role</Label>
              <Select
                value={newRole}
                onValueChange={(val) => setNewRole(val as StaffRole)}
              >
                <SelectTrigger
                  className="bg-slate-800 border-white/10 text-white"
                  data-ocid="admin.staff.role_select"
                >
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/10">
                  <SelectItem value={StaffRole.gateStaff}>
                    Gate Staff
                  </SelectItem>
                  <SelectItem value={StaffRole.eventManager}>
                    Event Manager
                  </SelectItem>
                  <SelectItem value={StaffRole.admin}>Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="mt-6 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddModalOpen(false)}
                className="border-white/10 text-slate-300 hover:bg-white/5"
                data-ocid="admin.staff.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  createMutation.isPending ||
                  !newUsername.trim() ||
                  !newPassword.trim()
                }
                className="bg-gold text-slate-950 hover:bg-gold/90 font-semibold"
                data-ocid="admin.staff.submit_button"
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmId !== null}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <DialogContent
          className="bg-slate-900 border-white/10 text-white max-w-sm"
          data-ocid="admin.staff.delete_dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-lg text-white">
              Delete Staff Account
            </DialogTitle>
          </DialogHeader>
          <p className="text-slate-400 text-sm mt-1">
            Are you sure you want to delete this staff account? This action
            cannot be undone.
          </p>
          <DialogFooter className="mt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              className="border-white/10 text-slate-300 hover:bg-white/5"
              data-ocid="admin.staff.delete_cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                deleteConfirmId !== null &&
                deleteMutation.mutate(deleteConfirmId)
              }
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
              data-ocid="admin.staff.delete_confirm_button"
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
