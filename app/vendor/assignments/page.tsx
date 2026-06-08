"use client";

import { useEffect, useState } from "react";
import { fetchVendorAssignments, type CarAssignment } from "@/lib/api";
import { CheckCircle, Clock, LogOut, Calendar, MapPin, User, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const SESSION_KEY = "equila_vendor_session";

type Session = { id: string; email: string; role: string; status: string };

export default function VendorAssignmentsPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [assignments, setAssignments] = useState<CarAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) { window.location.href = "/vendor/login"; return; }
    try {
      const s = JSON.parse(raw) as Session;
      if (s.role !== "vendor") { window.location.href = "/vendor/login"; return; }
      setSession(s);
      loadData(s.id);
    } catch { window.location.href = "/vendor/login"; }
  }, [statusFilter]);

  const loadData = async (vendorId?: string) => {
    const vid = vendorId || session?.id;
    if (!vid) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchVendorAssignments(vid, statusFilter || undefined);
      setAssignments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load assignments.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "/vendor/login";
  };

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
    <div className="px-4 py-8 sm:px-6 lg:px-8" style={{ background: "#050a08", minHeight: "100vh" }}>
      <div className="mx-auto max-w-[1400px] space-y-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-white/40">Vendor panel</p>
            <h1 className="mt-3 text-4xl font-display text-white">Bookings & Assignments</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
              View cars assigned to your fleet by admin, along with customer details.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/vendor/dashboard" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/80 transition hover:border-gold-500/50 hover:text-gold-500">
              ← My Fleet
            </Link>
            <button type="button" onClick={handleLogout} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white transition hover:border-red-500/50 hover:bg-red-500/10">
              <LogOut size={16} className="inline mr-1" /> Logout
            </button>
          </div>
        </div>

        {/* Error */}
        {error ? (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-100">{error}</div>
        ) : null}

        {/* Filter + Stats */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-3xl font-display text-white">{assignments.length}</p>
              <p className="text-xs text-white/40">Total</p>
            </div>
            <div>
              <p className="text-3xl font-display text-blue-400">{assignments.filter((a) => a.status === "active").length}</p>
              <p className="text-xs text-white/40">Active</p>
            </div>
            <div>
              <p className="text-3xl font-display text-emerald-400">{assignments.filter((a) => a.status === "completed").length}</p>
              <p className="text-xs text-white/40">Completed</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-gold-500"
            >
              <option value="">All bookings</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
            <button type="button" onClick={() => loadData()} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white transition hover:border-gold-500/50 hover:bg-white/10">
              Refresh
            </button>
          </div>
        </div>

        {/* Assignment Cards */}
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse" />)}
          </div>
        ) : assignments.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center shadow-xl shadow-black/20">
            <p className="text-lg font-display text-white/60">No bookings found.</p>
            <p className="mt-2 text-sm text-white/40">When admin assigns a car from your fleet, it will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {assignments.map((a) => (
              <div key={a._id} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20 transition hover:border-white/20">
                {/* Car Image */}
                <div className="relative mb-4 h-36 w-full overflow-hidden rounded-2xl bg-[#0a1f14]">
                  {a.carId?.images && a.carId.images.length > 0 ? (
                    <Image src={a.carId.images[0]} alt={a.carId.carName} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/10 text-sm">No photo</div>
                  )}
                  <div className="absolute right-2 top-2">{statusBadge(a.status)}</div>
                </div>

                {/* Car Info */}
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{a.carId?.carName || "Unknown Car"}</h3>
                    <p className="text-sm text-white/50">{a.carId?.vehicleNumber || ""}</p>
                  </div>
                  {a.carId?.pricePerKM ? (
                    <p className="text-xl font-display text-gold-500">₹{a.carId.pricePerKM.toFixed(2)}</p>
                  ) : null}
                </div>

                {/* Customer Details */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 space-y-2">
                  <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest">Customer</p>
                  <p className="text-sm text-white flex items-center gap-1.5"><User size={12} className="text-white/40" /> {a.customerName}</p>
                  <p className="text-sm text-white/60 flex items-center gap-1.5"><Phone size={12} className="text-white/40" /> {a.customerPhone}</p>
                  {a.startDate ? <p className="text-sm text-white/60 flex items-center gap-1.5"><Calendar size={12} className="text-white/40" /> {a.startDate}{a.endDate ? ` → ${a.endDate}` : ''}</p> : null}
                  {a.pickup || a.destination ? (
                    <p className="text-sm text-white/60 flex items-center gap-1.5"><MapPin size={12} className="text-white/40" /> {a.pickup || '—'} → {a.destination || '—'}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
