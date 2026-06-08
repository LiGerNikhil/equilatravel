import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Equila Travel — Book a Cab, Get a Quote, Call +91 87967 70014",
  description:
    "Contact Equila Travel to book your premium cab. Call +91 87967 70014, reach us on WhatsApp, or fill our quick booking form. 24/7 customer support for all your travel needs.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Equila Travel — Book a Cab, Get a Quote, Call +91 87967 70014",
    description:
      "Contact Equila Travel to book your premium cab. Call +91 87967 70014. 24/7 customer support.",
  },
};

export default function ContactPage() {
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
          <span className="section-tag">Get In Touch</span>
          <h1
            className="font-display font-bold text-white mt-3"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            Book Your <span className="gold-shimmer">Ride</span>
          </h1>
        </div>
      </div>

      <ContactForm />
    </div>
  );
}
