import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAllRankingProfiles,
  useVoteForProfile,
} from "@/hooks/useAdminQueries";
import {
  Loader2,
  MapPin,
  Star,
  ThumbsUp,
  TrendingUp,
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

// ── Voter ID ──────────────────────────────────────────────────────────────────

function getOrCreateVoterId(): string {
  const key = "dmt_voter_id";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  // Simple UUID v4 generator
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
  localStorage.setItem(key, uuid);
  return uuid;
}

// ── Tab Config ────────────────────────────────────────────────────────────────

const tabConfig = [
  { value: "djs", label: "Top DJs" },
  { value: "photographers", label: "Photographers" },
  { value: "makeup", label: "Makeup Artists" },
  { value: "event_planners", label: "Event Planners" },
  { value: "wedding_venues", label: "Wedding Venues" },
  { value: "hotels", label: "Hotels" },
  { value: "caterers", label: "Caterers" },
  { value: "music_artists", label: "Music Artists" },
  { value: "production_companies", label: "Production Cos." },
  { value: "event_management", label: "Event Management" },
];

const CATEGORY_LABELS: Record<string, string> = {
  djs: "Top DJs",
  photographers: "Top Event Photographers",
  makeup: "Top Makeup Artists",
  event_planners: "Top Event Planners",
  wedding_venues: "Top Wedding Venues",
  hotels: "Top Hotels",
  caterers: "Top Caterers",
  music_artists: "Top Music Artists",
  production_companies: "Top Production Companies",
  event_management: "Top Event Management Companies",
};

// ── Rank visuals ──────────────────────────────────────────────────────────────

const rankColors = [
  "text-yellow-400",
  "text-slate-300",
  "text-amber-600",
  "text-muted-foreground",
  "text-muted-foreground",
];
const rankBg = [
  "bg-yellow-400/10 border-yellow-400/30",
  "bg-slate-300/10 border-slate-300/30",
  "bg-amber-600/10 border-amber-600/30",
  "bg-border/50 border-border",
  "bg-border/50 border-border",
];

function getRankColor(rank: number): string {
  return rankColors[Math.min(rank - 1, rankColors.length - 1)];
}
function getRankBg(rank: number): string {
  return rankBg[Math.min(rank - 1, rankBg.length - 1)];
}

// ── Profile Card ──────────────────────────────────────────────────────────────

function ProfileCard({
  profile,
  rank,
  index,
}: {
  profile: RankingProfile;
  rank: number;
  index: number;
}) {
  const voteForProfile = useVoteForProfile();
  const [isVoting, setIsVoting] = useState(false);

  const ratingDisplay = (Number(profile.rating) / 100).toFixed(2);
  const ratingFloat = Number(profile.rating) / 100;

  const handleVote = async () => {
    setIsVoting(true);
    try {
      const voterIdentifier = getOrCreateVoterId();
      const result = await voteForProfile.mutateAsync({
        profileId: profile.id,
        voterIdentifier,
      });
      if (result && typeof result === "object" && "__kind__" in result) {
        if ((result as { __kind__: string }).__kind__ === "err") {
          toast.error("Already voted today for this profile");
        } else {
          toast.success("Vote submitted!");
        }
      } else {
        toast.success("Vote submitted!");
      }
    } catch {
      toast.error("Failed to submit vote. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <Card
      className={`border ${getRankBg(rank)} bg-card card-hover transition-all duration-200`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Rank badge */}
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getRankBg(rank)} border`}
          >
            {rank === 1 ? (
              <Trophy className={`w-6 h-6 ${getRankColor(1)}`} />
            ) : (
              <span
                className={`font-display font-black text-xl ${getRankColor(rank)}`}
              >
                #{rank}
              </span>
            )}
          </div>

          {/* Profile photo */}
          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-border">
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

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-bold text-foreground truncate">
                {profile.name}
              </h3>
              {rank === 1 && (
                <Badge className="gradient-gold text-[oklch(0.1_0.01_260)] border-0 text-xs shrink-0">
                  #1 IN INDIA
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="flex items-center gap-1 text-muted-foreground text-sm">
                <MapPin className="w-3 h-3 text-gold" />
                {profile.city}
              </span>
              <Badge
                variant="outline"
                className="text-xs border-border text-muted-foreground px-1.5 py-0"
              >
                {CATEGORY_LABELS[profile.category] ?? profile.category}
              </Badge>
            </div>
          </div>

          {/* Stats */}
          <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3.5 h-3.5 ${star <= Math.floor(ratingFloat) ? "text-gold fill-gold" : "text-muted-foreground"}`}
                />
              ))}
              <span className="text-foreground text-sm font-bold ml-1">
                {ratingDisplay}
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <ThumbsUp className="w-3 h-3" />
              {Number(profile.totalVotes).toLocaleString("en-IN")} votes
            </div>
          </div>

          {/* Vote button */}
          <Button
            size="sm"
            className="shrink-0 gradient-gold text-[oklch(0.1_0.01_260)] font-bold hover:opacity-90"
            onClick={handleVote}
            disabled={isVoting}
            data-ocid={`rankings.vote_button.${index + 1}`}
          >
            {isVoting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <ThumbsUp className="w-3.5 h-3.5 mr-1.5" />
                Vote
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function RankingsPage() {
  const { data: allProfiles, isLoading } = useAllRankingProfiles();

  // Group profiles by category and sort by votes + adminScore descending
  const profilesByCategory: Record<string, RankingProfile[]> = {};
  for (const tab of tabConfig) {
    const filtered = ((allProfiles as RankingProfile[]) ?? [])
      .filter((p) => p.category === tab.value)
      .sort((a, b) => {
        const scoreA = Number(a.totalVotes) * 40 + Number(a.adminScore) * 5;
        const scoreB = Number(b.totalVotes) * 40 + Number(b.adminScore) * 5;
        return scoreB - scoreA;
      });
    profilesByCategory[tab.value] = filtered;
  }

  return (
    <div>
      <PageHeader
        title="India Top 100"
        subtitle="The definitive rankings of India's best event professionals, voted by the public"
        breadcrumb="Rankings"
      />

      <section className="py-10">
        <div className="container mx-auto px-4">
          {/* Ranking formula info */}
          <div className="bg-card border border-border rounded-xl p-5 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-gold" />
              <h3 className="font-display font-bold text-foreground">
                Ranking Formula
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: "Public Votes", pct: "40%" },
                { label: "Reviews", pct: "25%" },
                { label: "Bookings", pct: "20%" },
                { label: "Followers", pct: "10%" },
                { label: "Admin Score", pct: "5%" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="text-center bg-muted rounded-lg p-3"
                >
                  <p className="font-bold text-gold text-xl">{item.pct}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground text-xs mt-3">
              <span className="text-gold font-bold">
                Vote for your favourite:
              </span>{" "}
              1 vote = ₹1 · Pay via UPI 9821432904 and send screenshot to
              WhatsApp. Votes are limited to once per profile per day.
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-card border border-border rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            <Tabs defaultValue="djs">
              <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-card border border-border p-1 mb-6">
                {tabConfig.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex-1 text-xs sm:text-sm data-[state=active]:gradient-gold data-[state=active]:text-[oklch(0.1_0.01_260)] data-[state=active]:font-bold"
                    data-ocid="rankings.category.tab"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {tabConfig.map((tab) => {
                const profiles = profilesByCategory[tab.value] ?? [];
                return (
                  <TabsContent key={tab.value} value={tab.value}>
                    {profiles.length === 0 ? (
                      <div
                        className="text-center py-16 text-muted-foreground bg-card border border-border rounded-xl"
                        data-ocid="rankings.empty_state"
                      >
                        <Trophy className="w-12 h-12 mx-auto mb-3 text-border opacity-50" />
                        <p className="font-display font-semibold text-lg text-foreground mb-1">
                          {tab.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          No profiles in this category yet. Check back soon!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {profiles.map((profile, index) => (
                          <ProfileCard
                            key={String(profile.id)}
                            profile={profile}
                            rank={index + 1}
                            index={index}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          )}
        </div>
      </section>
    </div>
  );
}
