import type { Event } from "@/backend";
import { Status } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActor } from "@/hooks/useActor";
import { useOrganiserAuth } from "@/hooks/useOrganiserAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  Edit2,
  Eye,
  Loader2,
  LogOut,
  Plus,
  Radio,
  Zap,
} from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

function formatDate(ns: bigint) {
  return new Date(Number(ns) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: Status }) {
  if (status === Status.published) {
    return (
      <Badge className="bg-green-500/15 text-green-400 border-green-500/30 text-xs">
        <Radio size={9} className="mr-1" /> LIVE
      </Badge>
    );
  }
  if (status === Status.draft) {
    return (
      <Badge className="bg-slate-500/15 text-slate-400 border-slate-500/30 text-xs">
        DRAFT
      </Badge>
    );
  }
  return (
    <Badge className="bg-red-500/15 text-red-400 border-red-500/30 text-xs">
      CANCELLED
    </Badge>
  );
}

function EventCard({
  event,
  onPublish,
  isPublishing,
}: {
  event: Event;
  onPublish: (id: bigint) => void;
  isPublishing: boolean;
}) {
  const goEdit = () => {
    window.location.href = `/organiser/edit-event/${String(event.id)}`;
  };

  return (
    <div
      className="border border-white/10 rounded-xl p-5 flex flex-col gap-3 hover:border-red-500/30 transition-colors"
      style={{ background: "rgba(15,15,15,0.8)" }}
      data-ocid="organiser.events.card"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-base truncate">
            {event.name}
          </h3>
          <p className="text-slate-400 text-sm mt-0.5">
            {event.venue} &bull; {event.city}
          </p>
        </div>
        <StatusBadge status={event.status} />
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-500">
        <CalendarDays size={12} />
        <span>{formatDate(event.date)}</span>
        <span className="text-slate-700">&bull;</span>
        <span className="text-red-400/80">{event.category}</span>
      </div>

      <div className="flex items-center gap-2 mt-1">
        <Button
          variant="outline"
          size="sm"
          onClick={goEdit}
          className="border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-xs h-8"
          data-ocid="organiser.events.edit_button"
        >
          <Edit2 size={12} className="mr-1.5" /> Edit
        </Button>

        {event.status === Status.draft && (
          <Button
            size="sm"
            onClick={() => onPublish(event.id)}
            disabled={isPublishing}
            className="bg-red-600 hover:bg-red-700 text-white text-xs h-8 font-semibold"
            data-ocid="organiser.events.primary_button"
          >
            {isPublishing ? (
              <Loader2 size={12} className="animate-spin mr-1.5" />
            ) : (
              <Eye size={12} className="mr-1.5" />
            )}
            Publish
          </Button>
        )}
      </div>
    </div>
  );
}

export default function OrganiserDashboardPage() {
  const { session, logout, isAuthenticated } = useOrganiserAuth();
  const { actor } = useActor();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/organiser/login";
    }
  }, [isAuthenticated]);

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["organiserEvents", session?.organiserId],
    queryFn: async () => {
      if (!actor || !session) return [];
      return actor.getEventsByOrganiser(BigInt(session.organiserId));
    },
    enabled: !!actor && !!session,
  });

  const publishMutation = useMutation({
    mutationFn: async (eventId: bigint) => {
      if (!actor || !session) throw new Error("Not connected");
      return actor.publishEventAsOrganiser(
        BigInt(session.organiserId),
        eventId,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organiserEvents"] });
      toast.success("Event published!");
    },
    onError: () => toast.error("Failed to publish event."),
  });

  const handleLogout = () => {
    logout();
    window.location.href = "/organiser/login";
  };

  const goCreate = () => {
    window.location.href = "/organiser/create-event";
  };

  if (!isAuthenticated || !session) return null;

  const liveEvents = events.filter((e) => e.status === Status.published);
  const draftEvents = events.filter((e) => e.status === Status.draft);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header
        className="border-b border-white/10 px-6 py-4 flex items-center justify-between"
        style={{ background: "rgba(10,10,10,0.95)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-600/30 flex items-center justify-center">
            <Zap size={16} className="text-red-500" />
          </div>
          <div>
            <div className="text-white font-bold text-sm">DMT CREATOLOGY</div>
            <div className="text-red-500 text-[10px] font-semibold uppercase tracking-widest">
              Organiser Portal
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-sm hidden sm:block">
            Hello,{" "}
            <span className="text-white font-semibold">{session.name}</span>
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
            data-ocid="organiser.header.logout_button"
          >
            <LogOut size={14} className="mr-1.5" /> Logout
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Total Events",
              value: events.length,
              color: "text-white",
            },
            {
              label: "Live Events",
              value: liveEvents.length,
              color: "text-green-400",
            },
            {
              label: "Drafts",
              value: draftEvents.length,
              color: "text-slate-400",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border border-white/10 rounded-xl p-5 text-center"
              style={{ background: "rgba(15,15,15,0.8)" }}
            >
              <div className={`text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-slate-500 text-xs mt-1 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-white">My Events</h1>
          <Button
            onClick={goCreate}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold text-sm"
            data-ocid="organiser.dashboard.primary_button"
          >
            <Plus size={16} className="mr-1.5" /> Create New Event
          </Button>
        </div>

        {isLoading && (
          <div
            className="flex items-center justify-center py-16 text-slate-500"
            data-ocid="organiser.dashboard.loading_state"
          >
            <Loader2 size={24} className="animate-spin mr-3" />
            Loading events...
          </div>
        )}

        {!isLoading && (
          <Tabs defaultValue="all">
            <TabsList className="bg-white/5 border border-white/10 mb-6">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-slate-400"
                data-ocid="organiser.all.tab"
              >
                ALL ({events.length})
              </TabsTrigger>
              <TabsTrigger
                value="live"
                className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-slate-400"
                data-ocid="organiser.live.tab"
              >
                LIVE ({liveEvents.length})
              </TabsTrigger>
              <TabsTrigger
                value="draft"
                className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-slate-400"
                data-ocid="organiser.draft.tab"
              >
                DRAFT ({draftEvents.length})
              </TabsTrigger>
            </TabsList>

            {(["all", "live", "draft"] as const).map((tab) => {
              const list =
                tab === "all"
                  ? events
                  : tab === "live"
                    ? liveEvents
                    : draftEvents;
              return (
                <TabsContent key={tab} value={tab}>
                  {list.length === 0 ? (
                    <div
                      className="border border-white/10 rounded-xl p-12 text-center"
                      data-ocid="organiser.events.empty_state"
                    >
                      <CalendarDays
                        size={40}
                        className="text-slate-700 mx-auto mb-4"
                      />
                      <p className="text-slate-400 text-base font-medium mb-4">
                        No events yet
                      </p>
                      <Button
                        onClick={goCreate}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold"
                        data-ocid="organiser.events.open_modal_button"
                      >
                        <Plus size={16} className="mr-1.5" /> Create Your First
                        Event
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {list.map((event) => (
                        <EventCard
                          key={String(event.id)}
                          event={event}
                          onPublish={(id) => publishMutation.mutate(id)}
                          isPublishing={publishMutation.isPending}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        )}
      </main>
    </div>
  );
}
