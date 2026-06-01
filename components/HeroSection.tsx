"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { Phone, MessageCircle, ArrowRight } from "lucide-react";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let gsap: typeof import("gsap").gsap;

    const initGSAP = async () => {
      const mod = await import("gsap");
      gsap = mod.gsap;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        tagRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3 },
      )
        .fromTo(
          h1Ref.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1 },
          "-=0.4",
        )
        .fromTo(
          subRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.5",
        )
        .fromTo(
          btnsRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.4",
        )
        .fromTo(
          statsRef.current?.children
            ? Array.from(statsRef.current.children)
            : [],
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, stagger: 0.15, duration: 0.7 },
          "-=0.3",
        );
    };

    initGSAP();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #050a08 0%, #071510 40%, #0a1f14 70%, #050a08 100%)",
      }}
    >
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/video1.mp4"
        autoPlay
        muted
        loop
        playsInline
        style={{
          opacity: 0.82,
          filter: "brightness(0.55) saturate(0.9) contrast(1.05)",
        }}
      />

      {/* Deep star background */}
      <div className="absolute inset-0 stars-bg opacity-30" />

      {/* Radial glow and subtle gradient for contrast */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 55%), linear-gradient(180deg, rgba(5,10,8,0.22) 0%, rgba(5,10,8,0.85) 100%)",
        }}
      />

      {/* Grid lines overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(201,168,76,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.5) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-12">
        {/* Tag line */}
        <div
          ref={tagRef}
          className="flex items-center justify-center gap-3 mb-6 opacity-0"
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a84c]" />
          <span className="section-tag">Premium Cab Services Across India</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a84c]" />
        </div>

        {/* Main heading */}
        <h1
          ref={h1Ref}
          className="opacity-0 font-display font-bold leading-tight mb-6 text-4xl sm:text-5xl md:text-[4.8rem] tracking-tight"
        >
          <span className="block text-white">Luxury Cab Services</span>
          <span className="block gold-shimmer mt-1">Across India</span>
        </h1>

        {/* Subtext */}
        <p
          ref={subRef}
          className="opacity-0 max-w-2xl mx-auto text-white/60 font-body text-base md:text-lg leading-relaxed mb-10"
          style={{ fontWeight: 300 }}
        >
          Travel comfortably with{" "}
          <span className="text-[#c9a84c] font-medium">Equila Travel</span> —
          your trusted partner for city rides, airport transfers, outstation
          trips, and hourly cab bookings. Professional drivers, clean vehicles,
          and 24/7 support.
        </p>

        {/* Buttons */}
        <div
          ref={btnsRef}
          className="opacity-0 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/contact"
            className="btn-gold rounded-sm w-full sm:w-auto"
          >
            <span>Book Your Ride</span>
            <ArrowRight size={16} />
          </Link>
          <a
            href="https://wa.me/918796770014"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold rounded-sm w-full sm:w-auto"
          >
            <MessageCircle size={16} />
            <span>WhatsApp Booking</span>
          </a>
          <a
            href="tel:+918796770014"
            className="btn-outline-gold rounded-sm w-full sm:w-auto"
          >
            <Phone size={16} />
            <span>Call Now</span>
          </a>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto"
        >
          {[
            { val: "10K+", label: "Happy Customers" },
            { val: "24/7", label: "Support Available" },
            { val: "50+", label: "Cities Covered" },
            { val: "100%", label: "Verified Drivers" },
          ].map((s) => (
            <div
              key={s.label}
              className="glass-card rounded-sm p-4 text-center"
            >
              <div
                className="font-display text-2xl md:text-3xl font-bold mb-1"
                style={{
                  background: "linear-gradient(135deg, #c9a84c, #f5e6b8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {s.val}
              </div>
              <div className="text-white/50 text-xs tracking-widest uppercase font-body">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050a08] to-transparent pointer-events-none" />
    </section>
  );
}
