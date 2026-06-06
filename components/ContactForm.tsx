"use client";
import { useState } from "react";
import {
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Send,
  CheckCircle,
  X,
} from "lucide-react";
import { submitEnquiry } from "@/lib/api";

const serviceTypes = [
  "City Ride",
  "Airport Transfer",
  "Outstation Trip",
  "Hourly Rental",
  "Corporate Travel",
];

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    pickup: "",
    destination: "",
    date: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      await submitEnquiry({
        name: form.name,
        phone: form.phone,
        email: form.email,
        service: form.service,
        pickup: form.pickup,
        destination: form.destination,
        date: form.date,
        message: form.message,
      });
      setSubmitted(true);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }

    setLoading(false);
  };

  const inputClass = `
    w-full bg-transparent border border-[rgba(201,168,76,0.2)] 
    text-white font-body text-sm px-4 py-3 rounded-sm
    placeholder:text-white/20 focus:outline-none
    focus:border-[#c9a84c] transition-colors duration-300
  `;

  return (
    <>
    <section className="py-16 md:py-24" style={{ background: "#050a08" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Contact info */}
          <div>
            <span className="section-tag">Contact Information</span>
            <h2 className="section-title mt-2 mb-6">
              Let's Plan <span className="gold-shimmer">Your Journey</span>
            </h2>
            <p
              className="text-white/50 font-body text-sm leading-relaxed mb-10"
              style={{ fontWeight: 300 }}
            >
              Our team is available 24/7 to assist you with bookings, inquiries,
              and custom travel plans. Reach out through any channel below.
            </p>

            {/* Contact cards */}
            <div className="space-y-4 mb-10">
              {[
                {
                  icon: Phone,
                  label: "Phone",
                  value: "+91 87967 70014",
                  href: "tel:+918796770014",
                },
                {
                  icon: MessageCircle,
                  label: "WhatsApp",
                  value: "+91 87967 70014",
                  href: "https://wa.me/918796770014",
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: "Info@equilatravel.com",
                  href: "mailto:Info@equilatravel.com",
                },
              ].map((contact) => {
                const Icon = contact.icon;
                return (
                  <a
                    key={contact.label}
                    href={contact.href}
                    target={
                      contact.href.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      contact.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="glass-card rounded-sm p-4 flex items-center gap-4 group hover:border-[rgba(201,168,76,0.4)] transition-all"
                  >
                    <div
                      className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-sm group-hover:scale-110 transition-transform"
                      style={{
                        background: "rgba(201,168,76,0.1)",
                        border: "1px solid rgba(201,168,76,0.25)",
                      }}
                    >
                      <Icon size={16} className="text-[#c9a84c]" />
                    </div>
                    <div>
                      <div className="text-[10px] text-white/30 tracking-widest uppercase font-body">
                        {contact.label}
                      </div>
                      <div className="text-white/70 font-body text-sm group-hover:text-[#c9a84c] transition-colors">
                        {contact.value}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Service areas */}
            {/* <div className="glass-card rounded-sm p-5">
              <h3 className="font-body font-semibold text-white text-sm tracking-widest uppercase mb-4 flex items-center gap-2">
                <MapPin size={14} className="text-[#c9a84c]" />
                Service Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Delhi NCR",
                  "Mumbai",
                  "Bengaluru",
                  "Hyderabad",
                  "Chennai",
                  "Pune",
                  "Jaipur",
                  "Pan India",
                ].map((city) => (
                  <span
                    key={city}
                    className="text-xs font-body text-white/50 px-3 py-1"
                    style={{ border: "1px solid rgba(201,168,76,0.15)" }}
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div> */}
          </div>

          {/* Right: Booking form */}
          <div>
            <div className="glass-card rounded-sm p-6 md:p-8">
              <h3 className="font-display text-xl text-white mb-6">
                Quick <span className="gold-shimmer">Booking Form</span>
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-white/30 tracking-widest uppercase font-body mb-2">
                      Full Name *
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/30 tracking-widest uppercase font-body mb-2">
                      Phone *
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder="+91 XXXXX XXXXX"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-white/30 tracking-widest uppercase font-body mb-2">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-white/30 tracking-widest uppercase font-body mb-2">
                    Service Type *
                  </label>
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    style={{ background: "#071510" }}
                  >
                    <option value="">Select a service</option>
                    {serviceTypes.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-white/30 tracking-widest uppercase font-body mb-2">
                      Pickup Location *
                    </label>
                    <input
                      name="pickup"
                      value={form.pickup}
                      onChange={handleChange}
                      required
                      placeholder="Pickup address"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/30 tracking-widest uppercase font-body mb-2">
                      Destination
                    </label>
                    <input
                      name="destination"
                      value={form.destination}
                      onChange={handleChange}
                      placeholder="Drop location"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-white/30 tracking-widest uppercase font-body mb-2">
                    Travel Date
                  </label>
                  <input
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    className={inputClass}
                    style={{ colorScheme: "dark" }}
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-white/30 tracking-widest uppercase font-body mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Any special requirements..."
                    className={inputClass + " resize-none"}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold rounded-sm w-full justify-center"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#050a08] border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Send Booking Request</span>
                    </>
                  )}
                </button>
                {errorMsg && (
                  <p className="text-red-400 font-body text-xs text-center mt-2">{errorMsg}</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Success modal */}
    {submitted && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
        <div
          className="relative w-full max-w-md rounded-2xl border border-[rgba(201,168,76,0.2)] p-8 text-center shadow-2xl shadow-black/60"
          style={{ background: "#071510" }}
        >
          <button
            onClick={() => {
              setSubmitted(false);
              setForm({
                name: "",
                phone: "",
                email: "",
                service: "",
                pickup: "",
                destination: "",
                date: "",
                message: "",
              });
            }}
            className="absolute right-4 top-4 text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div
            className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full"
            style={{
              background: "rgba(201,168,76,0.1)",
              border: "1px solid rgba(201,168,76,0.4)",
            }}
          >
            <CheckCircle size={36} className="text-[#c9a84c]" />
          </div>

          <h3 className="font-display text-2xl text-white mb-3">
            Booking <span className="gold-shimmer">Received!</span>
          </h3>

          <p className="text-white/60 font-body text-sm leading-relaxed mb-6">
            Thank you for reaching out! Our team will contact you shortly.
          </p>

          <button
            onClick={() => {
              setSubmitted(false);
              setForm({
                name: "",
                phone: "",
                email: "",
                service: "",
                pickup: "",
                destination: "",
                date: "",
                message: "",
              });
            }}
            className="btn-gold rounded-sm text-sm w-full sm:w-auto px-8"
          >
            Done
          </button>
        </div>
      </div>
    )}
    </>
  );
}
