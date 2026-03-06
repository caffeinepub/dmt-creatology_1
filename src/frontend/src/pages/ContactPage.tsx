import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCheck,
  Clock,
  Copy,
  CreditCard,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import { useState } from "react";

const whatsappContacts = [
  {
    label: "WhatsApp Support 1",
    number: "+91 9317906033",
    href: "https://wa.me/919317906033",
    description: "General inquiries and booking support",
  },
  {
    label: "WhatsApp Support 2",
    number: "+91 9821432904",
    href: "https://wa.me/919821432904",
    description: "Bookings, payments, and services",
  },
  {
    label: "Business WhatsApp",
    number: "+91 8626880603",
    href: "https://wa.me/918626880603",
    description: "Business partnerships and vendor onboarding",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    service: "",
    date: "",
    message: "",
  });
  const [copied, setCopied] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Contact Request - DMT CREATOLOGY
Name: ${form.name}
Phone: ${form.phone}
City: ${form.city}
Service: ${form.service}
Date: ${form.date}
Message: ${form.message}`;
    window.open(
      `https://wa.me/919821432904?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  const copyUPI = () => {
    navigator.clipboard.writeText("9821432904");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <PageHeader
        title="Contact Us"
        subtitle="Get in touch for bookings, partnerships, advertising, or any queries"
        breadcrumb="Contact"
      />

      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: Info */}
            <div className="space-y-6">
              {/* WhatsApp Buttons */}
              <div>
                <h2 className="font-display font-bold text-xl text-foreground mb-4">
                  WhatsApp Support
                </h2>
                <div className="space-y-3">
                  {whatsappContacts.map((contact, i) => (
                    <a
                      key={contact.number}
                      href={contact.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                      data-ocid={`contact.whatsapp_button.${i + 1}`}
                    >
                      <Card className="bg-card border-border hover:border-green-500/50 card-hover cursor-pointer">
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                            <MessageCircle className="w-6 h-6 text-green-500" />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-foreground">
                              {contact.number}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              {contact.label}
                            </p>
                            <p className="text-muted-foreground text-xs mt-0.5">
                              {contact.description}
                            </p>
                          </div>
                          <div className="shrink-0">
                            <span className="text-green-500 text-sm font-medium">
                              Chat →
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  ))}
                </div>
              </div>

              {/* Payment Section */}
              <div>
                <h2 className="font-display font-bold text-xl text-foreground mb-4">
                  Payment Information
                </h2>
                <Card className="bg-card border border-gold/30">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-gold" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">
                          UPI / Google Pay
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Instant payment accepted
                        </p>
                      </div>
                    </div>

                    <div className="bg-muted rounded-xl p-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">
                          UPI ID / Phone Number
                        </p>
                        <p className="font-display font-black text-2xl text-gold tracking-widest">
                          9821432904
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyUPI}
                        className="border-gold/30 text-gold hover:bg-gold/10 shrink-0"
                      >
                        {copied ? (
                          <CheckCheck className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                    </div>

                    <div className="space-y-1.5 text-sm text-muted-foreground">
                      <p>
                        ✅ Step 1: Pay the required amount via UPI/Google Pay
                      </p>
                      <p>
                        ✅ Step 2: Take a screenshot of the payment confirmation
                      </p>
                      <p>
                        ✅ Step 3: Send the screenshot on WhatsApp: +91
                        9821432904
                      </p>
                      <p>
                        ✅ Step 4: We'll confirm your booking within 30 minutes
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Other contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="bg-card border-border">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gold shrink-0" />
                    <div>
                      <p className="font-bold text-foreground text-sm">Phone</p>
                      <p className="text-muted-foreground text-sm">
                        +91 8626880603
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gold shrink-0" />
                    <div>
                      <p className="font-bold text-foreground text-sm">Email</p>
                      <p className="text-muted-foreground text-sm">
                        info@dmtcreatology.com
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border sm:col-span-2">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gold shrink-0" />
                    <div>
                      <p className="font-bold text-foreground text-sm">
                        Business Hours
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Monday – Sunday: 9:00 AM – 9:00 PM IST
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div>
              <h2 className="font-display font-bold text-xl text-foreground mb-4">
                Send Us a Message
              </h2>
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="contact_name">Full Name *</Label>
                        <Input
                          id="contact_name"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          required
                          className="bg-input border-border focus:border-gold"
                          data-ocid="booking.name_input"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="contact_phone">Phone Number *</Label>
                        <Input
                          id="contact_phone"
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+91 XXXXX XXXXX"
                          required
                          className="bg-input border-border focus:border-gold"
                          data-ocid="booking.phone_input"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="contact_city">City *</Label>
                        <Input
                          id="contact_city"
                          name="city"
                          value={form.city}
                          onChange={handleChange}
                          placeholder="Your city"
                          required
                          className="bg-input border-border focus:border-gold"
                          data-ocid="booking.city_input"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="contact_service">
                          Service Required
                        </Label>
                        <Input
                          id="contact_service"
                          name="service"
                          value={form.service}
                          onChange={handleChange}
                          placeholder="Service needed"
                          className="bg-input border-border focus:border-gold"
                          data-ocid="booking.service_input"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="contact_date">Preferred Date</Label>
                      <Input
                        id="contact_date"
                        name="date"
                        type="date"
                        value={form.date}
                        onChange={handleChange}
                        className="bg-input border-border focus:border-gold"
                        data-ocid="booking.date_input"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="contact_message">Message *</Label>
                      <Textarea
                        id="contact_message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us what you need..."
                        rows={4}
                        required
                        className="bg-input border-border focus:border-gold resize-none"
                        data-ocid="booking.message_textarea"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full gradient-gold text-[oklch(0.1_0.01_260)] font-bold hover:opacity-90"
                      data-ocid="booking.submit_button"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send via WhatsApp
                    </Button>

                    <p className="text-muted-foreground text-xs text-center">
                      Your message will be sent directly via WhatsApp for faster
                      response.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
