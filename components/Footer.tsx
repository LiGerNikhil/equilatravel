import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, Globe, MapPin, MessageCircle, Facebook, Instagram } from "lucide-react";

const serviceAreas = [
  "City Travel",
  "Airport Pickup & Drop",
  "Outstation Tours",
  "Corporate Travel",
  "Hourly Cab Rentals",
];

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Fleet", href: "/fleet" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
];

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: "#0D2317" }}
    >
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#11291C] to-transparent" />

      {/* Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(17, 41, 28, 0.18) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5 group">
              <div className="w-28 h-28 overflow-hidden">
                <Image
                  src="/images/logo/logo.png"
                  alt="Equila Travel logo"
                  width={112}
                  height={112}
                  className="object-contain"
                />
              </div>
            </Link>
            <p
              className="text-white/40 font-body text-sm leading-relaxed mb-5"
              style={{ fontWeight: 300 }}
            >
              Your trusted partner for comfortable, reliable, and premium cab
              services across India. Available 24/7.
            </p>
            <div className="flex gap-3">
              <a
                href="tel:+918796770014"
                className="w-9 h-9 flex items-center justify-center border border-[rgba(201,168,76,0.25)] hover:border-[#c9a84c] transition-colors rounded-sm"
                aria-label="Call us"
              >
                <Phone size={14} className="text-[#c9a84c]" />
              </a>
              <a
                href="https://wa.me/918796770014"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center border border-[rgba(201,168,76,0.25)] hover:border-[#c9a84c] transition-colors rounded-sm"
                aria-label="WhatsApp"
              >
                <MessageCircle size={14} className="text-[#c9a84c]" />
              </a>
              <a
                href="https://www.facebook.com/share/1H31tjudvs/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center border border-[rgba(201,168,76,0.25)] hover:border-[#c9a84c] transition-colors rounded-sm"
                aria-label="Facebook"
              >
                <Facebook size={14} className="text-[#c9a84c]" />
              </a>
              <a
                href="https://www.instagram.com/equilatravel?igsh=MXh4ZWt0MGx1Nmg1Yg=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center border border-[rgba(201,168,76,0.25)] hover:border-[#c9a84c] transition-colors rounded-sm"
                aria-label="Instagram"
              >
                <Instagram size={14} className="text-[#c9a84c]" />
              </a>
              <a
                href="mailto:Info@equilatravel.com"
                className="w-9 h-9 flex items-center justify-center border border-[rgba(201,168,76,0.25)] hover:border-[#c9a84c] transition-colors rounded-sm"
                aria-label="Email us"
              >
                <Mail size={14} className="text-[#c9a84c]" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body font-semibold text-white text-sm tracking-widest uppercase mb-5 flex items-center gap-2">
              <span className="h-px w-4 bg-[#c9a84c]" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/40 hover:text-[#c9a84c] font-body text-sm transition-colors animate-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h4 className="font-body font-semibold text-white text-sm tracking-widest uppercase mb-5 flex items-center gap-2">
              <span className="h-px w-4 bg-[#c9a84c]" />
              Service Areas
            </h4>
            <ul className="space-y-3">
              {serviceAreas.map((s) => (
                <li
                  key={s}
                  className="flex items-center gap-2 text-white/40 font-body text-sm"
                >
                  <MapPin size={11} className="text-[#c9a84c] flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body font-semibold text-white text-sm tracking-widest uppercase mb-5 flex items-center gap-2">
              <span className="h-px w-4 bg-[#c9a84c]" />
              Contact
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+918796770014"
                  className="flex items-start gap-3 text-white/40 hover:text-[#c9a84c] transition-colors group"
                >
                  <Phone
                    size={14}
                    className="text-[#c9a84c] mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <div className="text-[10px] text-white/30 tracking-widest uppercase mb-0.5">
                      Phone
                    </div>
                    <span className="font-body text-sm">+91 87967 70014</span>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="mailto:Info@equilatravel.com"
                  className="flex items-start gap-3 text-white/40 hover:text-[#c9a84c] transition-colors"
                >
                  <Mail
                    size={14}
                    className="text-[#c9a84c] mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <div className="text-[10px] text-white/30 tracking-widest uppercase mb-0.5">
                      Email
                    </div>
                    <span className="font-body text-sm">
                      Info@equilatravel.com
                    </span>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="https://www.equilatravel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-white/40 hover:text-[#c9a84c] transition-colors"
                >
                  <Globe
                    size={14}
                    className="text-[#c9a84c] mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <div className="text-[10px] text-white/30 tracking-widest uppercase mb-0.5">
                      Website
                    </div>
                    <span className="font-body text-sm">
                      www.equilatravel.com
                    </span>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.2)] to-transparent mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
          <div className="text-white/25 font-body text-xs">
            © {new Date().getFullYear()} Equila Travel. All rights reserved.
          </div>
          <div className="text-white/25 font-body text-xs">
            A brand of{" "}
            <span className="text-[#c9a84c]/60">Equila Solutions Pvt Ltd</span>
          </div>
          <div className="flex items-center gap-1 text-white/25 font-body text-xs">
            <span>Crafted with</span>
            <span className="text-[#c9a84c]">♦</span>
            <span>in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
