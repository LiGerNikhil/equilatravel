"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, MessageCircle, Lock } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Fleet", href: "/fleet" },
  { label: "Contact", href: "/contact" },
  // Admin login link (visible in header and mobile menu)
  { label: "Admin", href: "/admin/login" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-[#0D2317]/95 backdrop-blur-xl border-b border-[#11291C]/20 shadow-[0_4px_30px_rgba(0,0,0,0.35)] transition-all duration-500"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24 md:h-28">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-4 group">
              <div className="relative w-24 h-24 md:w-28 md:h-28 overflow-hidden">
                <Image
                  src="/images/logo/logo.png"
                  alt="Equila Travel logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) =>
                link.label === "Admin" ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-1.5 text-base font-body tracking-widest uppercase text-red-400 hover:text-red-300 transition-colors duration-300"
                  >
                    <Lock size={14} />
                    {link.label}
                  </Link>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`animate-underline text-base font-body tracking-widest uppercase transition-colors duration-300 ${
                      pathname === link.href
                        ? "text-[#c9a84c]"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href="tel:+918796770014"
                className="flex items-center gap-2 text-base text-[#c9a84c] font-body font-semibold tracking-wide hover:text-[#f5e6b8] transition-colors"
              >
                <Phone size={16} />
                +91 87967 70014
              </a>
              <Link href="/contact" className="btn-gold text-sm px-6 py-3">
                Book Now
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden relative w-12 h-12 flex items-center justify-center border border-[#11291C] rounded"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? (
                <X size={20} className="text-[#c9a84c]" />
              ) : (
                <Menu size={20} className="text-[#c9a84c]" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Floating WhatsApp action */}
      <a
        href="https://wa.me/918796770014"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-4 right-4 z-60 flex items-center gap-3 rounded-full bg-[#25d366] px-4 py-3 shadow-[0_18px_50px_rgba(37,211,102,0.28)] transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#25d366]/70"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#128c7e] shadow-sm">
          <MessageCircle size={22} />
        </div>
        <span className="hidden md:inline-flex text-sm font-semibold uppercase tracking-[0.2em] text-[#050a08]">
          WhatsApp
        </span>
      </a>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{
          background: "rgba(9, 29, 18, 0.98)",
          backdropFilter: "blur(20px)",
        }}
        ref={menuRef}
      >
        {/* Gold ornament top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />

        <div className="flex flex-col items-center h-full gap-2 px-6 pt-24 pb-8 overflow-y-auto">
          {navLinks.map((link, i) =>
            link.label === "Admin" ? (
              <Link
                key={link.href}
                href={link.href}
                className="w-full text-center py-4 font-display text-2xl font-medium border-b border-[rgba(201,168,76,0.1)] text-red-400 hover:text-red-300 transition-colors duration-300 flex items-center justify-center gap-2"
                style={{ transitionDelay: `${i * 60}ms` }}
                onClick={() => setOpen(false)}
              >
                <Lock size={18} />
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`w-full text-center py-4 font-display text-2xl font-medium border-b border-[rgba(201,168,76,0.1)] transition-colors duration-300 ${
                  pathname === link.href
                    ? "text-[#c9a84c]"
                    : "text-white/80 hover:text-[#c9a84c]"
                }`}
                style={{ transitionDelay: `${i * 60}ms` }}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ),
          )}

          <div className="mt-8 flex flex-col gap-3 w-full">
            <a href="tel:+918796770014" className="btn-outline-gold">
              <Phone size={15} /> +91 87967 70014
            </a>
            <Link href="/contact" className="btn-gold">
              Book Your Ride
            </Link>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />
      </div>
    </>
  );
}
