"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";

type Vendor = {
  _id: string;
  name: string;
  email: string;
  status: "pending" | "active" | "inactive";
  createdAt: string;
};

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
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
      const res = await fetch("/api/admin/vendors", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load vendors");
      const data = await res.json();
      setVendors(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to load vendors.");
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="mt-3 text-4xl font-display text-white">Vendor Management</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
            Approve, reject, activate, or deactivate vendors. Click Profile to view vendor details and their cars.
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
                        <Link
                          href={`/admin/vendors/${vendor._id}`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/20"
                        >
                          <Eye size={12} /> Profile
                        </Link>
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
      </div>
    </AdminShell>
  );
}
