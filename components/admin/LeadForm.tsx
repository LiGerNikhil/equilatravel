"use client";

import { useEffect, useState } from "react";
import type { Lead } from "@/lib/api";

type LeadFormProps = {
  initialLead?: Partial<Lead>;
  submitLabel?: string;
  isSaving: boolean;
  onSubmit: (lead: {
    id?: string;
    name: string;
    phone: string;
    email: string;
    destination: string;
    message: string;
  }) => void;
  onCancel: () => void;
};

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  destination: "",
  pickup: "",
  service: "",
  date: "",
  message: "",
};

export default function LeadForm({
  initialLead,
  submitLabel = "Create lead",
  isSaving,
  onSubmit,
  onCancel,
}: LeadFormProps) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialLead) {
      setForm({
        name: initialLead.name || "",
        phone: initialLead.phone || "",
        email: initialLead.email || "",
        destination: initialLead.destination || "",
        pickup: initialLead.pickup || "",
        service: initialLead.service || "",
        date: initialLead.date || "",
        message: initialLead.message || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialLead]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      id: initialLead?.id,
      ...form,
    });
  };

  const inputClass =
    "w-full bg-transparent border border-[rgba(201,168,76,0.2)] text-white font-body text-sm px-4 py-3 rounded-sm placeholder:text-white/20 focus:outline-none focus:border-[#c9a84c] transition-colors duration-300";

  return (
    <div className="glass-card rounded-2xl border border-[rgba(255,255,255,0.08)] p-6 md:p-8 shadow-xl shadow-black/20">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/40 font-body">
            {initialLead?.id ? "Update Lead" : "New Lead"}
          </p>
          <h2 className="text-2xl font-display text-white mt-2">
            {initialLead?.id ? "Edit lead details" : "Create a fresh lead"}
          </h2>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-white/60 hover:text-white transition"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block text-[10px] uppercase tracking-[0.35em] text-white/40 font-body">
            Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Customer name"
              className={`${inputClass} mt-2`}
            />
          </label>
          <label className="block text-[10px] uppercase tracking-[0.35em] text-white/40 font-body">
            Phone
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="+91 98765 43210"
              className={`${inputClass} mt-2`}
            />
          </label>
        </div>

        <label className="block text-[10px] uppercase tracking-[0.35em] text-white/40 font-body">
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="customer@email.com"
            className={`${inputClass} mt-2`}
          />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block text-[10px] uppercase tracking-[0.35em] text-white/40 font-body">
            Service
            <input
              name="service"
              value={form.service}
              onChange={handleChange}
              placeholder="Service type"
              className={`${inputClass} mt-2`}
            />
          </label>
          <label className="block text-[10px] uppercase tracking-[0.35em] text-white/40 font-body">
            Pickup
            <input
              name="pickup"
              value={form.pickup}
              onChange={handleChange}
              placeholder="Pickup location"
              className={`${inputClass} mt-2`}
            />
          </label>
        </div>

        <label className="block text-[10px] uppercase tracking-[0.35em] text-white/40 font-body">
          Destination
          <input
            name="destination"
            value={form.destination}
            onChange={handleChange}
            placeholder="Trip destination"
            className={`${inputClass} mt-2`}
          />
        </label>

        <label className="block text-[10px] uppercase tracking-[0.35em] text-white/40 font-body">
          Travel Date
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            className={`${inputClass} mt-2`}
            style={{ colorScheme: "dark" }}
          />
        </label>

        <label className="block text-[10px] uppercase tracking-[0.35em] text-white/40 font-body">
          Message
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            placeholder="Customer note or request"
            className={`${inputClass} mt-2 resize-none`}
          />
        </label>

        <button
          type="submit"
          disabled={isSaving}
          className="btn-gold rounded-sm w-full justify-center inline-flex items-center gap-2"
        >
          {isSaving ? "Saving..." : submitLabel}
        </button>
      </form>
    </div>
  );
}
