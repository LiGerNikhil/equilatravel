"use client";

import { useEffect, useState } from "react";
import { fetchVendors, fetchAdminCars, createCarAssignment, type Vendor, type AdminCar } from "@/lib/api";
import AdminShell from "@/components/admin/AdminShell";
import { CheckCircle, X } from "lucide-react";

export default function AdminCarAssignPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [cars, setCars] = useState<AdminCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<null | { type: "success" | "error"; message: string }>(null);
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [selectedCarId, setSelectedCarId] = useState("");
  const [form, setForm] = useState({ customerName: "", customerPhone: "", customerEmail: "", startDate: "", endDate: "", pickup: "", destination: "" });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [vendorList, carList] = await Promise.all([fetchVendors(), fetchAdminCars()]);
      setVendors(vendorList.filter((v) => v.status === "active"));
      setCars(carList);
    } catch (err) {
      setToast({ type: "error", message: err instanceof Error ? err.message : "Failed to load data." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadData(); }, []);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 4200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCarId || !selectedVendorId || !form.customerName || !form.customerPhone) return;

    setSaving(true);
    try {
      await createCarAssignment({
        carId: selectedCarId,
        vendorId: selectedVendorId,
        ...form,
      });
      showToast("success", "Car assigned successfully.");
      setForm({ customerName: "", customerPhone: "", customerEmail: "", startDate: "", endDate: "", pickup: "", destination: "" });
      setSelectedCarId("");
      setSelectedVendorId("");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to assign car.");
    } finally {
      setSaving(false);
    }
  };

  const filteredCars = selectedVendorId ? cars.filter((c) => c.vendorId?._id === selectedVendorId && c.isAvailable) : [];

  return (
    <AdminShell>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-white/40">Admin</p>
          <h1 className="mt-3 text-4xl font-display text-white">Assign Car</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
            Assign a car from a vendor to a customer.
          </p>
        </div>

        {/* Toast */}
        {toast ? (
          <div className={`rounded-3xl border px-5 py-4 text-sm shadow-xl shadow-black/20 ${toast.type === "success" ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200" : "border-red-400/20 bg-red-500/10 text-red-200"}`}>
            {toast.message}
          </div>
        ) : null}

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20 space-y-6">
          {loading ? (
            <div className="h-48 rounded-2xl bg-white/5 animate-pulse" />
          ) : (
            <>
              {/* Select Vendor */}
              <div>
                <label className="block text-[11px] uppercase tracking-[0.35em] text-white/50 mb-3">Select Vendor</label>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {vendors.map((v) => (
                    <label
                      key={v._id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                        selectedVendorId === v._id ? "border-gold-500/50 bg-gold-500/10" : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <input type="radio" name="vendor" value={v._id} checked={selectedVendorId === v._id} onChange={() => { setSelectedVendorId(v._id); setSelectedCarId(""); }} className="sr-only" />
                      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selectedVendorId === v._id ? "border-gold-500 bg-gold-500" : "border-white/30"}`}>
                        {selectedVendorId === v._id && <div className="h-2 w-2 rounded-full bg-white" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{v.name}</p>
                        <p className="text-xs text-white/50">{v.email}</p>
                      </div>
                    </label>
                  ))}
                  {vendors.length === 0 && <p className="text-sm text-white/40 col-span-full">No active vendors found.</p>}
                </div>
              </div>

              {/* Select Car */}
              {selectedVendorId && (
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.35em] text-white/50 mb-3">Select Available Car</label>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredCars.map((car) => (
                      <label
                        key={car._id}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                          selectedCarId === car._id ? "border-gold-500/50 bg-gold-500/10" : "border-white/10 bg-white/5 hover:border-white/20"
                        }`}
                      >
                        <input type="radio" name="car" value={car._id} checked={selectedCarId === car._id} onChange={() => setSelectedCarId(car._id)} className="sr-only" />
                        <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selectedCarId === car._id ? "border-gold-500 bg-gold-500" : "border-white/30"}`}>
                          {selectedCarId === car._id && <div className="h-2 w-2 rounded-full bg-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white">{car.carName}</p>
                          <p className="text-xs text-white/50">{car.vehicleNumber}</p>
                        </div>
                        <p className="text-xs font-semibold text-gold-500">₹{car.pricePerKM.toFixed(2)}/km</p>
                      </label>
                    ))}
                    {filteredCars.length === 0 && <p className="text-sm text-white/40 col-span-full">No available cars for this vendor.</p>}
                  </div>
                </div>
              )}

              {/* Customer Details */}
              {selectedCarId && (
                <div className="border-t border-white/10 pt-6 space-y-4">
                  <p className="text-sm uppercase tracking-[0.35em] text-white/50">Customer Details</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.35em] text-white/50 mb-2">Customer Name *</label>
                      <input type="text" value={form.customerName} onChange={(e) => setForm((p) => ({ ...p, customerName: e.target.value }))} required className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-gold-500" />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.35em] text-white/50 mb-2">Customer Phone *</label>
                      <input type="text" value={form.customerPhone} onChange={(e) => setForm((p) => ({ ...p, customerPhone: e.target.value }))} required className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-gold-500" />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.35em] text-white/50 mb-2">Customer Email</label>
                      <input type="email" value={form.customerEmail} onChange={(e) => setForm((p) => ({ ...p, customerEmail: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-gold-500" />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.35em] text-white/50 mb-2">Start Date</label>
                      <input type="date" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-gold-500" />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.35em] text-white/50 mb-2">End Date</label>
                      <input type="date" value={form.endDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-gold-500" />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.35em] text-white/50 mb-2">Pickup Location</label>
                      <input type="text" value={form.pickup} onChange={(e) => setForm((p) => ({ ...p, pickup: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-gold-500" />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.35em] text-white/50 mb-2">Destination</label>
                      <input type="text" value={form.destination} onChange={(e) => setForm((p) => ({ ...p, destination: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-gold-500" />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="submit" disabled={!selectedCarId || !selectedVendorId || !form.customerName || !form.customerPhone || saving} className="rounded-xl bg-gold-500 px-6 py-3 text-sm font-semibold text-royal-900 transition hover:bg-gold-400 disabled:opacity-50">
                  {saving ? "Assigning..." : "Assign Car"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </AdminShell>
  );
}
