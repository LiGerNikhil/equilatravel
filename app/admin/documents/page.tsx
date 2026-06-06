"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, CheckCircle, XCircle, AlertCircle, ExternalLink } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";

type DocField = {
  documentNumber: string;
  files: string[];
  status: "pending" | "verified" | "rejected";
  rejectedReason: string;
};

type VendorDocument = {
  _id: string;
  vendorId: {
    _id: string;
    name: string;
    email: string;
    status: string;
  } | null;
  drivingLicense: DocField;
  registrationCertificate: DocField;
  insurance: DocField;
  pollutionCertificate: DocField;
  policeVerification: DocField;
};

const DOC_LABELS: Record<string, string> = {
  drivingLicense: "Driving License",
  registrationCertificate: "RC",
  insurance: "Insurance",
  pollutionCertificate: "PUC",
  policeVerification: "Police Verification",
};

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<VendorDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [toast, setToast] = useState<null | { type: "success" | "error"; message: string }>(null);
  const [rejectModal, setRejectModal] = useState<{ vendorId: string; field: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => { void loadData(); }, []);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 4200);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/documents", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load documents");
      const data = await res.json();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (vendorId: string, field: string) => {
    setVerifying(`${vendorId}-${field}`);
    try {
      const res = await fetch("/api/admin/documents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId, field, status: "verified" }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d?.error || "Failed to verify"); }
      setDocuments((prev) => prev.map((d) => {
        if (d.vendorId?._id === vendorId) {
          const updated = { ...d };
          (updated[field as keyof VendorDocument] as DocField) = {
            ...(updated[field as keyof VendorDocument] as DocField),
            status: "verified",
            rejectedReason: "",
          };
          return updated;
        }
        return d;
      }));
      showToast("success", "Document verified.");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setVerifying(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setVerifying(`${rejectModal.vendorId}-${rejectModal.field}`);
    try {
      const res = await fetch("/api/admin/documents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId: rejectModal.vendorId, field: rejectModal.field, status: "rejected", rejectedReason: rejectReason }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d?.error || "Failed to reject"); }
      setDocuments((prev) => prev.map((d) => {
        if (d.vendorId?._id === rejectModal.vendorId) {
          const updated = { ...d };
          (updated[rejectModal.field as keyof VendorDocument] as DocField) = {
            ...(updated[rejectModal.field as keyof VendorDocument] as DocField),
            status: "rejected",
            rejectedReason: rejectReason,
          };
          return updated;
        }
        return d;
      }));
      showToast("success", "Document rejected.");
      setRejectModal(null);
      setRejectReason("");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to reject.");
    } finally {
      setVerifying(null);
    }
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      verified: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      rejected: "bg-red-500/15 text-red-300 border-red-500/30",
      pending: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
    };
    return styles[status] || styles.pending;
  };

  const getOverallStatus = (doc: VendorDocument) => {
    const fields = ["drivingLicense", "registrationCertificate", "insurance", "pollutionCertificate", "policeVerification"];
    const allVerified = fields.every((f) => (doc[f as keyof VendorDocument] as DocField)?.status === "verified");
    const anyRejected = fields.some((f) => (doc[f as keyof VendorDocument] as DocField)?.status === "rejected");
    const anySubmitted = fields.some((f) => {
      const field = doc[f as keyof VendorDocument] as DocField;
      return field?.documentNumber || field?.files?.length > 0;
    });
    if (allVerified) return { label: "All Verified", color: "text-emerald-400", icon: CheckCircle };
    if (anyRejected) return { label: "Has Rejected", color: "text-red-400", icon: XCircle };
    if (anySubmitted) return { label: "In Progress", color: "text-yellow-400", icon: AlertCircle };
    return { label: "Not Started", color: "text-white/40", icon: AlertCircle };
  };

  const getPendingCount = (doc: VendorDocument) => {
    const fields = ["drivingLicense", "registrationCertificate", "insurance", "pollutionCertificate", "policeVerification"];
    return fields.filter((f) => {
      const field = doc[f as keyof VendorDocument] as DocField;
      return (field?.documentNumber || field?.files?.length > 0) && field?.status === "pending";
    }).length;
  };

  if (loading) {
    return (
      <AdminShell>
        <div className="space-y-6">
          {[...Array(6)].map((_, i) => <div key={i} className="h-24 rounded-3xl bg-white/5 animate-pulse" />)}
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-white/40">Admin panel</p>
          <h1 className="mt-3 text-4xl font-display text-white">Document Requests</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
            Review and verify vendor documents. Each document must be checked before the vendor can add cars.
          </p>
        </div>

        {/* Toast */}
        {toast ? (
          <div className={`rounded-3xl border px-5 py-4 text-sm shadow-xl shadow-black/20 ${toast.type === "success" ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200" : "border-red-400/20 bg-red-500/10 text-red-200"}`}>
            {toast.message}
          </div>
        ) : null}

        {documents.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center shadow-xl shadow-black/20">
            <FileText size={48} className="mx-auto text-white/10 mb-4" />
            <p className="text-lg font-display text-white/60">No document submissions yet.</p>
            <p className="mt-2 text-sm text-white/40">Vendors will appear here once they submit their documents.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {documents.map((doc) => {
              const overall = getOverallStatus(doc);
              const Icon = overall.icon;
              const pendingCount = getPendingCount(doc);

              return (
                <div key={doc._id} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
                  {/* Vendor header */}
                  <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                    <div>
                      {doc.vendorId ? (
                        <>
                          <Link
                            href={`/admin/vendors/${doc.vendorId._id}`}
                            className="text-lg font-semibold text-white hover:text-gold-500 transition-colors flex items-center gap-2"
                          >
                            {doc.vendorId.name}
                            <ExternalLink size={14} className="text-white/30" />
                          </Link>
                          <p className="text-sm text-white/50">{doc.vendorId.email}</p>
                        </>
                      ) : (
                        <>
                          <p className="text-lg font-semibold text-white/40">Unknown Vendor</p>
                          <p className="text-sm text-white/30">Vendor account may have been deleted</p>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-1.5 text-xs font-semibold ${overall.color}`}>
                        <Icon size={14} /> {overall.label}
                      </span>
                      {pendingCount > 0 && (
                        <span className="rounded-full bg-yellow-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-yellow-300">
                          {pendingCount} pending
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Document rows */}
                  <div className="space-y-3">
                    {Object.entries(DOC_LABELS).map(([fieldKey, fieldLabel]) => {
                      const field = doc[fieldKey as keyof VendorDocument] as DocField;
                      if (!field?.documentNumber && (!field?.files || field.files.length === 0)) return null;

                      return (
                        <div key={fieldKey} className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white">{fieldLabel}</p>
                            <p className="text-xs text-white/50 truncate">{field.documentNumber}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {field.files && field.files.length > 0 && (
                              <a
                                href={field.files[0]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-[10px] text-white/60 hover:text-white transition"
                              >
                                <FileText size={12} /> View
                              </a>
                            )}
                            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${statusBadge(field.status)}`}>
                              {field.status === "verified" ? <CheckCircle size={10} /> : field.status === "rejected" ? <XCircle size={10} /> : <AlertCircle size={10} />}
                              {field.status}
                            </span>
                            {field.status !== "verified" && doc.vendorId && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleVerify(doc.vendorId!._id, fieldKey)}
                                  disabled={verifying === `${doc.vendorId._id}-${fieldKey}`}
                                  className="rounded-xl bg-emerald-500/15 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-300 transition hover:bg-emerald-500/25 disabled:opacity-50"
                                >
                                  Verify
                                </button>
                                {field.status !== "rejected" && (
                                  <button
                                    type="button"
                                    onClick={() => setRejectModal({ vendorId: doc.vendorId!._id, field: fieldKey })}
                                    className="rounded-xl bg-red-500/15 px-2.5 py-1.5 text-[10px] font-semibold text-red-300 transition hover:bg-red-500/25"
                                  >
                                    Reject
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* No docs submitted yet indicator */}
                    {["drivingLicense", "registrationCertificate", "insurance", "pollutionCertificate", "policeVerification"]
                      .every((f) => {
                        const field = doc[f as keyof VendorDocument] as DocField;
                        return !field?.documentNumber && (!field?.files || field.files.length === 0);
                      }) && (
                      <p className="text-sm text-white/40 py-2">No documents have been submitted yet.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Reject reason modal */}
        {rejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#071510] p-6 shadow-2xl shadow-black/60">
              <h3 className="font-display text-lg text-white mb-3">Reject {DOC_LABELS[rejectModal.field]}</h3>
              <p className="text-sm text-white/60 mb-4">Provide a reason for rejection so the vendor can fix it.</p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
                rows={3}
                className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-gold-500 mb-4"
              />
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setRejectModal(null); setRejectReason(""); }}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={!rejectReason.trim() || verifying === `${rejectModal.vendorId}-${rejectModal.field}`}
                  className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
                >
                  {verifying === `${rejectModal.vendorId}-${rejectModal.field}` ? "Rejecting..." : "Reject"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
