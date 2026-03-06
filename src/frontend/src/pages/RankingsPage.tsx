import BookingModal from "@/components/BookingModal";
import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Star, TrendingUp, Trophy } from "lucide-react";
import { useState } from "react";

const rankingData: Record<
  string,
  Array<{
    rank: number;
    name: string;
    city: string;
    rating: number;
    reviews: number;
    specialty: string;
    bookings: number;
    service: string;
  }>
> = {
  djs: [
    {
      rank: 1,
      name: "DJ Arjun Singh",
      city: "Mumbai",
      rating: 5.0,
      reviews: 1240,
      specialty: "EDM & Bollywood",
      bookings: 350,
      service: "DJ Arjun Singh",
    },
    {
      rank: 2,
      name: "DJ Storm",
      city: "Delhi",
      rating: 4.9,
      reviews: 980,
      specialty: "House & Techno",
      bookings: 280,
      service: "DJ Storm",
    },
    {
      rank: 3,
      name: "DJ Mia",
      city: "Bangalore",
      rating: 4.8,
      reviews: 760,
      specialty: "Commercial & Club",
      bookings: 220,
      service: "DJ Mia",
    },
    {
      rank: 4,
      name: "DJ Ravi Kumar",
      city: "Pune",
      rating: 4.7,
      reviews: 640,
      specialty: "Fusion",
      bookings: 190,
      service: "DJ Ravi Kumar",
    },
    {
      rank: 5,
      name: "DJ Nova",
      city: "Hyderabad",
      rating: 4.6,
      reviews: 520,
      specialty: "Trance & Prog",
      bookings: 160,
      service: "DJ Nova",
    },
  ],
  photographers: [
    {
      rank: 1,
      name: "Raj Photography",
      city: "Mumbai",
      rating: 5.0,
      reviews: 890,
      specialty: "Wedding",
      bookings: 400,
      service: "Raj Photography",
    },
    {
      rank: 2,
      name: "Lens & Light Studio",
      city: "Delhi",
      rating: 4.9,
      reviews: 740,
      specialty: "Fashion",
      bookings: 310,
      service: "Lens Light Studio",
    },
    {
      rank: 3,
      name: "Moments Captured",
      city: "Goa",
      rating: 4.8,
      reviews: 620,
      specialty: "Events",
      bookings: 250,
      service: "Moments Captured",
    },
    {
      rank: 4,
      name: "Click Masters",
      city: "Chennai",
      rating: 4.7,
      reviews: 510,
      specialty: "Portrait",
      bookings: 200,
      service: "Click Masters",
    },
    {
      rank: 5,
      name: "Golden Frame",
      city: "Kolkata",
      rating: 4.6,
      reviews: 430,
      specialty: "Commercial",
      bookings: 170,
      service: "Golden Frame",
    },
  ],
  makeup: [
    {
      rank: 1,
      name: "Glam Studio",
      city: "Delhi",
      rating: 5.0,
      reviews: 1100,
      specialty: "Bridal",
      bookings: 500,
      service: "Glam Studio",
    },
    {
      rank: 2,
      name: "Beauty by Ananya",
      city: "Mumbai",
      rating: 4.9,
      reviews: 920,
      specialty: "Celebrity",
      bookings: 380,
      service: "Beauty by Ananya",
    },
    {
      rank: 3,
      name: "Makeover Magic",
      city: "Bangalore",
      rating: 4.8,
      reviews: 750,
      specialty: "Fashion",
      bookings: 290,
      service: "Makeover Magic",
    },
    {
      rank: 4,
      name: "Artistry by Priya",
      city: "Jaipur",
      rating: 4.7,
      reviews: 580,
      specialty: "Traditional",
      bookings: 230,
      service: "Artistry by Priya",
    },
    {
      rank: 5,
      name: "Flawless Studio",
      city: "Hyderabad",
      rating: 4.6,
      reviews: 460,
      specialty: "Airbrush",
      bookings: 185,
      service: "Flawless Studio",
    },
  ],
  wedding_planners: [
    {
      rank: 1,
      name: "Dream Weddings India",
      city: "Mumbai",
      rating: 5.0,
      reviews: 680,
      specialty: "Destination Wedding",
      bookings: 150,
      service: "Dream Weddings India",
    },
    {
      rank: 2,
      name: "Royal Celebrations",
      city: "Delhi",
      rating: 4.9,
      reviews: 590,
      specialty: "Grand Wedding",
      bookings: 130,
      service: "Royal Celebrations",
    },
    {
      rank: 3,
      name: "Wedding Bells",
      city: "Jaipur",
      rating: 4.8,
      reviews: 490,
      specialty: "Heritage Wedding",
      bookings: 110,
      service: "Wedding Bells",
    },
    {
      rank: 4,
      name: "Forever After",
      city: "Goa",
      rating: 4.7,
      reviews: 420,
      specialty: "Beach Wedding",
      bookings: 95,
      service: "Forever After",
    },
    {
      rank: 5,
      name: "Eternal Vows",
      city: "Bangalore",
      rating: 4.6,
      reviews: 360,
      specialty: "Modern Wedding",
      bookings: 80,
      service: "Eternal Vows",
    },
  ],
  models: [
    {
      rank: 1,
      name: "Priya Sharma",
      city: "Delhi",
      rating: 5.0,
      reviews: 540,
      specialty: "Fashion & Runway",
      bookings: 200,
      service: "Priya Sharma",
    },
    {
      rank: 2,
      name: "Aisha Khan",
      city: "Mumbai",
      rating: 4.9,
      reviews: 480,
      specialty: "Commercial",
      bookings: 175,
      service: "Aisha Khan",
    },
    {
      rank: 3,
      name: "Ritu Kapoor",
      city: "Bangalore",
      rating: 4.8,
      reviews: 410,
      specialty: "Brand Ambassador",
      bookings: 150,
      service: "Ritu Kapoor",
    },
    {
      rank: 4,
      name: "Sneha Patel",
      city: "Pune",
      rating: 4.7,
      reviews: 360,
      specialty: "Print & Digital",
      bookings: 130,
      service: "Sneha Patel",
    },
    {
      rank: 5,
      name: "Kavya Nair",
      city: "Chennai",
      rating: 4.6,
      reviews: 310,
      specialty: "Fitness & Sports",
      bookings: 110,
      service: "Kavya Nair",
    },
  ],
};

const tabConfig = [
  { value: "djs", label: "Top DJs" },
  { value: "photographers", label: "Photographers" },
  { value: "makeup", label: "Makeup Artists" },
  { value: "wedding_planners", label: "Wedding Planners" },
  { value: "models", label: "Models" },
];

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
  "bg-border border-border",
  "bg-border border-border",
];

export default function RankingsPage() {
  const [selectedService, setSelectedService] = useState("");
  const [open, setOpen] = useState(false);

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
              WhatsApp
            </p>
          </div>

          <Tabs defaultValue="djs">
            <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-card border border-border p-1 mb-6">
              {tabConfig.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex-1 text-xs sm:text-sm data-[state=active]:gradient-gold data-[state=active]:text-[oklch(0.1_0.01_260)] data-[state=active]:font-bold"
                  data-ocid="rankings.tab"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabConfig.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                <div className="space-y-4">
                  {rankingData[tab.value].map((entry) => (
                    <Card
                      key={entry.rank}
                      className={`border ${rankBg[entry.rank - 1]} bg-card card-hover`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          {/* Rank */}
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${rankBg[entry.rank - 1]} border`}
                          >
                            {entry.rank === 1 ? (
                              <Trophy className={`w-6 h-6 ${rankColors[0]}`} />
                            ) : (
                              <span
                                className={`font-display font-black text-xl ${rankColors[entry.rank - 1]}`}
                              >
                                #{entry.rank}
                              </span>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-display font-bold text-foreground">
                                {entry.name}
                              </h3>
                              {entry.rank === 1 && (
                                <Badge className="gradient-gold text-[oklch(0.1_0.01_260)] border-0 text-xs">
                                  #1 IN INDIA
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                              <span className="flex items-center gap-1 text-muted-foreground text-sm">
                                <MapPin className="w-3 h-3 text-gold" />
                                {entry.city}
                              </span>
                              <span className="text-muted-foreground text-sm">
                                {entry.specialty}
                              </span>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3.5 h-3.5 ${star <= Math.floor(entry.rating) ? "text-gold fill-gold" : "text-muted-foreground"}`}
                                />
                              ))}
                              <span className="text-foreground text-sm font-bold ml-1">
                                {entry.rating.toFixed(1)}
                              </span>
                            </div>
                            <p className="text-muted-foreground text-xs">
                              {entry.reviews} reviews
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {entry.bookings} bookings
                            </p>
                          </div>

                          {/* Book */}
                          <Button
                            size="sm"
                            className="shrink-0 gradient-gold text-[oklch(0.1_0.01_260)] font-bold hover:opacity-90"
                            onClick={() => {
                              setSelectedService(entry.service);
                              setOpen(true);
                            }}
                            data-ocid="booking.open_modal_button"
                          >
                            Book Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <BookingModal
        open={open}
        onClose={() => setOpen(false)}
        prefillService={selectedService}
      />
    </div>
  );
}
