import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import VideoExperienceSection from "@/components/VideoExperienceSection";
import FleetSection from "@/components/FleetSection";
import SafetyBookingTestimonials from "@/components/SafetyBookingTestimonials";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Equila Travel — Premium Cab Services Across India",
  description:
    "Book comfortable and affordable cab services with Equila Travel. City rides, airport transfers, outstation trips, and hourly rentals with professional drivers.",
  alternates: {
    canonical: "/",
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
