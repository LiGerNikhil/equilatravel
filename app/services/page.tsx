import type { Metadata } from "next";
import ServicesSection from "@/components/ServicesSection";
import SafetyBookingTestimonials from "@/components/SafetyBookingTestimonials";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Equila Travel offers city rides, airport transfers, flight booking across all classes, visa assistance, outstation trips, hourly rentals, and corporate travel solutions.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <div className="pt-20">
      <div
        className="relative py-20 text-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #050a08 0%, #071510 50%, #050a08 100%)",
          borderBottom: "1px solid rgba(201,168,76,0.1)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10">
          <span className="section-tag">Explore</span>
          <h1
            className="font-display font-bold text-white mt-3"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            EQUILA <span className="gold-shimmer">TRAVEL</span>
          </h1>
          <p
            className="mt-4 max-w-3xl mx-auto text-white/60 text-sm sm:text-base"
            style={{ fontWeight: 300 }}
          >
            Discover premium travel services including airport transfers, flight
            booking across all classes, visa assistance, outstation trips,
            hourly rentals and corporate travel.
          </p>
        </div>
      </div>

      <ServicesSection />
      <SafetyBookingTestimonials />
      <CTASection />
    </div>
  );
}
