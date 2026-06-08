"use client";

import { useEffect, useState } from "react";
import { fetchAdminAssignments, type CarAssignment } from "@/lib/api";
import AdminShell from "@/components/admin/AdminShell";
import { CheckCircle, Clock, X } from "lucide-react";

export default function AdminCarAssignmentsPage() {
  const [assignments, setAssignments] = useState<CarAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminAssignments(statusFilter ? { status: statusFilter } : undefined);
      setAssignments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load assignments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadData(); }, [statusFilter]);

  const statusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/15 px-2.5 py-0.5 text-[10px] font-medium text-blue-300"><Clock size={10} /> Active</span>;
      case "completed":
        return <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-medium text-emerald-300"><CheckCircle size={10} /> Completed</span>;
      default:
        return <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-0.5 text-[10px] font-medium text-white/50">{status}</span>;
    }
  };

  return (
    <AdminShell>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-white/40">Admin</p>
          <h1 className="mt-3 text-4xl font-display text-white">Assignment History</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
            View all car assignments and booking history.
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
          <div className="flex items-center gap-3">
            <p className="text-xs uppercase tracking-[0.35em] text-white/40">Filter by status</p>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-gold-500"
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button
            type="button"
            onClick={() => void loadData()}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white transition hover:border-gold-500/50 hover:bg-white/10"
          >
            Refresh
          </button>
        </div>

        {/* Table */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-3xl bg-white/5 animate-pulse" />)}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-100">{error}</div>
          ) : assignments.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-sm text-white/50">No assignments found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-[0.25em] text-white/40">
                    <th className="pb-4 pr-3 font-semibold">Car</th>
                    <th className="pb-4 pr-3 font-semibold">Vendor</th>
                    <th className="pb-4 pr-3 font-semibold">Customer</th>
                    <th className="pb-4 pr-3 font-semibold">Phone</th>
                    <th className="pb-4 pr-3 font-semibold">Date</th>
                    <th className="pb-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((a) => (
                    <tr key={a._id} className="border-b border-white/5 last:border-none">
                      <td className="py-3 pr-3">
                        <p className="text-white font-semibold">{a.carId?.carName || "—"}</p>
                        <p className="text-white/40 text-xs">{a.carId?.vehicleNumber || ""}</p>
                      </td>
                      <td className="py-3 pr-3 text-white/60">{a.vendorId?.name || "—"}</td>
                      <td className="py-3 pr-3 text-white">{a.customerName}</td>
                      <td className="py-3 pr-3 text-white/60">{a.customerPhone}</td>
                      <td className="py-3 pr-3 text-white/60">{a.startDate || "—"}</td>
                      <td className="py-3">{statusBadge(a.status)}</td>
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
