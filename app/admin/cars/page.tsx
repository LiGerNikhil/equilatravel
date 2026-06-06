"use client";

import { useEffect, useState } from "react";
import { Ban, CheckCircle } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";

type Car = {
  _id: string;
  carName: string;
  vehicleNumber: string;
  pricePerKM: number;
  isAvailable: boolean;
  images: string[];
  features: string[];
  vendorId: {
    _id: string;
    name: string;
    email: string;
  };
};

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<null | { type: "success" | "error"; message: string }>(null);

  useEffect(() => { void loadData(); }, []);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 4200);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/cars", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load cars");
      const data = await res.json();
      setCars(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to load cars.");
    } finally {
      setLoading(false);
    }
  };

  const handleCarToggle = async (carId: string, currentAvailable: boolean) => {
    try {
      const res = await fetch("/api/admin/cars", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carId, isAvailable: !currentAvailable }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d?.error || "Failed to update car"); }
      setCars((prev) => prev.map((c) => (c._id === carId ? { ...c, isAvailable: !currentAvailable } : c)));
      showToast("success", `Car ${!currentAvailable ? "activated" : "deactivated"}.`);
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to update car.");
    }
  };

  if (loading) {
    return (
      <AdminShell>
        <div className="space-y-6">
          {[...Array(6)].map((_, i) => <div key={i} className="h-20 rounded-3xl bg-white/5 animate-pulse" />)}
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-white/40">Admin panel</p>
          <h1 className="mt-3 text-4xl font-display text-white">Car Management</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
            View all cars across vendors. Activate or deactivate cars to control their visibility on the public fleet page.
          </p>
        </div>

        {toast ? (
          <div className={`rounded-3xl border px-5 py-4 text-sm shadow-xl shadow-black/20 ${toast.type === "success" ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200" : "border-red-400/20 bg-red-500/10 text-red-200"}`}>
            {toast.message}
          </div>
        ) : null}

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-white/50">{cars.length} car{cars.length !== 1 ? "s" : ""} registered</p>
            </div>
          </div>

          {cars.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-sm text-white/50">No cars registered yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-[0.25em] text-white/40">
                    <th className="pb-4 pr-4 font-semibold">Car</th>
                    <th className="pb-4 pr-4 font-semibold">Vendor</th>
                    <th className="pb-4 pr-4 font-semibold">Vehicle #</th>
                    <th className="pb-4 pr-4 font-semibold">Price/km</th>
                    <th className="pb-4 pr-4 font-semibold">Status</th>
                    <th className="pb-4 font-semibold">Toggle</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map((car) => (
                    <tr key={car._id} className="border-b border-white/5 last:border-none">
                      <td className="py-4 pr-4 text-white">{car.carName}</td>
                      <td className="py-4 pr-4 text-white/60">{car.vendorId?.name || "—"}</td>
                      <td className="py-4 pr-4 text-white/60">{car.vehicleNumber}</td>
                      <td className="py-4 pr-4 text-white/60">₹{car.pricePerKM.toFixed(2)}</td>
                      <td className="py-4 pr-4">
                        <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${car.isAvailable ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : "bg-red-500/15 text-red-300 border-red-500/30"}`}>
                          {car.isAvailable ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-4">
                        <button
                          type="button"
                          onClick={() => handleCarToggle(car._id, car.isAvailable)}
                          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${car.isAvailable ? "bg-red-500/15 text-red-300 hover:bg-red-500/25" : "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"}`}
                        >
                          {car.isAvailable ? <Ban size={12} /> : <CheckCircle size={12} />}
                          {car.isAvailable ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
