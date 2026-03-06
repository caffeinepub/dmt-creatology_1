import BookingModal from "@/components/BookingModal";
import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, IndianRupee, MapPin, Users } from "lucide-react";
import { useState } from "react";

const jobs = [
  {
    title: "Security Guard",
    location: "Mumbai, Maharashtra",
    wage: "₹800/day",
    type: "Full Day",
    openings: 50,
    description:
      "Provide security at events, concerts, and venues. Experience in crowd management preferred.",
    skills: ["Crowd Control", "First Aid", "Communication"],
    service: "Security Guard Staff Application",
  },
  {
    title: "Bartender",
    location: "Delhi, NCR",
    wage: "₹1,200/day",
    type: "Evening Shift",
    openings: 20,
    description:
      "Professional bartending for high-end events, weddings, and corporate functions.",
    skills: ["Cocktail Making", "Customer Service", "Hygiene"],
    service: "Bartender Staff Application",
  },
  {
    title: "Event Technician",
    location: "Bangalore, Karnataka",
    wage: "₹1,500/day",
    type: "Full Day",
    openings: 15,
    description:
      "Set up and operate sound, lighting, and AV equipment for live events and concerts.",
    skills: ["AV Equipment", "Sound Systems", "Lighting"],
    service: "Event Technician Staff Application",
  },
  {
    title: "Stage Crew",
    location: "Pune, Maharashtra",
    wage: "₹1,000/day",
    type: "Full Day",
    openings: 30,
    description:
      "Stage setup, rigging, and breakdown for concerts, theatre productions, and events.",
    skills: ["Heavy Lifting", "Rigging", "Teamwork"],
    service: "Stage Crew Staff Application",
  },
  {
    title: "Bouncer",
    location: "Mumbai, Maharashtra",
    wage: "₹900/day",
    type: "Night Shift",
    openings: 25,
    description:
      "Access control and security at nightclubs, bars, and premium event venues.",
    skills: ["Security", "Conflict Resolution", "Physical Fitness"],
    service: "Bouncer Staff Application",
  },
  {
    title: "Event Driver",
    location: "Delhi, NCR",
    wage: "₹700/day",
    type: "Flexible",
    openings: 40,
    description:
      "Transport VIP guests, artists, and event staff. Must hold valid commercial license.",
    skills: ["Commercial License", "Navigation", "Punctuality"],
    service: "Event Driver Staff Application",
  },
];

export default function StaffJobsPage() {
  const [selected, setSelected] = useState<string>("");
  const [open, setOpen] = useState(false);

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job, i) => (
              <Card
                key={job.title}
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
                        <span>{job.location}</span>
                      </div>
                    </div>
                    <Badge className="gradient-gold text-[oklch(0.1_0.01_260)] border-0 shrink-0">
                      {job.openings} openings
                    </Badge>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 bg-muted rounded px-2 py-1">
                      <IndianRupee className="w-3 h-3 text-gold" />
                      <span className="text-sm font-bold text-foreground">
                        {job.wage}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-muted rounded px-2 py-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {job.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-muted rounded px-2 py-1">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {job.openings} needed
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="text-xs border-border text-muted-foreground"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    className="w-full gradient-gold text-[oklch(0.1_0.01_260)] font-bold hover:opacity-90"
                    onClick={() => {
                      setSelected(job.service);
                      setOpen(true);
                    }}
                    data-ocid="booking.open_modal_button"
                  >
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <BookingModal
        open={open}
        onClose={() => setOpen(false)}
        prefillService={selected}
        buttonLabel="Apply Now"
      />
    </div>
  );
}
