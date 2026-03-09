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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  useAdjustAdminScore,
  useAllRankingProfiles,
  useCreateRankingProfile,
  useDeleteRankingProfile,
  useGetVoteRecords,
  useUpdateRankingProfile,
} from "@/hooks/useAdminQueries";
import {
  BarChart2,
  Loader2,
  Pencil,
  Plus,
  Settings2,
  Star,
  Trash2,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────

interface RankingProfile {
  id: bigint;
  name: string;
  city: string;
  category: string;
  photoUrl: string;
  description: string;
  rating: bigint;
  totalVotes: bigint;
  adminScore: bigint;
  linkedVendorId?: bigint;
  createdAt: bigint;
}

interface VoteRecord {
  id: bigint;
  profileId: bigint;
  voterIdentifier: string;
  votedAt: bigint;
}

// ── Category Config ───────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: "djs", label: "Top DJs" },
  { value: "photographers", label: "Top Event Photographers" },
  { value: "makeup", label: "Top Makeup Artists" },
  { value: "event_planners", label: "Top Event Planners" },
  { value: "wedding_venues", label: "Top Wedding Venues" },
  { value: "hotels", label: "Top Hotels" },
  { value: "caterers", label: "Top Caterers" },
  { value: "music_artists", label: "Top Music Artists" },
  { value: "production_companies", label: "Top Production Companies" },
  { value: "event_management", label: "Top Event Management Companies" },
];

const CATEGORY_MAP: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c.label]),
);

// ── Helpers ───────────────────────────────────────────────────────────────────

function displayRating(rating: bigint): string {
  return (Number(rating) / 100).toFixed(2);
}

function ratingToStored(val: string): bigint {
  const f = Number.parseFloat(val) || 0;
  return BigInt(Math.round(Math.min(5, Math.max(0, f)) * 100));
}

// ── Profile Form Dialog ───────────────────────────────────────────────────────

interface FormState {
  name: string;
  city: string;
  category: string;
  photoUrl: string;
  description: string;
  rating: string;
  adminScore: string;
  linkedVendorId: string;
}

function makeEmptyForm(): FormState {
  return {
    name: "",
    city: "",
    category: "djs",
    photoUrl: "",
    description: "",
    rating: "4.00",
    adminScore: "50",
    linkedVendorId: "",
  };
}

function profileToForm(p: RankingProfile): FormState {
  return {
    name: p.name,
    city: p.city,
    category: p.category,
    photoUrl: p.photoUrl,
    description: p.description,
    rating: (Number(p.rating) / 100).toFixed(2),
    adminScore: String(Number(p.adminScore)),
    linkedVendorId:
      p.linkedVendorId !== undefined && p.linkedVendorId !== null
        ? String(Number(p.linkedVendorId))
        : "",
  };
}

function ProfileFormDialog({
  open,
  mode,
  editProfile,
  onClose,
}: {
  open: boolean;
  mode: "add" | "edit";
  editProfile: RankingProfile | null;
  onClose: () => void;
}) {
  const createProfile = useCreateRankingProfile();
  const updateProfile = useUpdateRankingProfile();
  const isPending = createProfile.isPending || updateProfile.isPending;

  const [form, setForm] = useState<FormState>(() =>
    editProfile ? profileToForm(editProfile) : makeEmptyForm(),
  );

  const handleField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClose = () => {
    setForm(editProfile ? profileToForm(editProfile) : makeEmptyForm());
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const vendorIdStr = form.linkedVendorId.trim();
    const linkedVendorId =
      vendorIdStr && !Number.isNaN(Number(vendorIdStr))
        ? BigInt(vendorIdStr)
        : null;

    const payload = {
      name: form.name.trim(),
      city: form.city.trim(),
      category: form.category,
      photoUrl: form.photoUrl.trim(),
      description: form.description.trim(),
      rating: ratingToStored(form.rating),
      adminScore: BigInt(
        Math.min(100, Math.max(0, Number.parseInt(form.adminScore) || 0)),
      ),
      linkedVendorId,
    };

    try {
      if (mode === "edit" && editProfile) {
        await updateProfile.mutateAsync({ id: editProfile.id, ...payload });
        toast.success("Profile updated");
      } else {
        await createProfile.mutateAsync(payload);
        toast.success("Profile added");
      }
      handleClose();
    } catch {
      toast.error(
        mode === "edit" ? "Failed to update profile" : "Failed to add profile",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className="bg-slate-900 border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto"
        data-ocid="admin.rankings.modal"
      >
        <DialogHeader>
          <DialogTitle className="text-white font-display text-xl">
            {mode === "edit" ? "Edit Profile" : "Add Ranking Profile"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-slate-300 text-sm">Name *</Label>
              <Input
                name="name"
                value={form.name}
                onChange={handleField}
                placeholder="e.g. DJ Arjun Singh"
                required
                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500"
                data-ocid="admin.rankings.form.name_input"
              />
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">City *</Label>
              <Input
                name="city"
                value={form.city}
                onChange={handleField}
                placeholder="e.g. Mumbai"
                required
                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500"
                data-ocid="admin.rankings.form.city_input"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Category *</Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm((prev) => ({ ...prev, category: v }))
                }
              >
                <SelectTrigger
                  className="bg-slate-800 border-white/10 text-white"
                  data-ocid="admin.rankings.form.category_select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/10">
                  {CATEGORIES.map((c) => (
                    <SelectItem
                      key={c.value}
                      value={c.value}
                      className="text-white hover:bg-slate-700 focus:bg-slate-700"
                    >
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Photo URL */}
            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-slate-300 text-sm">
                Photo URL{" "}
                <span className="text-slate-500 font-normal">(optional)</span>
              </Label>
              <Input
                name="photoUrl"
                value={form.photoUrl}
                onChange={handleField}
                placeholder="https://example.com/photo.jpg"
                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-slate-300 text-sm">Description</Label>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleField}
                placeholder="Brief bio or service description..."
                rows={3}
                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500 resize-none"
              />
            </div>

            {/* Rating */}
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">
                Rating{" "}
                <span className="text-slate-500 font-normal">(0.0 – 5.0)</span>
              </Label>
              <Input
                name="rating"
                type="number"
                step="0.01"
                min={0}
                max={5}
                value={form.rating}
                onChange={handleField}
                className="bg-slate-800 border-white/10 text-white"
              />
            </div>

            {/* Admin Score */}
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">
                Admin Score{" "}
                <span className="text-slate-500 font-normal">(0 – 100)</span>
              </Label>
              <Input
                name="adminScore"
                type="number"
                min={0}
                max={100}
                value={form.adminScore}
                onChange={handleField}
                className="bg-slate-800 border-white/10 text-white"
              />
            </div>

            {/* Linked Vendor ID */}
            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-slate-300 text-sm">
                Linked Vendor ID{" "}
                <span className="text-slate-500 font-normal">
                  (optional — enter vendor ID from Vendor Marketplace)
                </span>
              </Label>
              <Input
                name="linkedVendorId"
                type="number"
                min={1}
                value={form.linkedVendorId}
                onChange={handleField}
                placeholder="e.g. 1"
                className="bg-slate-800 border-white/10 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="text-slate-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-gold text-slate-950 hover:bg-gold/90 font-semibold"
              data-ocid="admin.rankings.form.submit_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "edit" ? "Saving..." : "Adding..."}
                </>
              ) : mode === "edit" ? (
                "Save Changes"
              ) : (
                "Add Profile"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Adjust Score Popover ──────────────────────────────────────────────────────

function AdjustScorePopover({
  profile,
  rowIndex,
}: {
  profile: RankingProfile;
  rowIndex: number;
}) {
  const adjustScore = useAdjustAdminScore();
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState(String(Number(profile.adminScore)));

  const handleSave = async () => {
    try {
      await adjustScore.mutateAsync({
        profileId: profile.id,
        score: BigInt(Math.min(100, Math.max(0, Number.parseInt(score) || 0))),
      });
      toast.success("Admin score updated");
      setOpen(false);
    } catch {
      toast.error("Failed to update score");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 h-7 px-2 text-xs gap-1"
          data-ocid={`admin.rankings.edit_button.${rowIndex}`}
        >
          <Settings2 size={12} />
          Score
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="bg-slate-800 border-white/10 p-3 w-44"
        data-ocid="admin.rankings.popover"
      >
        <p className="text-xs text-slate-400 mb-2">Adjust Admin Score</p>
        <Input
          type="number"
          min={0}
          max={100}
          value={score}
          onChange={(e) => setScore(e.target.value)}
          className="bg-slate-700 border-white/10 text-white h-8 text-sm mb-2"
        />
        <Button
          size="sm"
          className="w-full bg-gold text-slate-950 hover:bg-gold/90 font-semibold h-7 text-xs"
          onClick={handleSave}
          disabled={adjustScore.isPending}
          data-ocid="admin.rankings.save_button"
        >
          {adjustScore.isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            "Save"
          )}
        </Button>
      </PopoverContent>
    </Popover>
  );
}

// ── Vote Records Modal ────────────────────────────────────────────────────────

function VoteRecordsModal({
  profileId,
  profileName,
  open,
  onClose,
}: {
  profileId: bigint | null;
  profileName: string;
  open: boolean;
  onClose: () => void;
}) {
  const { data: records, isLoading } = useGetVoteRecords(
    open ? profileId : null,
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-slate-900 border-white/10 text-white max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white font-display">
            Vote Records — {profileName}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-2 py-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-8 bg-slate-800" />
            ))}
          </div>
        ) : !records?.length ? (
          <div className="text-center py-10 text-slate-500">
            <BarChart2 className="w-8 h-8 mx-auto mb-2 text-slate-700" />
            <p className="text-sm">No votes yet</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-slate-400 text-xs">#</TableHead>
                <TableHead className="text-slate-400 text-xs">
                  Voter ID
                </TableHead>
                <TableHead className="text-slate-400 text-xs">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(records as VoteRecord[]).map((r, i) => (
                <TableRow
                  key={String(r.id)}
                  className="border-white/5 hover:bg-white/3"
                >
                  <TableCell className="text-slate-500 text-xs">
                    {i + 1}
                  </TableCell>
                  <TableCell className="text-slate-300 text-xs font-mono truncate max-w-[200px]">
                    {r.voterIdentifier.slice(0, 20)}…
                  </TableCell>
                  <TableCell className="text-slate-400 text-xs">
                    {new Date(Number(r.votedAt) / 1_000_000).toLocaleDateString(
                      "en-IN",
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
            data-ocid="admin.rankings.close_button"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminRankingsPage() {
  const { data: profiles, isLoading } = useAllRankingProfiles();
  const deleteProfile = useDeleteRankingProfile();

  const [dialogMode, setDialogMode] = useState<"add" | "edit" | null>(null);
  const [editProfile, setEditProfile] = useState<RankingProfile | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<bigint | null>(null);
  const [deleteProfileName, setDeleteProfileName] = useState("");
  const [voteModalProfile, setVoteModalProfile] =
    useState<RankingProfile | null>(null);

  const openAdd = () => {
    setEditProfile(null);
    setDialogMode("add");
  };

  const openEdit = (p: RankingProfile) => {
    setEditProfile(p);
    setDialogMode("edit");
  };

  const openDeleteConfirm = (p: RankingProfile) => {
    setDeleteConfirmId(p.id);
    setDeleteProfileName(p.name);
  };

  const handleDelete = async () => {
    if (deleteConfirmId === null) return;
    try {
      await deleteProfile.mutateAsync(deleteConfirmId);
      toast.success("Profile deleted");
      setDeleteConfirmId(null);
    } catch {
      toast.error("Failed to delete profile");
    }
  };

  // Sort profiles: by totalVotes + adminScore descending
  const sortedProfiles = ((profiles as RankingProfile[]) ?? [])
    .slice()
    .sort((a, b) => {
      const scoreA = Number(a.totalVotes) * 40 + Number(a.adminScore) * 5;
      const scoreB = Number(b.totalVotes) * 40 + Number(b.adminScore) * 5;
      return scoreB - scoreA;
    });

  return (
    <div className="p-4 md:p-6 space-y-6" data-ocid="admin.rankings.page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white font-display font-bold text-2xl tracking-tight">
            Rankings Management
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Manage India Top 100 profiles, votes, and scores
          </p>
        </div>
        <Button
          onClick={openAdd}
          className="bg-gold text-slate-950 hover:bg-gold/90 font-semibold"
          data-ocid="admin.rankings.add_button"
        >
          <Plus size={16} className="mr-1.5" />
          Add Profile
        </Button>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
        {isLoading ? (
          <div
            className="p-4 space-y-3"
            data-ocid="admin.rankings.loading_state"
          >
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full bg-slate-800" />
            ))}
          </div>
        ) : !sortedProfiles.length ? (
          <div
            className="text-center py-16 text-slate-500"
            data-ocid="admin.rankings.empty_state"
          >
            <Trophy className="w-10 h-10 mx-auto mb-3 text-slate-700" />
            <p className="font-display text-base font-semibold text-slate-400 mb-1">
              No ranking profiles yet
            </p>
            <p className="text-sm">
              Click "Add Profile" to add your first ranking entry.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table data-ocid="admin.rankings.table">
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-slate-400 text-xs w-12">
                    Rank
                  </TableHead>
                  <TableHead className="text-slate-400 text-xs w-12">
                    Photo
                  </TableHead>
                  <TableHead className="text-slate-400 text-xs">Name</TableHead>
                  <TableHead className="text-slate-400 text-xs">City</TableHead>
                  <TableHead className="text-slate-400 text-xs">
                    Category
                  </TableHead>
                  <TableHead className="text-slate-400 text-xs">
                    Rating
                  </TableHead>
                  <TableHead className="text-slate-400 text-xs">
                    Votes
                  </TableHead>
                  <TableHead className="text-slate-400 text-xs">
                    Admin Score
                  </TableHead>
                  <TableHead className="text-slate-400 text-xs">
                    Vendor Link
                  </TableHead>
                  <TableHead className="text-slate-400 text-xs text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProfiles.map((profile, i) => (
                  <TableRow
                    key={String(profile.id)}
                    className="border-white/5 hover:bg-white/3"
                    data-ocid={`admin.rankings.row.${i + 1}`}
                  >
                    {/* Rank */}
                    <TableCell className="text-slate-400 text-sm font-mono">
                      {i === 0 ? (
                        <Trophy className="w-4 h-4 text-yellow-400" />
                      ) : (
                        `#${i + 1}`
                      )}
                    </TableCell>

                    {/* Photo */}
                    <TableCell>
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-slate-800">
                        <img
                          src={profile.photoUrl || "/images/default-vendor.jpg"}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/images/default-vendor.jpg";
                          }}
                        />
                      </div>
                    </TableCell>

                    {/* Name */}
                    <TableCell className="text-white text-sm font-medium max-w-[150px]">
                      <div className="truncate">{profile.name}</div>
                    </TableCell>

                    {/* City */}
                    <TableCell className="text-slate-300 text-sm">
                      {profile.city}
                    </TableCell>

                    {/* Category */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-white/10 text-slate-400 text-[10px] px-1.5 py-0 whitespace-nowrap"
                      >
                        {CATEGORY_MAP[profile.category] ?? profile.category}
                      </Badge>
                    </TableCell>

                    {/* Rating */}
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-gold fill-gold" />
                        <span className="text-gold text-sm font-semibold">
                          {displayRating(profile.rating)}
                        </span>
                      </div>
                    </TableCell>

                    {/* Votes */}
                    <TableCell>
                      <button
                        type="button"
                        className="text-blue-400 hover:text-blue-300 text-sm font-semibold underline underline-offset-2 cursor-pointer"
                        onClick={() => setVoteModalProfile(profile)}
                        title="View vote records"
                      >
                        {Number(profile.totalVotes).toLocaleString("en-IN")}
                      </button>
                    </TableCell>

                    {/* Admin Score */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300 text-sm">
                          {Number(profile.adminScore)}
                        </span>
                        <AdjustScorePopover
                          profile={profile}
                          rowIndex={i + 1}
                        />
                      </div>
                    </TableCell>

                    {/* Vendor Link */}
                    <TableCell className="text-slate-400 text-sm">
                      {profile.linkedVendorId !== undefined &&
                      profile.linkedVendorId !== null ? (
                        <Badge
                          variant="outline"
                          className="border-green-500/30 text-green-400 text-[10px] px-1.5"
                        >
                          Vendor #{String(Number(profile.linkedVendorId))}
                        </Badge>
                      ) : (
                        <span className="text-slate-600 text-xs">—</span>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(profile)}
                          className="text-slate-400 hover:text-gold hover:bg-gold/10 h-7 w-7 p-0"
                          data-ocid={`admin.rankings.edit_button.${i + 1}`}
                        >
                          <Pencil size={13} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteConfirm(profile)}
                          className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 h-7 w-7 p-0"
                          data-ocid={`admin.rankings.delete_button.${i + 1}`}
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

      {/* Add / Edit Dialog */}
      {dialogMode !== null && (
        <ProfileFormDialog
          open={dialogMode !== null}
          mode={dialogMode}
          editProfile={editProfile}
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
          data-ocid="admin.rankings.delete_dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-white font-display">
              Delete Profile?
            </DialogTitle>
          </DialogHeader>
          <p className="text-slate-400 text-sm">
            Are you sure you want to delete{" "}
            <span className="text-white font-semibold">
              {deleteProfileName}
            </span>
            ? This will also remove all vote records. This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDeleteConfirmId(null)}
              className="text-slate-400 hover:text-white"
              data-ocid="admin.rankings.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteProfile.isPending}
              onClick={handleDelete}
              data-ocid="admin.rankings.delete.confirm_button"
            >
              {deleteProfile.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Vote Records Modal */}
      <VoteRecordsModal
        profileId={voteModalProfile?.id ?? null}
        profileName={voteModalProfile?.name ?? ""}
        open={voteModalProfile !== null}
        onClose={() => setVoteModalProfile(null)}
      />
    </div>
  );
}
