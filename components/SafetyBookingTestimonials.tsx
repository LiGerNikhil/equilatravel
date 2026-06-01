"use client";
import { useEffect, useRef } from "react";
import {
  Shield,
  MapPin,
  Phone,
  Wrench,
  Sparkles,
  Star,
  Quote,
} from "lucide-react";

const safetyFeatures = [
  {
    icon: Shield,
    label: "Verified Drivers",
    desc: "Background-checked & licensed chauffeurs",
  },
  {
    icon: MapPin,
    label: "GPS Tracking",
    desc: "Real-time ride tracking for every trip",
  },
  {
    icon: Phone,
    label: "Emergency Support",
    desc: "24/7 helpline always available",
  },
  {
    icon: Wrench,
    label: "Vehicle Inspection",
    desc: "Regular mechanical checks and service",
  },
  {
    icon: Sparkles,
    label: "Sanitized Cars",
    desc: "Deep cleaned before every booking",
  },
];

const steps = [
  {
    num: "01",
    title: "Choose Your Route",
    desc: "Enter your pickup location and destination. Simple, fast, and accurate.",
  },
  {
    num: "02",
    title: "Select Your Vehicle",
    desc: "Pick from Sedan, SUV, Premium, Family, or Executive cars based on your need.",
  },
  {
    num: "03",
    title: "Confirm & Enjoy",
    desc: "Confirm your booking, relax, and let us handle the rest of the journey.",
  },
];

const testimonials = [
  {
    quote:
      "Very professional service and clean cars. The driver arrived on time and the journey was extremely comfortable.",
    name: "Rohit Sharma",
    title: "Business Traveler",
    rating: 5,
  },
  {
    quote:
      "Best cab service for airport transfers. Affordable pricing and great customer support. Highly recommend!",
    name: "Priya Mehta",
    title: "Frequent Flyer",
    rating: 5,
  },
  {
    quote:
      "Equila Travel made our outstation trip smooth and hassle-free. Will definitely book again.",
    name: "Anil Verma",
    title: "Family Traveler",
    rating: 5,
  },
];

export default function SafetyBookingTestimonials() {
  const safetyRef = useRef<HTMLElement>(null);
  const bookingRef = useRef<HTMLElement>(null);
  const testimonialRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal-up").forEach((el, i) => {
              setTimeout(() => el.classList.add("revealed"), i * 100);
            });
          }
        });
      },
      { threshold: 0.1 },
    );
    [safetyRef, bookingRef, testimonialRef].forEach((r) => {
      if (r.current) observer.observe(r.current);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* === Safety Section === */}
      <section
        ref={safetyRef}
        id="safety"
        className="relative py-24 md:py-32 overflow-hidden"
        style={{ background: "#050a08" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 80% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="reveal-up">
              <span className="section-tag">Your Safety Matters</span>
            </div>
            <h2 className="reveal-up section-title mt-2 mb-4">
              Your Safety is <span className="gold-shimmer">Our Priority</span>
            </h2>
            <p
              className="reveal-up text-white/50 font-body text-base max-w-xl mx-auto"
              style={{ fontWeight: 300 }}
            >
              At Equila Travel, customer safety comes first. Every ride is
              monitored to ensure a secure travel experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 items-stretch">
            {safetyFeatures.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={f.label} className="reveal-up group h-full">
                  <div
                    className="glass-card rounded-sm p-5 text-center relative overflow-hidden transition-all duration-500 h-full flex flex-col justify-between"
                    style={{
                      transitionDelay: `${i * 80}ms`,
                      minHeight: "240px",
                    }}
                  >
                    <div>
                      <div
                        className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-sm group-hover:scale-110 transition-transform"
                        style={{
                          background: "rgba(201,168,76,0.1)",
                          border: "1px solid rgba(201,168,76,0.25)",
                        }}
                      >
                        <Icon size={20} className="text-[#c9a84c]" />
                      </div>
                      <h3 className="font-body font-semibold text-white text-sm mb-2">
                        {f.label}
                      </h3>
                      <p className="text-white/40 text-xs font-body leading-relaxed">
                        {f.desc}
                      </p>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* === Booking Process === */}
      <section
        ref={bookingRef}
        id="booking"
        className="relative py-24 md:py-32 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #050a08 0%, #071510 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="reveal-up">
              <span className="section-tag">How It Works</span>
            </div>
            <h2 className="reveal-up section-title mt-2">
              Easy Booking in <span className="gold-shimmer">3 Steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-[#c9a84c] via-[rgba(201,168,76,0.3)] to-[#c9a84c]" />

            {steps.map((step, i) => (
              <div key={step.num} className="reveal-up text-center relative">
                {/* Number circle */}
                <div className="relative inline-flex mb-8">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto relative z-10"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(201,168,76,0.2), rgba(168,136,48,0.1))",
                      border: "1px solid rgba(201,168,76,0.4)",
                      boxShadow: "0 0 30px rgba(201,168,76,0.15)",
                    }}
                  >
                    <span
                      className="font-display text-2xl font-bold"
                      style={{
                        background: "linear-gradient(135deg, #c9a84c, #f5e6b8)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {step.num}
                    </span>
                  </div>
                </div>

                <h3 className="font-display text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p
                  className="text-white/50 font-body text-sm leading-relaxed max-w-xs mx-auto"
                  style={{ fontWeight: 300 }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Testimonials === */}
      <section
        ref={testimonialRef}
        id="testimonials"
        className="relative py-24 md:py-32 overflow-hidden"
        style={{ background: "#050a08" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="reveal-up">
              <span className="section-tag">Testimonials</span>
            </div>
            <h2 className="reveal-up section-title mt-2 mb-4">
              What Our <span className="gold-shimmer">Customers Say</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="reveal-up group">
                <div className="glass-card rounded-sm p-6 md:p-8 relative overflow-hidden h-full flex flex-col">
                  {/* Quote icon */}
                  <div className="mb-5">
                    <Quote size={32} className="text-[#c9a84c] opacity-40" />
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star
                        key={j}
                        size={14}
                        fill="#c9a84c"
                        className="text-[#c9a84c]"
                      />
                    ))}
                  </div>

                  <p
                    className="text-white/70 font-body text-sm leading-relaxed flex-1 mb-6 italic"
                    style={{ fontFamily: "var(--font-accent)" }}
                  >
                    "{t.quote}"
                  </p>

                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        background: "linear-gradient(135deg, #c9a84c, #a88830)",
                        color: "#050a08",
                      }}
                    >
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="text-white text-sm font-body font-medium">
                        {t.name}
                      </div>
                      <div className="text-white/40 text-xs font-body">
                        {t.title}
                      </div>
                    </div>
                  </div>

                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-16 h-px bg-gradient-to-l from-[#c9a84c] to-transparent" />
                  <div className="absolute bottom-0 left-0 w-16 h-px bg-gradient-to-r from-[#c9a84c] to-transparent" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
