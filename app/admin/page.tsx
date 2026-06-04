"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchLeads,
  createLead,
  updateLead,
  deleteLead,
  type Lead,
} from "@/lib/api";
import LeadsTable from "@/components/admin/LeadsTable";
import LeadForm from "@/components/admin/LeadForm";
import AdminSidebar from "@/components/admin/AdminSidebar";

const SESSION_KEY = "equila_admin_session";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<"dashboard" | "leads">(
    "dashboard",
  );
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<null | {
    type: "success" | "error";
    message: string;
  }>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadLeads = async () => {
    setLoading(true);
    setError("");

    try {
      const leadList = await fetchLeads();
      setLeads(
        leadList.sort((a, b) => {
          const aTime = a.timestamp || a.date || "";
          const bTime = b.timestamp || b.date || "";
          return bTime.localeCompare(aTime);
        }),
      );
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Unable to load leads.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(SESSION_KEY)) {
      router.replace("/admin/login");
      return;
    }

    void loadLeads();
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
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleFormSubmit = async (payload: {
    id?: string;
    name: string;
    phone: string;
    email: string;
    destination: string;
    pickup?: string;
    service?: string;
    date?: string;
    message: string;
  }) => {
    setIsSaving(true);
    try {
      if (payload.id) {
        await updateLead(payload as Lead);
        showToast("success", "Lead updated successfully.");
      } else {
        await createLead(payload);
        showToast("success", "Lead saved successfully.");
      }
      setShowForm(false);
      setEditingLead(null);
      await loadLeads();
    } catch (createError) {
      showToast(
        "error",
        createError instanceof Error
          ? createError.message
          : "Failed to save lead.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    setIsSaving(true);
    try {
      await deleteLead(deleteConfirmId);
      showToast("success", "Lead deleted successfully.");
      setDeleteConfirmId(null);
      await loadLeads();
    } catch (err) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Failed to delete lead.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const leadCount = leads.length;
  const summary = useMemo(() => {
    return {
      total: leadCount,
      recent: leads.slice(0, 3),
    };
  }, [leadCount, leads]);

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto grid w-full max-w-[1600px] gap-6 xl:grid-cols-[280px_1fr]">
        <AdminSidebar
          activeSection={activeSection}
          onNavigate={scrollToSection}
          onLogout={handleLogout}
        />

        <div className="space-y-8">
          <section id="dashboard" className="space-y-8">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-white/40">
                  Dashboard
                </p>
                <h1 className="mt-3 text-4xl font-display text-white">
                  Lead Management
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                  Monitor inbound leads, update details quickly, and remove
                  stale records from the Google Sheets backend.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => {
                    setEditingLead(null);
                    setShowForm(true);
                  }}
                  className="rounded-2xl bg-gold-500 px-5 py-3 text-sm font-semibold text-royal-900 transition hover:bg-gold-400"
                >
                  Add new lead
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setRefreshing(true);
                    await loadLeads();
                    setRefreshing(false);
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white transition hover:border-gold-500/50 hover:bg-white/10"
                >
                  {refreshing ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-white/40">
                    Leads
                  </p>
                  <h2 className="mt-2 text-3xl font-display text-white">
                    {leadCount} total leads
                  </h2>
                </div>
                <div className="rounded-2xl bg-white/5 px-4 py-2 text-sm text-white/70">
                  Updated live from Google Sheets
                </div>
              </div>
            </div>

            {toast ? (
              <div
                className={`rounded-3xl border px-5 py-4 text-sm shadow-xl shadow-black/20 ${
                  toast.type === "success"
                    ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
                    : "border-red-400/20 bg-red-500/10 text-red-200"
                }`}
              >
                {toast.message}
              </div>
            ) : null}
          </section>

          <section id="leads" className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Leads table
                  </h3>
                  <p className="text-sm text-white/50">
                    View all leads from the Google Sheets backend.
                  </p>
                </div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/40">
                  {loading ? "Loading" : `${leadCount} records`}
                </p>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className="h-16 rounded-3xl bg-white/5 animate-pulse"
                    />
                  ))}
                </div>
              ) : error ? (
                <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-100">
                  {error}
                </div>
              ) : (
                <LeadsTable leads={leads} onEdit={handleEdit} onDelete={handleDelete} />
              )}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
              <aside className="space-y-6">
                {showForm ? (
                  <LeadForm
                    initialLead={editingLead ?? undefined}
                    submitLabel={editingLead ? "Update lead" : "Create lead"}
                    isSaving={isSaving}
                    onSubmit={handleFormSubmit}
                    onCancel={() => {
                      setShowForm(false);
                      setEditingLead(null);
                    }}
                  />
                ) : (
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
                    <p className="text-sm uppercase tracking-[0.35em] text-white/40">
                      Quick actions
                    </p>
                    <h2 className="mt-2 text-2xl font-display text-white">
                      Lead controls
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-white/60">
                      Create a new lead or refresh the table for the latest
                      Google Sheets data.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingLead(null);
                        setShowForm(true);
                      }}
                      className="mt-5 w-full rounded-2xl bg-gold-500 px-4 py-3 text-sm font-semibold text-royal-900 transition hover:bg-gold-400"
                    >
                      Open lead form
                    </button>
                  </div>
                )}

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
                  <p className="text-sm uppercase tracking-[0.35em] text-white/40">
                    Recent leads
                  </p>
                  <div className="mt-4 space-y-4">
                    {summary.recent.length === 0 ? (
                      <p className="text-sm text-white/50">
                        No recent leads yet.
                      </p>
                    ) : (
                      summary.recent.map((lead) => (
                        <div
                          key={lead.id}
                          className="rounded-3xl border border-white/10 bg-white/5 p-4"
                        >
                          <p className="text-sm font-semibold text-white">
                            {lead.name || "Unknown"}
                          </p>
                          <p className="text-xs text-white/50">
                            {lead.destination || "No destination"}
                          </p>
                          <p className="mt-2 text-xs text-white/50">
                            {lead.email || "No email"}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </aside>
            </div>
          </section>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[#071510] p-6 shadow-2xl shadow-black/60">
            <h3 className="font-display text-xl text-white mb-3">Delete lead?</h3>
            <p className="text-sm text-white/60 mb-6">
              This will permanently remove this lead from the Google Sheet.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isSaving}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
              >
                {isSaving ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
