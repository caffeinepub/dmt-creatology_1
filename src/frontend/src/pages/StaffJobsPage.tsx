import JobApplicationModal from "@/components/JobApplicationModal";
import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useActor } from "@/hooks/useActor";
import { Clock, IndianRupee, MapPin, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface JobListing {
  id: bigint;
  title: string;
  category: string;
  city: string;
  eventCompanyName: string;
  workDate: bigint;
  dailyWage: bigint;
  requiredStaffCount: bigint;
  description: string;
  isActive: boolean;
  createdAt: bigint;
}

const STATIC_JOBS: JobListing[] = [
  {
    id: BigInt(1),
    title: "Security Guard",
    category: "Security",
    city: "Mumbai",
    eventCompanyName: "Mumbai Events Co.",
    workDate: BigInt(new Date("2025-12-20").getTime()),
    dailyWage: BigInt(800),
    requiredStaffCount: BigInt(50),
    description:
      "Provide security at events, concerts, and venues. Experience in crowd management preferred.",
    isActive: true,
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(2),
    title: "Bartender",
    category: "Bartender",
    city: "Delhi",
    eventCompanyName: "NCR Hospitality",
    workDate: BigInt(new Date("2025-12-22").getTime()),
    dailyWage: BigInt(1200),
    requiredStaffCount: BigInt(20),
    description:
      "Professional bartending for high-end events, weddings, and corporate functions.",
    isActive: true,
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(3),
    title: "Event Technician",
    category: "Technician",
    city: "Bangalore",
    eventCompanyName: "Sunburn Festival",
    workDate: BigInt(new Date("2025-12-28").getTime()),
    dailyWage: BigInt(1500),
    requiredStaffCount: BigInt(15),
    description:
      "Set up and operate sound, lighting, and AV equipment for live events and concerts.",
    isActive: true,
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(4),
    title: "Bouncer",
    category: "Bouncer",
    city: "Mumbai",
    eventCompanyName: "Club Pyramid",
    workDate: BigInt(new Date("2025-12-25").getTime()),
    dailyWage: BigInt(900),
    requiredStaffCount: BigInt(25),
    description:
      "Access control and security at nightclubs, bars, and premium event venues.",
    isActive: true,
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(5),
    title: "Event Driver",
    category: "Driver",
    city: "Delhi",
    eventCompanyName: "VIP Transport Services",
    workDate: BigInt(new Date("2025-12-30").getTime()),
    dailyWage: BigInt(700),
    requiredStaffCount: BigInt(40),
    description:
      "Transport VIP guests, artists, and event staff. Must hold valid commercial license.",
    isActive: true,
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(6),
    title: "Volunteer Staff",
    category: "Volunteer",
    city: "Pune",
    eventCompanyName: "Pune Cultural Fest",
    workDate: BigInt(new Date("2026-01-05").getTime()),
    dailyWage: BigInt(500),
    requiredStaffCount: BigInt(100),
    description:
      "Help coordinate event activities, guide guests, and assist with general event management.",
    isActive: true,
    createdAt: BigInt(Date.now()),
  },
];

const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c", "sk-d", "sk-e", "sk-f"];

export default function StaffJobsPage() {
  const { actor, isFetching } = useActor();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (isFetching) return;
    if (!actor) {
      setJobs(STATIC_JOBS);
      setLoading(false);
      return;
    }
    (actor as any)
      .getActiveJobListings()
      .then((result: JobListing[]) => {
        setJobs(result.length > 0 ? result : STATIC_JOBS);
      })
      .catch(() => setJobs(STATIC_JOBS))
      .finally(() => setLoading(false));
  }, [actor, isFetching]);

  const formatDate = (ts: bigint) =>
    new Date(Number(ts)).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div>
      <PageHeader
        title="Staff Jobs"
        subtitle="Join India's largest event workforce network. Flexible work, competitive pay."
        breadcrumb="Career Opportunities"
      />

      <section className="py-10">
        <div className="container mx-auto px-4">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Active Jobs", value: "500+" },
              { label: "Cities", value: "100+" },
              { label: "Staff Placed", value: "25,000+" },
              { label: "Target Network", value: "50,00,000" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-card border border-border rounded-lg p-4 text-center"
              >
                <p className="font-display font-black text-2xl text-gold">
                  {stat.value}
                </p>
                <p className="text-muted-foreground text-sm mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SKELETON_KEYS.map((k) => (
                <div
                  key={k}
                  className="h-56 rounded-xl bg-card/50 animate-pulse border border-border"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job, i) => (
                <Card
                  key={String(job.id)}
                  className="bg-card border-border card-hover"
                  data-ocid={`jobs.item.${i + 1}`}
                >
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display font-bold text-lg text-foreground">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                          <MapPin className="w-3 h-3 text-gold" />
                          <span>{job.city}</span>
                          {job.eventCompanyName && (
                            <span className="text-muted-foreground/60">
                              {" "}
                              · {job.eventCompanyName}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-gold/40 text-gold shrink-0 text-xs"
                      >
                        {job.category}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 bg-muted rounded px-2 py-1">
                        <IndianRupee className="w-3 h-3 text-gold" />
                        <span className="text-sm font-bold text-foreground">
                          ₹{String(job.dailyWage)}/day
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-muted rounded px-2 py-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {formatDate(job.workDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-muted rounded px-2 py-1">
                        <Users className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {String(job.requiredStaffCount)} needed
                        </span>
                      </div>
                    </div>

                    <Button
                      className="w-full gradient-gold text-[oklch(0.1_0.01_260)] font-bold hover:opacity-90"
                      onClick={() => {
                        setSelectedJob(job);
                        setModalOpen(true);
                      }}
                      data-ocid="jobs.open_modal_button"
                    >
                      Apply for Job
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <JobApplicationModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedJob(null);
        }}
        job={selectedJob}
      />
    </div>
  );
}
