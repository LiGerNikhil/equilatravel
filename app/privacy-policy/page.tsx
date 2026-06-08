import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Equila Travel",
  description: "Equila Travel privacy policy — how we collect, use, and protect your personal data when you book cabs and use our services.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-20 pb-24" style={{ background: "#050a08" }}>
      <div
        className="py-16 text-center mb-12"
        style={{
          borderBottom: "1px solid rgba(201,168,76,0.1)",
          background: "linear-gradient(135deg, #050a08, #071510)",
        }}
      >
        <span className="section-tag">Legal</span>
        <h1 className="font-display text-4xl font-bold text-white mt-3">
          Privacy <span className="gold-shimmer">Policy</span>
        </h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="glass-card rounded-sm p-6 md:p-10 space-y-8 font-body text-white/60 text-sm leading-relaxed"
          style={{ fontWeight: 300 }}
        >
          <section>
            <h2 className="font-display text-xl text-white mb-3">
              1. Information We Collect
            </h2>
            <p>
              We collect information you provide directly to us, such as when
              you make a booking, contact us for support, or fill out our
              contact form. This includes your name, phone number, email
              address, and travel details.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-3">
              2. How We Use Your Information
            </h2>
            <p>
              We use the information we collect to process bookings, provide
              customer support, send booking confirmations, and improve our
              services. We do not sell your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-3">
              3. Data Security
            </h2>
            <p>
              We implement appropriate security measures to protect your
              personal information against unauthorized access, alteration,
              disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-3">4. Contact</h2>
            <p>
              For any privacy-related questions, contact us at{" "}
              <a href="mailto:Info@equilatravel.com" className="text-[#c9a84c]">
                Info@equilatravel.com
              </a>
            </p>
          </section>

          <p className="text-white/30 text-xs">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
            })}
            . A service of{" "}
            <span className="text-[#c9a84c]/60">Equila Solutions Pvt Ltd</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
