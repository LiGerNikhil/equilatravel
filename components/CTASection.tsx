"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Phone, MessageCircle } from "lucide-react";

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal-up").forEach((el, i) => {
              setTimeout(() => el.classList.add("revealed"), i * 120);
            });
          }
        });
      },
      { threshold: 0.2 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #071510 0%, #050a08 100%)",
      }}
    >
      {/* Gold gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Animated border lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="reveal-up">
          <span className="section-tag">Ready to Travel?</span>
        </div>

        <h2
          className="reveal-up font-display font-bold leading-tight mt-3 mb-6"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          Travel With <span className="gold-shimmer">Comfort & Style</span>
        </h2>

        <p
          className="reveal-up text-white/60 font-body text-base md:text-lg leading-relaxed mb-12 max-w-2xl mx-auto"
          style={{ fontWeight: 300 }}
        >
          Book your cab now and experience premium travel services with Equila
          Travel. Professional drivers, clean vehicles, and unmatched customer
          support — available 24/7.
        </p>

        {/* Buttons */}
        <div className="reveal-up flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contact"
            className="btn-gold rounded-sm w-full sm:w-auto text-sm"
          >
            <span>Book Now</span>
            <ArrowRight size={16} />
          </Link>
          <a
            href="https://wa.me/918796770014"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold rounded-sm w-full sm:w-auto text-sm"
          >
            <MessageCircle size={16} />
            <span>WhatsApp Booking</span>
          </a>
          <a
            href="tel:+918796770014"
            className="btn-outline-gold rounded-sm w-full sm:w-auto text-sm"
          >
            <Phone size={16} />
            <span>Call Us</span>
          </a>
        </div>

        {/* Bottom trust line */}
        <div className="reveal-up mt-10 flex items-center justify-center gap-6 text-white/30 text-xs font-body tracking-widest uppercase">
          <span>No Hidden Charges</span>
          <span className="text-[#c9a84c]">·</span>
          <span>Instant Confirmation</span>
          <span className="text-[#c9a84c]">·</span>
          <span>24/7 Support</span>
        </div>
      </div>
    </section>
  );
}
