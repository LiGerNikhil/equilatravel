"use client";
"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { services } from "@/lib/services";

export default function ServicesSection() {
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
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "#050a08" }}
    >
      {/* Left accent glow */}
      <div
        className="absolute left-0 top-1/2 w-64 h-64 -translate-y-1/2 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)",
          transform: "translate(-30%, -50%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="reveal-up">
            <span className="section-tag">What We Offer</span>
          </div>
          <h2 className="reveal-up section-title mt-2 mb-4">
            Our <span className="gold-shimmer">Services</span>
          </h2>
          <p
            className="reveal-up text-white/50 font-body text-base max-w-xl mx-auto"
            style={{ fontWeight: 300 }}
          >
            From quick city rides and airport transfers to visa assistance and
            air ticket booking across all classes, we have a service crafted for
            every travel need.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.title}
                href={`/services/${service.slug}`}
                className="reveal-up rounded-sm p-6 md:p-8 relative overflow-hidden group transition-all duration-500 border border-[rgba(201,168,76,0.15)] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                style={{
                  transitionDelay: `${i * 80}ms`,
                  background: `linear-gradient(rgba(5,10,8,0.65), rgba(5,10,8,0.65)), url(/images/general/img${i + 1}.png)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Top-right tag */}
                <div className="absolute top-4 right-4">
                  <span
                    className="text-[10px] font-body tracking-widest uppercase px-2 py-0.5"
                    style={{
                      color: "#c9a84c",
                      border: "1px solid rgba(201,168,76,0.3)",
                    }}
                  >
                    {service.tag}
                  </span>
                </div>

                {/* Corner accent lines */}
                <div className="absolute top-0 left-0 w-16 h-px bg-gradient-to-r from-[#c9a84c] to-transparent" />
                <div className="absolute top-0 left-0 h-16 w-px bg-gradient-to-b from-[#c9a84c] to-transparent" />

                {/* Icon */}
                <div
                  className="w-14 h-14 flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)",
                    border: "1px solid rgba(201,168,76,0.25)",
                    borderRadius: "2px",
                  }}
                >
                  <Icon size={24} className="text-[#c9a84c]" />
                </div>

                <h3 className="font-display text-xl font-semibold text-white mb-3 group-hover:text-[#c9a84c] transition-colors">
                  {service.title}
                </h3>
                <p
                  className="text-white/70 font-body text-sm leading-relaxed"
                  style={{ fontWeight: 300 }}
                >
                  {service.desc}
                </p>

                {/* Hover arrow */}
                <div className="mt-6 flex items-center gap-2 text-[#c9a84c] text-xs tracking-widest uppercase font-body invisible group-hover:visible transition-all">
                  <span>Learn More</span>
                  <ArrowRight size={12} />
                </div>

                {/* Bottom glow on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent invisible group-hover:visible transition-all" />
              </Link>
            );
          })}

          {/* Last card: CTA */}
          <div className="reveal-up sm:col-span-2 lg:col-span-1">
            <div
              className="h-full rounded-sm p-6 md:p-8 flex flex-col items-start justify-between relative overflow-hidden min-h-[220px]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(201,168,76,0.12) 0%, rgba(168,136,48,0.08) 100%)",
                border: "1px solid rgba(201,168,76,0.3)",
              }}
            >
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24">
                <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-[#c9a84c] to-transparent" />
                <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-[#c9a84c] to-transparent" />
              </div>

              <div>
                <span className="section-tag mb-3 block">Get Started</span>
                <h3 className="font-display text-2xl text-white mb-3">
                  Need a Custom{" "}
                  <span className="gold-shimmer">Travel Plan?</span>
                </h3>
                <p
                  className="text-white/50 text-sm font-body"
                  style={{ fontWeight: 300 }}
                >
                  Contact us for tailored solutions for groups, events, and
                  special occasions.
                </p>
              </div>

              <Link
                href="/contact"
                className="btn-gold rounded-sm mt-6 text-xs"
              >
                Get Instant Quote
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
