"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchEnquiries, type Enquiry } from "@/lib/api";
import AdminSidebar from "@/components/admin/AdminSidebar";

const SESSION_KEY = "equila_admin_session";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<"dashboard" | "leads">("dashboard");
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<null | { type: "success" | "error"; message: string }>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadEnquiries = async () => {
    setLoading(true);
    setError("");
    try {
      const list = await fetchEnquiries();
      setEnquiries(list);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Unable to load enquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) { router.replace("/admin/login"); return; }
    try {
      const session = JSON.parse(raw);
      if (session?.role !== "admin") { router.replace("/admin/login"); return; }
    } catch { router.replace("/admin/login"); return; }
    void loadEnquiries();
  }, [router]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 4200);
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    router.push("/admin/login");
  };

  const scrollToSection = (section: "dashboard" | "leads") => {
    setActiveSection(section);
    const target = document.getElementById(section);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
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
      await loadEnquiries();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to delete enquiry.");
    }
  };

  const enquiryCount = enquiries.length;

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto grid w-full max-w-[1600px] gap-6 xl:grid-cols-[280px_1fr]">
        <AdminSidebar activeSection={activeSection} onNavigate={scrollToSection} onLogout={handleLogout} />

        <div className="space-y-8">
          <section id="dashboard" className="space-y-8">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-white/40">Dashboard</p>
                <h1 className="mt-3 text-4xl font-display text-white">Enquiry Management</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                  View customer enquiries submitted through the contact form.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={async () => { setRefreshing(true); await loadEnquiries(); setRefreshing(false); }}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white transition hover:border-gold-500/50 hover:bg-white/10"
                >
                  {refreshing ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-white/40">Enquiries</p>
                  <h2 className="mt-2 text-3xl font-display text-white">{enquiryCount} total enquiries</h2>
                </div>
                <div className="rounded-2xl bg-white/5 px-4 py-2 text-sm text-white/70">Stored in database</div>
              </div>
            </div>

            {toast ? (
              <div className={`rounded-3xl border px-5 py-4 text-sm shadow-xl shadow-black/20 ${toast.type === "success" ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200" : "border-red-400/20 bg-red-500/10 text-red-200"}`}>
                {toast.message}
              </div>
            ) : null}
          </section>

          <section id="leads" className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">Enquiries table</h3>
                  <p className="text-sm text-white/50">View all enquiries from the database.</p>
                </div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/40">
                  {loading ? "Loading" : `${enquiryCount} records`}
                </p>
              </div>

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
                        <th className="pb-4 pr-3 font-semibold">Date</th>
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
                            <td className="py-3 pr-3 text-white/60">{enq.date || "—"}</td>
                            <td className="py-3">
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => setExpandedId(expandedId === enq._id ? null : enq._id)}
                                  className="rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/20"
                                >
                                  {expandedId === enq._id ? "Less" : "More"}
                                </button>
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

            <aside>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
                <p className="text-sm uppercase tracking-[0.35em] text-white/40">Recent enquiries</p>
                <div className="mt-4 space-y-4">
                  {enquiries.slice(0, 3).length === 0 ? (
                    <p className="text-sm text-white/50">No recent enquiries.</p>
                  ) : (
                    enquiries.slice(0, 3).map((enq) => (
                      <div key={enq._id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                        <p className="text-sm font-semibold text-white">{enq.name}</p>
                        <p className="text-xs text-white/50">{enq.service || "General enquiry"}</p>
                        <p className="mt-2 text-xs text-white/50">{enq.email || enq.phone}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </aside>
          </section>
        </div>
      </div>

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
    </div>
  );
}
