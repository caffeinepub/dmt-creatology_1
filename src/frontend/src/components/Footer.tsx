import { Link } from "@tanstack/react-router";
import { CreditCard, Mail, MessageCircle, Phone } from "lucide-react";

const whatsappNumbers = [
  {
    number: "+91 9317906033",
    href: "https://wa.me/919317906033",
    label: "Support 1",
  },
  {
    number: "+91 9821432904",
    href: "https://wa.me/919821432904",
    label: "Support 2",
  },
  {
    number: "+91 8626880603",
    href: "https://wa.me/918626880603",
    label: "Business",
  },
];

const quickLinks = [
  { label: "Events", path: "/events" },
  { label: "Hotels", path: "/hotels" },
  { label: "Food", path: "/food" },
  { label: "Venues", path: "/venues" },
  { label: "Transport", path: "/transport" },
  { label: "Vendors", path: "/vendors" },
] as const;

const moreLinks = [
  { label: "Artists", path: "/artists" },
  { label: "Staff Jobs", path: "/staff-jobs" },
  { label: "Digital Products", path: "/digital-products" },
  { label: "Business Services", path: "/business-services" },
  { label: "Rankings", path: "/rankings" },
  { label: "Advertise", path: "/advertise" },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-zinc-950">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div>
              <h2 className="font-display font-black text-2xl">
                <span className="text-red-500">DMT</span>
                <span className="text-white ml-1.5">CREATOLOGY</span>
              </h2>
              <p className="text-white/50 text-sm mt-2 leading-relaxed">
                India's Premier Event & Entertainment Platform. Your one-stop
                destination for events, hospitality, and creative services.
              </p>
            </div>

            {/* Payment */}
            <div className="bg-zinc-900 border border-red-900/40 rounded-lg p-3 space-y-1">
              <div className="flex items-center gap-2 text-red-500">
                <CreditCard className="w-4 h-4" />
                <span className="font-bold text-sm">Payment</span>
              </div>
              <p className="text-white text-sm font-medium">UPI / Google Pay</p>
              <p className="text-red-500 font-bold text-lg tracking-wide">
                9821432904
              </p>
              <p className="text-white/40 text-xs">
                Pay and send screenshot on WhatsApp
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider text-red-500">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/50 hover:text-red-400 transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h3 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider text-red-500">
              Services
            </h3>
            <ul className="space-y-2">
              {moreLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/50 hover:text-red-400 transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider text-red-500">
              Contact Us
            </h3>
            <div className="space-y-3">
              {whatsappNumbers.map((item, i) => (
                <a
                  key={item.number}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/50 hover:text-red-400 transition-colors duration-200 group"
                  data-ocid={`footer.whatsapp_link.${i + 1}`}
                >
                  <MessageCircle className="w-4 h-4 text-green-500 group-hover:scale-110 transition-transform shrink-0" />
                  <div>
                    <p className="text-xs text-white/30">{item.label}</p>
                    <p className="text-sm font-medium">{item.number}</p>
                  </div>
                </a>
              ))}

              <div className="flex items-center gap-2 text-white/50 pt-2">
                <Phone className="w-4 h-4 shrink-0" />
                <div>
                  <p className="text-xs text-white/30">Business</p>
                  <p className="text-sm font-medium">+91 8626880603</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-white/50">
                <Mail className="w-4 h-4 shrink-0" />
                <p className="text-sm">info@dmtcreatology.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>© {year} DMT CREATOLOGY. All rights reserved.</p>
          <p>
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
