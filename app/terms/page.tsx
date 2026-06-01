import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and conditions for Equila Travel services by Equila Solutions Pvt Ltd.",
};

export default function TermsPage() {
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
          Terms & <span className="gold-shimmer">Conditions</span>
        </h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="glass-card rounded-sm p-6 md:p-10 space-y-8 font-body text-white/60 text-sm leading-relaxed"
          style={{ fontWeight: 300 }}
        >
          <section>
            <h2 className="font-display text-xl text-white mb-3">
              1. Booking & Confirmation
            </h2>
            <p>
              All bookings are subject to vehicle availability. A booking is
              confirmed only after you receive a confirmation message from our
              team. Equila Travel reserves the right to cancel or modify
              bookings in exceptional circumstances.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-3">
              2. Cancellation Policy
            </h2>
            <p>
              Cancellations made more than 4 hours before the pickup time are
              free of charge. Cancellations within 4 hours of pickup may incur a
              cancellation fee. No-shows will be charged the full ride amount.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-3">
              3. Passenger Conduct
            </h2>
            <p>
              Passengers are expected to behave respectfully toward drivers and
              maintain the cleanliness of vehicles. Equila Travel reserves the
              right to refuse service for misconduct.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-3">
              4. Liability
            </h2>
            <p>
              Equila Travel is not liable for delays caused by traffic, weather,
              or circumstances beyond our control. We are committed to on-time
              service but cannot guarantee exact arrival times in all
              conditions.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-3">5. Contact</h2>
            <p>
              For queries, contact us at{" "}
              <a href="tel:+918796770014" className="text-[#c9a84c]">
                +91 87967 70014
              </a>{" "}
              or{" "}
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
            . Operated by{" "}
            <span className="text-[#c9a84c]/60">Equila Solutions Pvt Ltd</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
