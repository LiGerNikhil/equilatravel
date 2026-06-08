import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import VideoExperienceSection from "@/components/VideoExperienceSection";
import FleetSection from "@/components/FleetSection";
import SafetyBookingTestimonials from "@/components/SafetyBookingTestimonials";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Equila Travel — Premium Cab Services Across India | Book Online",
  description:
    "Book Equila Travel for premium cab services across India. City rides, airport transfers, outstation trips, hourly rentals — professional drivers, GPS-tracked vehicles, 24/7 support. Trusted cab booking service.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Equila Travel — Premium Cab Services Across India | Book Online",
    description:
      "Book Equila Travel for premium cab services — city rides, airport transfers, outstation trips, and hourly rentals across India.",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <VideoExperienceSection />
      <FleetSection />
      <SafetyBookingTestimonials />
      <CTASection />
    </>
  );
}
