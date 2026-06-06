"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, CheckCircle, XCircle, AlertCircle, Plus, X, FileText } from "lucide-react";

const SESSION_KEY = "equila_vendor_session";

type Session = { id: string; email: string; role: string; status: string };

type DocField = {
  documentNumber: string;
  files: string[];
  status: "pending" | "verified" | "rejected";
  rejectedReason: string;
};

type VendorDocument = {
  _id: string;
  vendorId: string;
  drivingLicense: DocField;
  registrationCertificate: DocField;
  insurance: DocField;
  pollutionCertificate: DocField;
  policeVerification: DocField;
};

const DOC_LABELS: Record<string, { label: string; placeholder: string; hint: string }> = {
  drivingLicense: { label: "Driving License", placeholder: "15 alphanumeric characters", hint: "Exactly 15 characters (letters & numbers)" },
  registrationCertificate: { label: "RC (Registration Certificate)", placeholder: "RC document number", hint: "Upload the RC document" },
  insurance: { label: "Insurance", placeholder: "Insurance policy number", hint: "Upload the insurance document" },
  pollutionCertificate: { label: "PUC (Pollution Certificate)", placeholder: "PUC certificate number", hint: "Upload the PUC certificate" },
  policeVerification: { label: "Police Verification", placeholder: "Verification reference number", hint: "Upload the police verification document" },
};

const statusIcon = (status: string) => {
  switch (status) {
    case "verified": return <CheckCircle size={16} className="text-emerald-400" />;
    case "rejected": return <XCircle size={16} className="text-red-400" />;
    default: return <AlertCircle size={16} className="text-yellow-400" />;
  }
};

export default function VendorDocumentsPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [doc, setDoc] = useState<VendorDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [editNumber, setEditNumber] = useState("");
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<null | { type: "success" | "error"; message: string }>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) { router.replace("/vendor/login"); return; }
    try {
      const s = JSON.parse(raw) as Session;
      if (s.role !== "vendor") { router.replace("/vendor/login"); return; }
      setSession(s);
      void fetchDocs(s.id);
    } catch {
      localStorage.removeItem(SESSION_KEY);
      router.replace("/vendor/login");
    }
  }, [router]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 4200);
  };

  const fetchDocs = async (vendorId: string) => {
    try {
      const res = await fetch("/api/vendor/documents", {
        headers: { "x-vendor-id": vendorId },
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load documents");
      setDoc(data);
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  const updateDocField = async (field: string, documentNumber: string) => {
    if (!session) return;
    setSaving(true);
    try {
      const res = await fetch("/api/vendor/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-vendor-id": session.id },
        body: JSON.stringify({ field, documentNumber }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update document");
      setDoc(data.document);
      showToast("success", "Document updated.");
      setActiveField(null);
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (file: File) => {
    if (!session || !uploadTarget) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/vendor/documents/upload", {
        method: "POST",
        headers: { "x-vendor-id": session.id },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Upload failed");

      const updateRes = await fetch("/api/vendor/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-vendor-id": session.id },
        body: JSON.stringify({ field: uploadTarget, files: [data.url] }),
      });
      const updateData = await updateRes.json();
      if (!updateRes.ok) throw new Error(updateData?.error || "Failed to attach file");
      setDoc(updateData.document);
      showToast("success", "File uploaded.");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      setUploadTarget("");
    }
  };

  const isAllVerified = doc && ["drivingLicense", "registrationCertificate", "insurance", "pollutionCertificate", "policeVerification"]
    .every((f) => (doc[f as keyof VendorDocument] as DocField)?.status === "verified");

  const totalDocs = doc ? ["drivingLicense", "registrationCertificate", "insurance", "pollutionCertificate", "policeVerification"]
    .filter((f) => {
      const field = doc[f as keyof VendorDocument] as DocField;
      return field?.documentNumber || field?.files?.length > 0;
    }).length : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(5)].map((_, i) => <div key={i} className="h-24 rounded-3xl bg-white/5 animate-pulse" />)}
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto max-w-[1400px] space-y-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-white/40">Vendor portal</p>
            <h1 className="mt-3 text-4xl font-display text-white">Document Verification</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
              Upload the required documents to get verified. All documents must be approved by the admin before you can add cars.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isAllVerified ? (
              <span className="flex items-center gap-2 rounded-2xl bg-emerald-500/15 px-5 py-3 text-sm font-semibold text-emerald-300">
                <CheckCircle size={18} /> All verified
              </span>
            ) : (
              <span className="flex items-center gap-2 rounded-2xl bg-yellow-500/15 px-5 py-3 text-sm font-semibold text-yellow-300">
                <AlertCircle size={18} /> {totalDocs}/5 documents submitted
              </span>
            )}
          </div>
        </div>

        {/* Toast */}
        {toast ? (
          <div className={`rounded-3xl border px-5 py-4 text-sm shadow-xl shadow-black/20 ${toast.type === "success" ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200" : "border-red-400/20 bg-red-500/10 text-red-200"}`}>
            {toast.message}
          </div>
        ) : null}

        {/* Document Cards */}
        <div className="grid gap-6">
          {Object.entries(DOC_LABELS).map(([key, meta]) => {
            const field = doc?.[key as keyof VendorDocument] as DocField | undefined;
            const status = field?.status || "pending";
            const isVerified = status === "verified";
            const isRejected = status === "rejected";

            return (
              <div key={key} className={`rounded-3xl border p-6 shadow-xl shadow-black/20 transition ${isVerified ? "border-emerald-500/20 bg-emerald-500/[0.03]" : "border-white/10 bg-white/5"}`}>
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className={isVerified ? "text-emerald-400" : isRejected ? "text-red-400" : "text-gold-500"} />
                    <div>
                      <h3 className="text-lg font-semibold text-white">{meta.label}</h3>
                      <p className="text-xs text-white/50">{meta.hint}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusIcon(status)}
                    <span className={`text-xs font-semibold capitalize ${isVerified ? "text-emerald-400" : isRejected ? "text-red-400" : "text-yellow-400"}`}>
                      {status}
                    </span>
                  </div>
                </div>

                {/* Rejected reason */}
                {isRejected && field?.rejectedReason && (
                  <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    Reason: {field.rejectedReason}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Document number */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.35em] text-white/50 mb-2">Document number</label>
                    {activeField === key ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editNumber}
                          onChange={(e) => setEditNumber(e.target.value)}
                          placeholder={meta.placeholder}
                          className="flex-1 rounded-2xl border border-white/10 bg-transparent px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-gold-500"

                        />
                        <button
                          type="button"
                          onClick={() => updateDocField(key, editNumber)}
                          disabled={saving}
                          className="rounded-2xl bg-gold-500 px-4 py-2.5 text-sm font-semibold text-royal-900 transition hover:bg-gold-400 disabled:opacity-50"
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveField(null)}
                          className="rounded-2xl border border-white/10 px-3 py-2.5 text-sm text-white/60 transition hover:bg-white/5"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-white/70 text-sm">{field?.documentNumber || "—"}</span>
                        <button
                          type="button"
                          onClick={() => { setActiveField(key); setEditNumber(field?.documentNumber || ""); }}
                          className="text-[10px] font-semibold text-gold-500/70 hover:text-gold-500 underline"
                        >
                          {field?.documentNumber ? "Edit" : "Add"}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* File upload */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.35em] text-white/50 mb-2">Uploaded files</label>
                    <div className="flex flex-wrap gap-2">
                      {field?.files && field.files.length > 0 ? (
                        field.files.map((url, idx) => (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
                          >
                            <FileText size={14} />
                            File {idx + 1}
                          </a>
                        ))
                      ) : (
                        <span className="text-sm text-white/40">No files uploaded</span>
                      )}
                      <button
                        type="button"
                        onClick={() => { setUploadTarget(key); fileInputRef.current?.click(); }}
                        disabled={uploading}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-white/20 bg-white/5 px-3 py-2 text-xs text-white/50 transition hover:border-gold-500/50 hover:text-white disabled:opacity-50"
                      >
                        {uploading && uploadTarget === key ? "Uploading..." : <><Upload size={14} /> Upload</>}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*,.pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) { handleUpload(f); e.target.value = ""; } }}
        />

        {/* Summary */}
        {doc && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
            <h3 className="text-lg font-semibold text-white mb-2">Verification Summary</h3>
            {isAllVerified ? (
              <div className="flex items-center gap-3 text-emerald-400">
                <CheckCircle size={20} />
                <p className="text-sm">All documents verified. You can now add cars to your fleet.</p>
              </div>
            ) : (
              <p className="text-sm text-white/60">
                {totalDocs}/5 documents submitted. {5 - totalDocs} remaining. All documents must be verified by admin before you can add cars.
              </p>
            )}
            {!isAllVerified && (
              <a
                href="/vendor/dashboard"
                className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/70 transition hover:bg-white/10"
              >
                Back to Dashboard
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
