"use client";

import { useEffect, useState } from "react";
import { fetchEnquiries, fetchAdminCars, type Enquiry, type AdminCar } from "@/lib/api";
import AdminShell from "@/components/admin/AdminShell";
import { Car, CheckCircle, Clock } from "lucide-react";

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [cars, setCars] = useState<AdminCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<null | { type: "success" | "error"; message: string }>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [selectedCarId, setSelectedCarId] = useState<string>("");
  const [assigning, setAssigning] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [list, carList] = await Promise.all([fetchEnquiries(), fetchAdminCars()]);
      setEnquiries(list);
      setCars(carList);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Unable to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadData(); }, []);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 4200);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await fetch("/api/enquiries", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteConfirmId }),
      });
      if (!res.ok) throw new Error("Failed to delete");
      showToast("success", "Enquiry deleted.");
      setDeleteConfirmId(null);
      await loadData();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to delete enquiry.");
    }
  };

  const handleAssignCar = async (enquiryId: string) => {
    if (!selectedCarId) return;
    const car = cars.find((c) => c._id === selectedCarId);
    if (!car) return;

    setAssigning(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: enquiryId,
          assignedCarId: car._id,
          assignedCarName: car.carName,
          assignedCarNumber: car.vehicleNumber,
          assignedCarPrice: car.pricePerKM,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to assign car");
      showToast("success", `Car "${car.carName}" assigned to enquiry. Confirmation email sent.`);
      setAssigningId(null);
      setSelectedCarId("");
      await loadData();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to assign car.");
    } finally {
      setAssigning(false);
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "assigned":
        return <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-medium text-emerald-300"><CheckCircle size={10} /> Assigned</span>;
      case "completed":
        return <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/15 px-2.5 py-0.5 text-[10px] font-medium text-blue-300"><CheckCircle size={10} /> Completed</span>;
      default:
        return <span className="inline-flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/15 px-2.5 py-0.5 text-[10px] font-medium text-yellow-300"><Clock size={10} /> Pending</span>;
    }
  };

  return (
    <AdminShell>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-white/40">Enquiries</p>
          <h1 className="mt-3 text-4xl font-display text-white">Enquiry Management</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
            Review customer enquiries and assign vehicles from vendor inventory.
          </p>
        </div>

        {/* Toast */}
        {toast ? (
          <div className={`rounded-3xl border px-5 py-4 text-sm shadow-xl shadow-black/20 ${toast.type === "success" ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200" : "border-red-400/20 bg-red-500/10 text-red-200"}`}>
            {toast.message}
          </div>
        ) : null}

        {/* Stats + Refresh */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
          <div className="flex gap-6">
            <div>
              <p className="text-3xl font-display text-white">{enquiries.length}</p>
              <p className="text-xs text-white/40">Total</p>
            </div>
            <div>
              <p className="text-3xl font-display text-yellow-400">{enquiries.filter((e) => e.status === "pending").length}</p>
              <p className="text-xs text-white/40">Pending</p>
            </div>
            <div>
              <p className="text-3xl font-display text-emerald-400">{enquiries.filter((e) => e.status === "assigned").length}</p>
              <p className="text-xs text-white/40">Assigned</p>
            </div>
          </div>
          <button
            type="button"
            onClick={async () => { setRefreshing(true); await loadData(); setRefreshing(false); }}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white transition hover:border-gold-500/50 hover:bg-white/10"
          >
            {refreshing ? "Refreshing..." : "Refresh"}
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
          ) : enquiries.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-sm text-white/50">No enquiries yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-[0.25em] text-white/40">
                    <th className="pb-4 pr-3 font-semibold">Name</th>
                    <th className="pb-4 pr-3 font-semibold">Phone</th>
                    <th className="pb-4 pr-3 font-semibold">Email</th>
                    <th className="pb-4 pr-3 font-semibold">Service</th>
                    <th className="pb-4 pr-3 font-semibold">Status</th>
                    <th className="pb-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((enq) => (
                    <>
                      <tr key={enq._id} className="border-b border-white/5 last:border-none">
                        <td className="py-3 pr-3 text-white">{enq.name}</td>
                        <td className="py-3 pr-3 text-white/60">{enq.phone}</td>
                        <td className="py-3 pr-3 text-white/60">{enq.email || "—"}</td>
                        <td className="py-3 pr-3 text-white/60">{enq.service || "—"}</td>
                        <td className="py-3 pr-3">{statusBadge(enq.status || "pending")}</td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setExpandedId(expandedId === enq._id ? null : enq._id)}
                              className="rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/20"
                            >
                              {expandedId === enq._id ? "Less" : "More"}
                            </button>
                            {enq.status === "pending" && (
                              <button
                                type="button"
                                onClick={() => { setAssigningId(enq._id); setSelectedCarId(""); }}
                                className="rounded-xl bg-gold-500/15 px-3 py-1.5 text-xs font-semibold text-gold-300 transition hover:bg-gold-500/25"
                              >
                                <Car size={12} className="inline mr-1" />Assign Car
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(enq._id)}
                              className="rounded-xl bg-red-500/15 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/25"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedId === enq._id && (
                        <tr key={`${enq._id}-details`} className="border-b border-white/5">
                          <td colSpan={6} className="py-3 px-4 text-sm text-white/50">
                            <div className="grid grid-cols-2 gap-2">
                              <div><span className="text-white/30">Pickup:</span> {enq.pickup || "—"}</div>
                              <div><span className="text-white/30">Destination:</span> {enq.destination || "—"}</div>
                              <div className="col-span-2"><span className="text-white/30">Message:</span> {enq.message || "—"}</div>
                              {enq.status === "assigned" && enq.assignedCarName ? (
                                <div className="col-span-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 mt-1">
                                  <p className="text-xs font-semibold text-emerald-300 mb-1">Assigned Vehicle</p>
                                  <p className="text-white/70">{enq.assignedCarName} — {enq.assignedCarNumber}</p>
                                  {enq.assignedCarPrice ? <p className="text-white/50">₹{enq.assignedCarPrice.toFixed(2)}/km</p> : null}
                                </div>
                              ) : null}
                              <div className="col-span-2"><span className="text-white/30">Submitted:</span> {new Date(enq.createdAt).toLocaleString()}</div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent enquiries */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
          <p className="text-sm uppercase tracking-[0.35em] text-white/40 mb-4">Recent enquiries</p>
          <div className="space-y-4">
            {enquiries.slice(0, 3).length === 0 ? (
              <p className="text-sm text-white/50">No recent enquiries.</p>
            ) : (
              enquiries.slice(0, 3).map((enq) => (
                <div key={enq._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{enq.name}</p>
                      <p className="text-xs text-white/50">{enq.service || "General enquiry"}</p>
                    </div>
                    {statusBadge(enq.status || "pending")}
                  </div>
                  <p className="mt-1 text-xs text-white/50">{enq.email || enq.phone}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Assign Car Modal */}
      {assigningId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#071510] p-6 shadow-2xl shadow-black/60">
            <h3 className="font-display text-xl text-white mb-1">Assign a Vehicle</h3>
            <p className="text-sm text-white/50 mb-6">Select a car from vendor inventory to assign to this enquiry.</p>

            <div className="space-y-3">
              <label className="block text-[11px] uppercase tracking-[0.35em] text-white/50 mb-2">Available Cars</label>
              {cars.length === 0 ? (
                <p className="text-sm text-white/40">No cars available in inventory.</p>
              ) : (
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {cars.map((car) => (
                    <label
                      key={car._id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                        selectedCarId === car._id
                          ? "border-gold-500/50 bg-gold-500/10"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="car"
                        value={car._id}
                        checked={selectedCarId === car._id}
                        onChange={() => setSelectedCarId(car._id)}
                        className="sr-only"
                      />
                      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        selectedCarId === car._id ? "border-gold-500 bg-gold-500" : "border-white/30"
                      }`}>
                        {selectedCarId === car._id && <div className="h-2 w-2 rounded-full bg-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">{car.carName}</p>
                        <p className="text-xs text-white/50">{car.vehicleNumber} — {car.vendorId?.name || 'Unknown vendor'}</p>
                      </div>
                      <p className="text-xs font-semibold text-gold-500">₹{car.pricePerKM.toFixed(2)}/km</p>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => { setAssigningId(null); setSelectedCarId(""); }}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAssignCar(assigningId!)}
                disabled={!selectedCarId || assigning}
                className="rounded-xl bg-gold-500 px-4 py-2 text-sm font-semibold text-royal-900 transition hover:bg-gold-400 disabled:opacity-50"
              >
                {assigning ? "Assigning..." : "Assign Car"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[#071510] p-6 shadow-2xl shadow-black/60">
            <h3 className="font-display text-xl text-white mb-3">Delete enquiry?</h3>
            <p className="text-sm text-white/60 mb-6">This will permanently remove this enquiry from the database.</p>
            <div className="flex items-center gap-3 justify-end">
              <button onClick={() => setDeleteConfirmId(null)} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5">Cancel</button>
              <button onClick={handleDeleteConfirm} className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
