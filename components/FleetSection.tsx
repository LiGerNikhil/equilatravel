"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, Star, Shield, Fuel, Gauge, ArrowRight } from "lucide-react";

const fleet = [
  {
    name: "Sedan Cars",
    desc: "Perfect for business & solo travel. Comfortable, fuel-efficient, and easy to park in city traffic.",
    capacity: "4 Passengers",
    badge: "Economy",
    image: "/images/cars/sedan.png",
    features: ["AC", "Music System", "USB Charging"],
    rating: 4.8,
    price: "₹8/km",
    tagline: "Smooth city rides",
  },
  {
    name: "SUVs",
    desc: "Spacious and powerful SUVs ideal for family trips, group outings, and long highway drives.",
    capacity: "6 Passengers",
    badge: "Popular",
    image: "/images/cars/suv.png",
    features: ["AC", "Music System", "USB Charging", "Extra Luggage"],
    rating: 4.9,
    price: "₹12/km",
    tagline: "Power & comfort",
  },
  {
    name: "Premium Cars",
    desc: "Luxury sedans and executive sedans for weddings, airport transfers, and corporate events.",
    capacity: "4 Passengers",
    badge: "Luxury",
    image: "/images/cars/premium-car.png",
    features: ["AC", "Premium Audio", "Leather Seats", "Chauffeur"],
    rating: 4.9,
    price: "₹18/km",
    tagline: "Travel in style",
  },
  {
    name: "Family Vehicles",
    desc: "Spacious MPVs and vans designed for large families, group travel, and airport shuttles.",
    capacity: "7 Passengers",
    badge: "Spacious",
    image: "/images/cars/car.png",
    features: ["AC", "Music System", "Extra Luggage", "Child Seat"],
    rating: 4.7,
    price: "₹14/km",
    tagline: "Room for everyone",
  },
  {
    name: "Executive Cars",
    desc: "Premium business-class vehicles with top-tier amenities for VIP travel and corporate clients.",
    capacity: "4 Passengers",
    badge: "Executive",
    image: "/images/cars/car2.png",
    features: ["AC", "WiFi", "Leather Seats", "Refreshments", "Chauffeur"],
    rating: 5.0,
    price: "₹22/km",
    tagline: "The best in class",
  },
];

export default function FleetSection() {
  const sectionRef = useRef<HTMLElement>(null);

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
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="fleet"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #050a08 0%, #071510 50%, #050a08 100%)",
      }}
    >
      {/* Decorative glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle, rgba(201,168,76,0.03) 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="reveal-up">
            <span className="section-tag">Our Vehicles</span>
          </div>
          <h2 className="reveal-up section-title mt-2 mb-4">
            Our <span className="gold-shimmer">Fleet</span>
          </h2>
          <p
            className="reveal-up text-white/50 font-body text-base max-w-xl mx-auto"
            style={{ fontWeight: 300 }}
          >
            Choose from a wide range of vehicles according to your travel needs.
            All vehicles are regularly serviced and maintained for maximum
            comfort and safety.
          </p>
        </div>

        {/* Fleet grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {fleet.map((car, i) => (
            <div key={car.name} className="reveal-up group">
              <div
                className="relative overflow-hidden rounded-sm transition-all duration-500"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(10,31,20,0.9) 0%, rgba(5,10,8,0.95) 100%)",
                  border: "1px solid rgba(201,168,76,0.12)",
                  boxShadow: "0 4px 30px rgba(0,0,0,0.4)",
                }}
              >
                {/* Image container */}
                <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden">
                  <Image
                    src={car.image}
                    alt={car.name}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050a08] via-[rgba(5,10,8,0.3)] to-transparent" />

                  {/* Top bar: badge + rating */}
                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                    <span
                      className="text-[10px] font-body tracking-widest uppercase px-3 py-1.5 rounded-sm"
                      style={{
                        color:
                          car.badge === "Luxury" || car.badge === "Executive"
                            ? "#f5e6b8"
                            : "#c9a84c",
                        background:
                          car.badge === "Luxury" || car.badge === "Executive"
                            ? "rgba(245,228,154,0.12)"
                            : "rgba(201,168,76,0.12)",
                        border: `1px solid ${
                          car.badge === "Luxury" || car.badge === "Executive"
                            ? "rgba(245,228,154,0.3)"
                            : "rgba(201,168,76,0.3)"
                        }`,
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      {car.badge}
                    </span>
                    <div
                      className="flex items-center gap-1 px-2 py-1 rounded-sm"
                      style={{
                        background: "rgba(5,10,8,0.6)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(201,168,76,0.2)",
                      }}
                    >
                      <Star
                        size={10}
                        fill="#c9a84c"
                        className="text-[#c9a84c]"
                      />
                      <span className="text-[11px] font-body text-white/80">
                        {car.rating}
                      </span>
                    </div>
                  </div>

                  {/* Bottom tagline on image */}
                  <div className="absolute bottom-3 left-3">
                    <span className="text-[10px] font-body tracking-widest uppercase text-white/40">
                      {car.tagline}
                    </span>
                  </div>

                  {/* Price badge */}
                  <div className="absolute bottom-3 right-3">
                    <span
                      className="text-xs font-body font-semibold px-3 py-1 rounded-sm"
                      style={{
                        background: "rgba(201,168,76,0.15)",
                        border: "1px solid rgba(201,168,76,0.3)",
                        color: "#f5e6b8",
                      }}
                    >
                      {car.price}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Name + capacity */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display text-xl font-semibold text-white group-hover:text-[#c9a84c] transition-colors duration-300">
                      {car.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-white/40 text-xs font-body">
                      <Users size={12} className="text-[#c9a84c]" />
                      {car.capacity}
                    </div>
                  </div>

                  <p
                    className="text-white/50 text-sm font-body leading-relaxed mb-4"
                    style={{ fontWeight: 300 }}
                  >
                    {car.desc}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {car.features.map((f) => (
                      <span
                        key={f}
                        className="text-[10px] font-body text-white/40 px-2.5 py-1 rounded-sm transition-colors duration-300"
                        style={{
                          border: "1px solid rgba(201,168,76,0.1)",
                          background: "rgba(201,168,76,0.04)",
                        }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* Divider */}
                  <div
                    className="h-px w-full mb-4"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)",
                    }}
                  />

                  {/* Bottom row: shield + CTA */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-[10px] text-white/30 font-body tracking-wider">
                      <Shield size={11} className="text-[#c9a84c]" />
                      <span>Verified & Sanitized</span>
                    </div>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-body font-semibold tracking-wider uppercase px-4 py-2 rounded-sm transition-all duration-300"
                      style={{
                        color: "#c9a84c",
                        border: "1px solid rgba(201,168,76,0.3)",
                        background: "rgba(201,168,76,0.06)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(201,168,76,0.15)";
                        e.currentTarget.style.borderColor =
                          "rgba(201,168,76,0.6)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(201,168,76,0.06)";
                        e.currentTarget.style.borderColor =
                          "rgba(201,168,76,0.3)";
                      }}
                    >
                      <span>Book</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>

                {/* Hover glow border */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                  style={{
                    border: "1px solid rgba(201,168,76,0.25)",
                    boxShadow: "inset 0 0 40px rgba(201,168,76,0.04)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="reveal-up text-center mt-14">
          <div
            className="inline-flex items-center gap-3 px-6 py-3.5 rounded-sm"
            style={{
              background: "rgba(201,168,76,0.04)",
              border: "1px solid rgba(201,168,76,0.1)",
            }}
          >
            <Shield size={16} className="text-[#c9a84c]" />
            <span className="text-white/50 text-sm font-body">
              All vehicles regularly serviced &bull; GPS-enabled &bull;
              Sanitized before every ride
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
