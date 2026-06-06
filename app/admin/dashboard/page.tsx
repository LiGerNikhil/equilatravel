"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Eye, X, CheckCircle, Ban } from "lucide-react";
import Image from "next/image";

const SESSION_KEY = "equila_admin_session";

type Vendor = {
  _id: string;
  name: string;
  email: string;
  status: "pending" | "active" | "inactive";
  createdAt: string;
};

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

type VendorDetail = {
  vendor: Vendor;
  cars: Car[];
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<null | { type: "success" | "error"; message: string }>(null);
  const [vendorDetail, setVendorDetail] = useState<VendorDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) { router.replace("/admin/login"); return; }
    try {
      const session = JSON.parse(raw);
      if (session?.role !== "admin") { router.replace("/admin/login"); return; }
    } catch { router.replace("/admin/login"); return; }
    void loadData();
  }, [router]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 4200);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [vendorsRes, carsRes] = await Promise.all([
        fetch("/api/admin/vendors", { cache: "no-store" }),
        fetch("/api/admin/cars", { cache: "no-store" }),
      ]);
      if (!vendorsRes.ok) throw new Error("Failed to load vendors");
      if (!carsRes.ok) throw new Error("Failed to load cars");
      const vData = await vendorsRes.json();
      const cData = await carsRes.json();
      setVendors(Array.isArray(vData) ? vData : []);
      setCars(Array.isArray(cData) ? cData : []);
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const totalVendors = vendors.length;
  const activeVehicles = cars.filter((c) => c.isAvailable).length;
  const pendingApprovals = vendors.filter((v) => v.status === "pending").length;

  const handleStatusChange = useCallback(async (vendorId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/vendors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: vendorId, status: newStatus }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d?.error || "Failed to update status"); }
      setVendors((prev) => prev.map((v) => (v._id === vendorId ? { ...v, status: newStatus as Vendor["status"] } : v)));
      showToast("success", "Vendor status updated.");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Update failed.");
    }
  }, []);

  const handleViewVendor = async (vendorId: string) => {
    setDetailLoading(true);
    setVendorDetail(null);
    try {
      const res = await fetch(`/api/admin/vendors/${vendorId}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load vendor details");
      setVendorDetail(await res.json());
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to load vendor details.");
    } finally {
      setDetailLoading(false);
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
      if (vendorDetail) {
        setVendorDetail((prev) => prev ? { ...prev, cars: prev.cars.map((c) => (c._id === carId ? { ...c, isAvailable: !currentAvailable } : c)) } : null);
      }
      showToast("success", `Car ${!currentAvailable ? "activated" : "deactivated"}.`);
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to update car.");
    }
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      inactive: "bg-red-500/15 text-red-300 border-red-500/30",
      pending: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
    };
    return styles[status] || styles.pending;
  };

  if (loading) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1600px] space-y-6">
          {[...Array(6)].map((_, i) => <div key={i} className="h-20 rounded-3xl bg-white/5 animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px] space-y-10">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-white/40">Admin panel</p>
          <h1 className="mt-3 text-4xl font-display text-white">Vendor Dashboard</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
            Manage registered vendors, review pending approvals, view vendor profiles and their cars, and monitor active vehicles across the platform.
          </p>
        </div>

        {toast ? (
          <div className={`rounded-3xl border px-5 py-4 text-sm shadow-xl shadow-black/20 ${toast.type === "success" ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200" : "border-red-400/20 bg-red-500/10 text-red-200"}`}>
            {toast.message}
          </div>
        ) : null}

        {/* Metric blocks */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
            <p className="text-xs uppercase tracking-[0.35em] text-white/40">Total vendors</p>
            <p className="mt-3 text-5xl font-display text-gold-500">{totalVendors}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
            <p className="text-xs uppercase tracking-[0.35em] text-white/40">Active vehicles</p>
            <p className="mt-3 text-5xl font-display text-emerald-400">{activeVehicles}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
            <p className="text-xs uppercase tracking-[0.35em] text-white/40">Pending approvals</p>
            <p className="mt-3 text-5xl font-display text-yellow-400">{pendingApprovals}</p>
          </div>
        </div>

        {/* Vendor Management Grid */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">Vendor Management</h2>
              <p className="text-sm text-white/50">{vendors.length} registered vendor{vendors.length !== 1 ? "s" : ""}</p>
            </div>
          </div>

          {vendors.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-sm text-white/50">No vendors registered yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-[0.25em] text-white/40">
                    <th className="pb-4 pr-4 font-semibold">Name</th>
                    <th className="pb-4 pr-4 font-semibold">Email</th>
                    <th className="pb-4 pr-4 font-semibold">Status</th>
                    <th className="pb-4 pr-4 font-semibold">View</th>
                    <th className="pb-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((vendor) => (
                    <tr key={vendor._id} className="border-b border-white/5 last:border-none">
                      <td className="py-4 pr-4 text-white">{vendor.name}</td>
                      <td className="py-4 pr-4 text-white/60">{vendor.email}</td>
                      <td className="py-4 pr-4">
                        <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${statusBadge(vendor.status)}`}>
                          {vendor.status}
                        </span>
                      </td>
                      <td className="py-4 pr-4">
                        <button
                          type="button"
                          onClick={() => handleViewVendor(vendor._id)}
                          className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/20"
                        >
                          <Eye size={12} /> Profile
                        </button>
                      </td>
                      <td className="py-4">
                        {vendor.status === "pending" ? (
                          <div className="flex gap-2">
                            <button type="button" onClick={() => handleStatusChange(vendor._id, "active")} className="rounded-xl bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/25">Approve</button>
                            <button type="button" onClick={() => handleStatusChange(vendor._id, "inactive")} className="rounded-xl bg-red-500/15 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/25">Reject</button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(vendor._id, vendor.status === "active" ? "inactive" : "active")}
                            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${vendor.status === "active" ? "bg-red-500/15 text-red-300 hover:bg-red-500/25" : "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"}`}
                          >
                            {vendor.status === "active" ? "Deactivate" : "Activate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* All Cars Grid */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">All Cars</h2>
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

      {/* Vendor Detail Modal */}
      {vendorDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#071510] p-6 shadow-2xl shadow-black/60">
            <button onClick={() => setVendorDetail(null)} className="absolute right-4 top-4 text-white/40 hover:text-white transition-colors">
              <X size={20} />
            </button>

            {detailLoading ? (
              <div className="space-y-4 p-4">
                {[...Array(3)].map((_, i) => <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />)}
              </div>
            ) : (
              <>
                <h2 className="font-display text-2xl text-white mb-6">Vendor Profile</h2>

                {/* Vendor Info */}
                <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-2xl border border-white/10 bg-white/5">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/40 mb-1">Name</p>
                    <p className="text-white font-semibold">{vendorDetail.vendor.name}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/40 mb-1">Email</p>
                    <p className="text-white/70">{vendorDetail.vendor.email}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/40 mb-1">Status</p>
                    <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${statusBadge(vendorDetail.vendor.status)}`}>
                      {vendorDetail.vendor.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/40 mb-1">Registered</p>
                    <p className="text-white/70">{new Date(vendorDetail.vendor.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Vendor's Cars */}
                <h3 className="font-display text-lg text-white mb-4">
                  Cars ({vendorDetail.cars.length})
                </h3>

                {vendorDetail.cars.length === 0 ? (
                  <p className="text-sm text-white/50">No cars added yet.</p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {vendorDetail.cars.map((car) => (
                      <div key={car._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="flex gap-3">
                          {car.images && car.images.length > 0 ? (
                            <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
                              <Image src={car.images[0]} alt={car.carName} fill className="object-cover" sizes="80px" />
                            </div>
                          ) : (
                            <div className="w-20 h-20 flex-shrink-0 rounded-xl bg-white/5 flex items-center justify-center">
                              <span className="text-2xl text-white/20">🚗</span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm truncate">{car.carName}</p>
                            <p className="text-white/50 text-xs">{car.vehicleNumber}</p>
                            <p className="text-[#c9a84c] text-xs font-semibold mt-1">₹{car.pricePerKM.toFixed(2)}/km</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium ${car.isAvailable ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : "bg-red-500/15 text-red-300 border-red-500/30"}`}>
                                {car.isAvailable ? "Active" : "Inactive"}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCarToggle(car._id, car.isAvailable)}
                                className={`text-[10px] font-semibold underline transition ${car.isAvailable ? "text-red-400 hover:text-red-300" : "text-emerald-400 hover:text-emerald-300"}`}
                              >
                                {car.isAvailable ? "Deactivate" : "Activate"}
                              </button>
                            </div>
                            {car.features && car.features.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {car.features.map((f, idx) => (
                                  <span key={idx} className="text-[10px] text-white/40 px-1.5 py-0.5 rounded" style={{ border: "1px solid rgba(201,168,76,0.1)" }}>
                                    {f}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
