"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Ban, Car as CarIcon, FileText, ExternalLink, XCircle, AlertCircle } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";

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
};

type DocField = {
  documentNumber: string;
  files: string[];
  status: "pending" | "verified" | "rejected";
  rejectedReason: string;
};

type Documents = {
  drivingLicense: DocField;
  registrationCertificate: DocField;
  insurance: DocField;
  pollutionCertificate: DocField;
  policeVerification: DocField;
};

const DOC_LABELS: Record<string, string> = {
  drivingLicense: "Driving License",
  registrationCertificate: "RC (Registration Certificate)",
  insurance: "Insurance",
  pollutionCertificate: "PUC (Pollution Certificate)",
  policeVerification: "Police Verification",
};

export default function VendorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [documents, setDocuments] = useState<Documents | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<null | { type: "success" | "error"; message: string }>(null);
  const [rejectModal, setRejectModal] = useState<{ field: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [verifying, setVerifying] = useState<string | null>(null);

  const vendorId = params?.id as string | undefined;

  const loadVendor = async () => {
    if (!vendorId) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/vendors/${vendorId}`, { cache: "no-store" });
      if (!res.ok) {
        if (res.status === 404) { setError("Vendor not found."); return; }
        throw new Error("Failed to load vendor details");
      }
      const data = await res.json();
      setVendor(data.vendor);
      setCars(Array.isArray(data.cars) ? data.cars : []);
      setDocuments(data.documents || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load vendor details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadVendor(); }, [vendorId]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 4200);
  };

  const handleStatusChange = useCallback(async (newStatus: string) => {
    if (!vendor) return;
    try {
      const res = await fetch("/api/admin/vendors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: vendor._id, status: newStatus }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d?.error || "Failed to update status"); }
      setVendor({ ...vendor, status: newStatus as Vendor["status"] });
      showToast("success", "Vendor status updated.");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Update failed.");
    }
  }, [vendor]);

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

  const handleDocVerify = async (field: string) => {
    if (!vendor) return;
    setVerifying(field);
    try {
      const res = await fetch("/api/admin/documents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId: vendor._id, field, status: "verified" }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d?.error || "Failed to verify"); }
      setDocuments((prev) => {
        if (!prev) return prev;
        return { ...prev, [field]: { ...prev[field as keyof Documents], status: "verified" as const, rejectedReason: "" } };
      });
      showToast("success", "Document verified.");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setVerifying(null);
    }
  };

  const handleDocReject = async () => {
    if (!vendor || !rejectModal) return;
    setVerifying(rejectModal.field);
    try {
      const res = await fetch("/api/admin/documents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId: vendor._id, field: rejectModal.field, status: "rejected", rejectedReason: rejectReason }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d?.error || "Failed to reject"); }
      setDocuments((prev) => {
        if (!prev) return prev;
        return { ...prev, [rejectModal.field]: { ...prev[rejectModal.field as keyof Documents], status: "rejected" as const, rejectedReason: rejectReason } };
      });
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
      active: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      inactive: "bg-red-500/15 text-red-300 border-red-500/30",
      pending: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
    };
    return styles[status] || styles.pending;
  };

  const docStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      verified: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      rejected: "bg-red-500/15 text-red-300 border-red-500/30",
      pending: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
    };
    return styles[status] || styles.pending;
  };

  return (
    <AdminShell>
      <div className="space-y-8">
        {/* Back link */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/vendors"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-[#c9a84c] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Vendors
          </Link>
          <Link
            href="/admin/documents"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-[#c9a84c] transition-colors"
          >
            <FileText size={14} />
            Document Requests
          </Link>
        </div>

        {/* Toast */}
        {toast ? (
          <div className={`rounded-3xl border px-5 py-4 text-sm shadow-xl shadow-black/20 ${toast.type === "success" ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200" : "border-red-400/20 bg-red-500/10 text-red-200"}`}>
            {toast.message}
          </div>
        ) : null}

        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-20 rounded-3xl bg-white/5 animate-pulse" />)}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-100">{error}</div>
        ) : vendor ? (
          <>
            {/* Vendor Info Card */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/40 mb-1">Vendor Profile</p>
                  <h1 className="text-3xl font-display text-white mt-1">{vendor.name}</h1>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Email</p>
                      <p className="text-white/70 text-sm">{vendor.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Status</p>
                      <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${statusBadge(vendor.status)}`}>
                        {vendor.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Registered</p>
                      <p className="text-white/70 text-sm">{new Date(vendor.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Status actions */}
                <div className="flex-shrink-0">
                  {vendor.status === "pending" ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleStatusChange("active")}
                        className="rounded-xl bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/25"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange("inactive")}
                        className="rounded-xl bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/25"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(vendor.status === "active" ? "inactive" : "active")}
                      className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${vendor.status === "active" ? "bg-red-500/15 text-red-300 hover:bg-red-500/25" : "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"}`}
                    >
                      {vendor.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">Documents</h2>
                  <p className="text-sm text-white/50">Vendor document verification status</p>
                </div>
              </div>

              {documents ? (
                <div className="space-y-3">
                  {Object.entries(DOC_LABELS).map(([fieldKey, fieldLabel]) => {
                    const field = documents[fieldKey as keyof Documents];
                    if (!field?.documentNumber && (!field?.files || field.files.length === 0)) {
                      return (
                        <div key={fieldKey} className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3 opacity-50">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white/60">{fieldLabel}</p>
                            <p className="text-xs text-white/40">Not submitted</p>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div key={fieldKey} className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white">{fieldLabel}</p>
                          <p className="text-xs text-white/50 truncate">{field.documentNumber}</p>
                          {field.status === "rejected" && field.rejectedReason && (
                            <p className="text-[10px] text-red-400 mt-0.5">Reason: {field.rejectedReason}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {field.files && field.files.length > 0 && (
                            <a
                              href={field.files[0]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-[10px] text-white/60 hover:text-white transition"
                            >
                              <FileText size={12} /> View <ExternalLink size={10} />
                            </a>
                          )}
                          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${docStatusBadge(field.status)}`}>
                            {field.status === "verified" ? <CheckCircle size={10} /> : field.status === "rejected" ? <XCircle size={10} /> : <AlertCircle size={10} />}
                            {field.status}
                          </span>
                          {field.status !== "verified" && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleDocVerify(fieldKey)}
                                disabled={verifying === fieldKey}
                                className="rounded-xl bg-emerald-500/15 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-300 transition hover:bg-emerald-500/25 disabled:opacity-50"
                              >
                                Verify
                              </button>
                              {field.status !== "rejected" && (
                                <button
                                  type="button"
                                  onClick={() => setRejectModal({ field: fieldKey })}
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
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                  <FileText size={40} className="mx-auto text-white/10 mb-3" />
                  <p className="text-sm text-white/50">No documents submitted yet.</p>
                </div>
              )}
            </div>

            {/* Cars Section */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Cars ({cars.length})
                  </h2>
                  <p className="text-sm text-white/50">
                    All vehicles registered by this vendor
                  </p>
                </div>
              </div>

              {cars.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                  <CarIcon size={40} className="mx-auto text-white/10 mb-3" />
                  <p className="text-sm text-white/50">No cars added yet.</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {cars.map((car) => (
                    <div
                      key={car._id}
                      className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition-all duration-200 hover:border-white/20"
                    >
                      {/* Car Image */}
                      <div className="relative h-44 bg-[#0a1f14]">
                        {car.images && car.images.length > 0 ? (
                          <Image
                            src={car.images[0]}
                            alt={car.carName}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <CarIcon size={48} className="text-white/10" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050a08]/60 to-transparent" />

                        {car.images && car.images.length > 1 && (
                          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white/70">
                            <span>{car.images.length}</span>
                          </div>
                        )}

                        <div className="absolute top-3 left-3">
                          <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${car.isAvailable ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : "bg-red-500/15 text-red-300 border-red-500/30"}`}>
                            {car.isAvailable ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <div className="absolute bottom-3 right-3">
                          <span className="text-xs font-body font-semibold px-2.5 py-1 rounded-sm" style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", color: "#f5e6b8" }}>
                            ₹{car.pricePerKM.toFixed(2)}/km
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-display text-base font-semibold text-white">{car.carName}</h3>
                            <p className="text-white/50 text-xs mt-0.5">{car.vehicleNumber}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCarToggle(car._id, car.isAvailable)}
                            className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold transition ${car.isAvailable ? "bg-red-500/15 text-red-300 hover:bg-red-500/25" : "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"}`}
                          >
                            {car.isAvailable ? <Ban size={10} /> : <CheckCircle size={10} />}
                            {car.isAvailable ? "Deactivate" : "Activate"}
                          </button>
                        </div>

                        {car.features && car.features.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {car.features.map((f, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] text-white/40 px-2 py-0.5 rounded"
                                style={{ border: "1px solid rgba(201,168,76,0.1)", background: "rgba(201,168,76,0.04)" }}
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        )}

                        {car.images && car.images.length > 1 && (
                          <p className="text-[10px] text-white/30 mt-2">
                            +{car.images.length - 1} more photo{car.images.length - 1 !== 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>

      {/* Reject reason modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#071510] p-6 shadow-2xl shadow-black/60">
            <h3 className="font-display text-lg text-white mb-3">Reject {rejectModal.field ? DOC_LABELS[rejectModal.field] : "Document"}</h3>
            <p className="text-sm text-white/60 mb-4">Provide a reason so the vendor can fix it.</p>
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
                onClick={handleDocReject}
                disabled={!rejectReason.trim() || verifying === rejectModal.field}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
              >
                {verifying === rejectModal.field ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
