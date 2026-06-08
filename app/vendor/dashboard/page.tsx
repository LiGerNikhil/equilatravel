"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, X, Plus, FileText, CheckCircle, AlertCircle, Calendar, User, MapPin, ClipboardList } from "lucide-react";

const SESSION_KEY = "equila_vendor_session";

type VendorCar = {
  _id: string;
  carName: string;
  vehicleNumber: string;
  pricePerKM: number;
  isAvailable: boolean;
  status: 'available' | 'booked' | 'assigned';
  images: string[];
  features: string[];
  isBooked?: boolean;
  booking?: {
    customerName: string;
    date: string;
    pickup: string;
    destination: string;
    status: string;
  } | null;
};

type Session = {
  id: string;
  email: string;
  role: string;
  status: string;
};

const emptyForm = {
  carName: "",
  vehicleNumber: "",
  pricePerKM: "",
  images: [] as string[],
  features: [] as string[],
};

export default function VendorDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [cars, setCars] = useState<VendorCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<VendorCar | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<null | { type: "success" | "error"; message: string }>(null);
  const [form, setForm] = useState(emptyForm);
  const [newFeature, setNewFeature] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [docVerified, setDocVerified] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) {
      router.replace("/vendor/login");
      return;
    }
    try {
      const s = JSON.parse(raw) as Session;
      if (s.role !== "vendor") {
        router.replace("/vendor/login");
        return;
      }
      setSession(s);
      void verifySession(s.id);
      void fetchCars(s.id);
      void checkDocStatus(s.id);
    } catch {
      localStorage.removeItem(SESSION_KEY);
      router.replace("/vendor/login");
    }
  }, [router]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 4200);
  };

  const fetchCars = async (vendorId: string) => {
    try {
      const res = await fetch("/api/vendor/cars", {
        headers: { "x-vendor-id": vendorId },
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load cars");
      setCars(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to load cars.");
    } finally {
      setLoading(false);
    }
  };

  const verifySession = async (vendorId: string) => {
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: vendorId, role: "vendor" }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Session invalid");
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
      router.replace("/vendor/login");
    }
  };

  const checkDocStatus = async (vendorId: string) => {
    try {
      const res = await fetch("/api/vendor/documents", {
        headers: { "x-vendor-id": vendorId },
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = await res.json();
      const fields = ["drivingLicense", "registrationCertificate", "insurance", "pollutionCertificate", "policeVerification"];
      const allVerified = fields.every((f) => data[f]?.status === "verified");
      setDocVerified(allVerified);
    } catch {
      /* silent */
    }
  };

  const handleUpload = async (file: File) => {
    if (!session) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/vendor/cars/upload", {
        method: "POST",
        headers: { "x-vendor-id": session.id },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Upload failed");
      setForm((prev) => ({ ...prev, images: [...prev.images, data.url] }));
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const addFeature = () => {
    const f = newFeature.trim();
    if (!f) return;
    setForm((prev) => ({ ...prev, features: [...prev.features, f] }));
    setNewFeature("");
  };

  const removeFeature = (idx: number) => {
    setForm((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));
  };

  const openAddForm = () => {
    setEditingCar(null);
    setForm(emptyForm);
    setNewFeature("");
    setShowForm(true);
  };

  const openEditForm = (car: VendorCar) => {
    setEditingCar(car);
    setForm({
      carName: car.carName,
      vehicleNumber: car.vehicleNumber,
      pricePerKM: String(car.pricePerKM),
      images: car.images ? [...car.images] : [],
      features: car.features ? [...car.features] : [],
    });
    setNewFeature("");
    setShowForm(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session) return;
    setSaving(true);
    try {
      const payload = {
        carName: form.carName.trim(),
        vehicleNumber: form.vehicleNumber.trim(),
        pricePerKM: Number(form.pricePerKM),
        images: form.images,
        features: form.features,
      };

      if (editingCar) {
        const res = await fetch("/api/vendor/cars", {
          method: "PUT",
          headers: { "Content-Type": "application/json", "x-vendor-id": session.id },
          body: JSON.stringify({ carId: editingCar._id, ...payload }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to update car");
        setCars((prev) => prev.map((c) => (c._id === editingCar._id ? { ...data.car, isBooked: c.isBooked, booking: c.booking } : c)));
        showToast("success", "Car updated successfully.");
      } else {
        const res = await fetch("/api/vendor/cars", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-vendor-id": session.id },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to add car");
        setCars((prev) => [data.car, ...prev]);
        showToast("success", "Car added successfully.");
      }

      setShowForm(false);
      setEditingCar(null);
      setForm(emptyForm);
      setNewFeature("");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = useCallback(
    async (carId: string) => {
      if (!session) return;
      setCars((prev) =>
        prev.map((c) => (c._id === carId ? { ...c, isAvailable: !c.isAvailable } : c))
      );
      try {
        const res = await fetch("/api/vendor/cars/toggle", {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "x-vendor-id": session.id },
          body: JSON.stringify({ carId }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data?.error || "Toggle failed");
        }
      } catch (err) {
        setCars((prev) =>
          prev.map((c) => (c._id === carId ? { ...c, isAvailable: !c.isAvailable } : c))
        );
        showToast("error", err instanceof Error ? err.message : "Toggle failed.");
      }
    },
    [session]
  );

  const handleDelete = async () => {
    if (!deleteConfirmId || !session) return;
    setSaving(true);
    try {
      const res = await fetch("/api/vendor/cars", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-vendor-id": session.id },
        body: JSON.stringify({ carId: deleteConfirmId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Delete failed");
      }
      setCars((prev) => prev.filter((c) => c._id !== deleteConfirmId));
      setDeleteConfirmId(null);
      showToast("success", "Car deleted.");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    router.push("/vendor/login");
  };

  const activeCount = cars.filter((c) => c.status === 'available').length;
  const bookedCount = cars.filter((c) => c.status === 'booked' || c.status === 'assigned').length;

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px] space-y-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-white/40">Vendor dashboard</p>
            <h1 className="mt-3 text-4xl font-display text-white">My Fleet</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
              Manage your registered vehicles, add new cars, upload photos, and toggle availability.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/vendor/documents" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/80 transition hover:border-gold-500/50 hover:text-gold-500">
              <FileText size={16} /> Documents
            </Link>
            <Link href="/vendor/assignments" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/80 transition hover:border-gold-500/50 hover:text-gold-500">
              <ClipboardList size={16} /> Bookings
            </Link>
            <button type="button" onClick={openAddForm} className="rounded-2xl bg-gold-500 px-5 py-3 text-sm font-semibold text-royal-900 transition hover:bg-gold-400">
              Add new car
            </button>
            <button type="button" onClick={handleLogout} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white transition hover:border-red-500/50 hover:bg-red-500/10">
              Logout
            </button>
          </div>
        </div>

        {/* Toast */}
        {toast ? (
          <div className={`rounded-3xl border px-5 py-4 text-sm shadow-xl shadow-black/20 ${toast.type === "success" ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200" : "border-red-400/20 bg-red-500/10 text-red-200"}`}>
            {toast.message}
          </div>
        ) : null}

        {/* Document status banner */}
        {session && docVerified === false && (
          <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-5 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-yellow-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-yellow-200">Documents not verified</p>
                <p className="text-xs text-yellow-300/70 mt-1">You need to submit and get all documents verified by admin before you can add cars.</p>
              </div>
              <Link
                href="/vendor/documents"
                className="flex-shrink-0 rounded-xl bg-yellow-500/15 px-4 py-2 text-xs font-semibold text-yellow-200 transition hover:bg-yellow-500/25"
              >
                <FileText size={14} className="inline mr-1.5" />Upload Documents
              </Link>
            </div>
          </div>
        )}
        {session && docVerified === true && (
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-5 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-emerald-400 flex-shrink-0" />
              <p className="text-sm text-emerald-200">All documents verified. You can add cars to your fleet.</p>
            </div>
          </div>
        )}

        {/* Metrics */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
            <p className="text-xs uppercase tracking-[0.35em] text-white/40">Total cars</p>
            <p className="mt-3 text-5xl font-display text-gold-500">{loading ? "..." : cars.length}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
            <p className="text-xs uppercase tracking-[0.35em] text-white/40">Available</p>
            <p className="mt-3 text-5xl font-display text-emerald-400">{loading ? "..." : activeCount}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
            <p className="text-xs uppercase tracking-[0.35em] text-white/40">Booked</p>
            <p className="mt-3 text-5xl font-display text-blue-400">{loading ? "..." : bookedCount}</p>
          </div>
        </div>

        {/* Add / Edit Car Form Overlay */}
        {showForm ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#071510] p-6 shadow-2xl shadow-black/60">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display text-xl text-white">{editingCar ? "Edit car" : "Add new car"}</h3>
                <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-white/10 px-3 py-1 text-sm text-white/60 transition hover:bg-white/5">
                  Close
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Car name + Vehicle number */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.35em] text-white/50 mb-2">Car name</label>
                    <input type="text" value={form.carName} onChange={(e) => setForm((p) => ({ ...p, carName: e.target.value }))} required placeholder="e.g. Toyota Innova" className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-gold-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.35em] text-white/50 mb-2">Vehicle number</label>
                    <input type="text" value={form.vehicleNumber} onChange={(e) => setForm((p) => ({ ...p, vehicleNumber: e.target.value }))} required placeholder="e.g. KA-01-AB-1234" className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-gold-500" />
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.35em] text-white/50 mb-2">Price per KM (₹)</label>
                  <input type="number" step="0.01" min="0" value={form.pricePerKM} onChange={(e) => setForm((p) => ({ ...p, pricePerKM: e.target.value }))} required placeholder="e.g. 14.50" className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-gold-500" />
                </div>

                {/* Image upload */}
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.35em] text-white/50 mb-2">Photos</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) { handleUpload(f); e.target.value = ""; } }}
                  />
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-2 text-sm text-white/60 transition hover:border-gold-500/50 hover:text-white disabled:opacity-50">
                    {uploading ? "Uploading..." : "Upload photo"}
                  </button>
                  {form.images.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {form.images.map((url, idx) => (
                        <div key={idx} className="relative h-20 w-20 overflow-hidden rounded-xl border border-white/10">
                          <Image src={url} alt="" fill className="object-cover" />
                          <button type="button" onClick={() => removeImage(idx)} className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white/80 hover:text-white">
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                {/* Features */}
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.35em] text-white/50 mb-2">Features</label>
                  <div className="flex gap-2">
                    <input type="text" value={newFeature} onChange={(e) => setNewFeature(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }} placeholder="e.g. AC, WiFi, USB Charging" className="flex-1 rounded-2xl border border-white/10 bg-transparent px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-gold-500" />
                    <button type="button" onClick={addFeature} className="rounded-2xl bg-gold-500 px-3 py-2.5 text-sm font-semibold text-royal-900 transition hover:bg-gold-400">
                      <Plus size={16} />
                    </button>
                  </div>
                  {form.features.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {form.features.map((f, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                          {f}
                          <button type="button" onClick={() => removeFeature(idx)} className="text-white/40 hover:text-red-300">
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="rounded-xl bg-gold-500 px-4 py-2 text-sm font-semibold text-royal-900 transition hover:bg-gold-400 disabled:opacity-50">
                    {saving ? "Saving..." : editingCar ? "Update car" : "Save car"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}

        {/* Delete confirmation */}
        {deleteConfirmId ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[#071510] p-6 shadow-2xl shadow-black/60">
              <h3 className="font-display text-xl text-white mb-3">Delete car?</h3>
              <p className="text-sm text-white/60 mb-6">This will permanently remove this car from your fleet.</p>
              <div className="flex items-center gap-3 justify-end">
                <button onClick={() => setDeleteConfirmId(null)} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5">
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={saving} className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50">
                  {saving ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Cars Grid */}
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-72 rounded-3xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : cars.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center shadow-xl shadow-black/20">
            <p className="text-lg font-display text-white/60">No cars in your fleet yet.</p>
            <p className="mt-2 text-sm text-white/40">Click &quot;Add new car&quot; to get started.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <div key={car._id} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20 transition hover:border-white/20">
                {/* Image */}
                <div className="relative mb-4 h-40 w-full overflow-hidden rounded-2xl bg-[#0a1f14]">
                  {car.images && car.images.length > 0 ? (
                    <Image src={car.images[0]} alt={car.carName} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/10 text-sm">No photo</div>
                  )}
                  {car.status === 'assigned' ? (
                    <span className="absolute right-2 top-2 rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-500/15 text-blue-300">Assigned</span>
                  ) : car.status === 'booked' ? (
                    <span className="absolute right-2 top-2 rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-500/15 text-red-300">Booked</span>
                  ) : (
                    <span className="absolute right-2 top-2 rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-500/15 text-emerald-300">Available</span>
                  )}
                </div>

                {/* Info */}
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{car.carName}</h3>
                    <p className="text-sm text-white/50">{car.vehicleNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-display text-gold-500">₹{car.pricePerKM.toFixed(2)}</p>
                    <p className="text-xs text-white/40">/km</p>
                  </div>
                </div>

                {/* Features */}
                {car.features && car.features.length > 0 ? (
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {car.features.map((f, idx) => (
                      <span key={idx} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/50">{f}</span>
                    ))}
                  </div>
                ) : null}

                {/* Booking info */}
                {car.isBooked && car.booking ? (
                  <div className="mb-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-3">
                    <p className="text-[11px] font-semibold text-blue-300 mb-2 flex items-center gap-1.5">
                      <User size={11} /> Booked by {car.booking.customerName}
                    </p>
                    {car.booking.date ? (
                      <p className="text-[10px] text-white/50 flex items-center gap-1.5 mb-1">
                        <Calendar size={10} /> {car.booking.date}
                      </p>
                    ) : null}
                    {car.booking.pickup || car.booking.destination ? (
                      <p className="text-[10px] text-white/50 flex items-center gap-1.5">
                        <MapPin size={10} /> {car.booking.pickup || '—'} → {car.booking.destination || '—'}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {/* Toggle */}
                <label className="mb-4 flex cursor-pointer items-center gap-3">
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={car.isAvailable} disabled={car.status !== 'available'} onChange={() => handleToggle(car._id)} />
                    <div className={`h-7 w-12 rounded-full transition-colors ${car.status !== 'available' ? "bg-blue-500/40 cursor-not-allowed" : car.isAvailable ? "bg-emerald-500" : "bg-white/20"}`}>
                      <div className={`h-7 w-7 rounded-full bg-white shadow-md transition-transform ${car.isAvailable ? "translate-x-5" : "translate-x-0"}`} />
                    </div>
                  </div>
                  <span className="text-sm text-white/60">{car.status === 'assigned' ? "Assigned" : car.status === 'booked' ? "Booked" : car.isAvailable ? "Active" : "Inactive"}</span>
                </label>

                {/* Edit / Delete */}
                <div className="flex gap-2">
                  <button type="button" onClick={() => openEditForm(car)} className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white">
                    <Pencil size={14} className="inline mr-1" />Edit
                  </button>
                  <button type="button" onClick={() => setDeleteConfirmId(car._id)} className="flex-1 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/15">
                    <Trash2 size={14} className="inline mr-1" />Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
