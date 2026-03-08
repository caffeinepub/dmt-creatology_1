import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAllUsers, useUpdateUserStatus } from "@/hooks/useAdminQueries";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
// UserRole and UserStatus enums - defined locally since the reduced backend.d.ts
// has different values (admin/user/guest vs customer/vendor/staff)
const UserRole = {
  customer: "customer",
  vendor: "vendor",
  staff: "staff",
  admin: "admin",
  user: "user",
  guest: "guest",
} as const;
type UserRole = (typeof UserRole)[keyof typeof UserRole];
const UserStatus = {
  active: "active",
  inactive: "inactive",
} as const;
type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

function formatNanoDate(ns: bigint): string {
  return new Date(Number(ns) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function roleBadge(role: UserRole) {
  switch (role) {
    case UserRole.customer:
      return (
        <Badge className="bg-blue-500/15 text-blue-300 border-blue-500/30">
          Customer
        </Badge>
      );
    case UserRole.vendor:
      return (
        <Badge className="bg-purple-500/15 text-purple-300 border-purple-500/30">
          Vendor
        </Badge>
      );
    case UserRole.staff:
      return (
        <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30">
          Staff
        </Badge>
      );
  }
}

export default function AdminUsersPage() {
  const { data: users, isLoading } = useAllUsers();
  const updateStatus = useUpdateUserStatus();

  const handleToggle = async (id: bigint, current: UserStatus) => {
    const newStatus =
      current === UserStatus.active ? UserStatus.inactive : UserStatus.active;
    try {
      await updateStatus.mutateAsync({ id, status: newStatus });
      toast.success(
        `User ${newStatus === UserStatus.active ? "activated" : "deactivated"}`,
      );
    } catch {
      toast.error("Failed to update user status");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6" data-ocid="admin.users.page">
      <div>
        <h1 className="text-white font-display font-bold text-2xl tracking-tight">
          Users
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Manage platform user accounts
        </p>
      </div>

      <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3" data-ocid="admin.users.loading_state">
            {["s1", "s2", "s3", "s4", "s5"].map((sk) => (
              <Skeleton key={sk} className="h-10 w-full bg-slate-800" />
            ))}
          </div>
        ) : !users?.length ? (
          <div
            className="text-center py-16 text-slate-500"
            data-ocid="admin.users.empty_state"
          >
            <p className="font-display text-base font-semibold text-slate-400 mb-1">
              No users yet
            </p>
            <p className="text-sm">Registered users will appear here.</p>
          </div>
        ) : (
          <Table data-ocid="admin.users.table">
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-slate-400 text-xs">Name</TableHead>
                <TableHead className="text-slate-400 text-xs">Phone</TableHead>
                <TableHead className="text-slate-400 text-xs">Email</TableHead>
                <TableHead className="text-slate-400 text-xs">Role</TableHead>
                <TableHead className="text-slate-400 text-xs">Joined</TableHead>
                <TableHead className="text-slate-400 text-xs text-right">
                  Active
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, i) => (
                <TableRow
                  key={String(user.id)}
                  className="border-white/5 hover:bg-white/3"
                  data-ocid={`admin.users.row.${i + 1}`}
                >
                  <TableCell className="text-white text-sm font-medium">
                    {user.name}
                  </TableCell>
                  <TableCell className="text-slate-300 text-sm font-mono">
                    {user.phone}
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm max-w-[160px] truncate">
                    {user.email || "—"}
                  </TableCell>
                  <TableCell>{roleBadge(user.role)}</TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    {formatNanoDate(user.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {updateStatus.isPending ? (
                        <Loader2
                          size={14}
                          className="animate-spin text-slate-400"
                        />
                      ) : (
                        <Switch
                          checked={user.status === UserStatus.active}
                          onCheckedChange={() =>
                            handleToggle(user.id, user.status)
                          }
                          className="data-[state=checked]:bg-green-500"
                          data-ocid={`admin.users.status.switch.${i + 1}`}
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
