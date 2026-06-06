"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, MessageSquare, Users, Car, FileText, LogOut, Menu, X, Lock, Eye, EyeOff } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Enquiries", href: "/admin", icon: MessageSquare },
  { label: "Vendors", href: "/admin/vendors", icon: Users },
  { label: "Cars", href: "/admin/cars", icon: Car },
  { label: "Documents", href: "/admin/documents", icon: FileText },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showChangePw, setShowChangePw] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [showPw, setShowPw] = useState(false);

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    localStorage.removeItem("equila_admin_session");
    router.push("/admin/login");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }

    setPwSaving(true);
    try {
      const raw = localStorage.getItem("equila_admin_session");
      if (!raw) throw new Error("Session not found.");
      const session = JSON.parse(raw);

      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: session.id, currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to change password");
      setPwSuccess("Password changed successfully.");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      window.setTimeout(() => setShowChangePw(false), 1500);
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "Failed to change password.");
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 block rounded-xl border border-white/10 bg-[#071510]/90 p-2.5 text-white/70 backdrop-blur-md xl:hidden"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay on mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 xl:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-white/10 bg-[#071510] shadow-2xl shadow-black/40 transition-transform duration-300 xl:sticky xl:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: "rgba(201,168,76,0.15)" }}>
            <Car size={18} className="text-[#c9a84c]" />
          </div>
          <div>
            <p className="text-sm font-display text-white font-semibold leading-tight">Equila Travel</p>
            <p className="text-[10px] uppercase tracking-widest text-white/30">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-6">
          <p className="mb-2 px-3 text-[10px] uppercase tracking-[0.3em] text-white/30">Menu</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-[#c9a84c]/15 text-[#c9a84c] shadow-sm shadow-[#c9a84c]/5"
                    : "text-white/60 hover:bg-white/5 hover:text-white/80"
                }`}
              >
                <Icon size={18} className={active ? "text-[#c9a84c]" : "text-white/40"} />
                {item.label}
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#c9a84c]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Change Password & Logout */}
        <div className="border-t border-white/10 px-3 py-4 space-y-1">
          <button
            type="button"
            onClick={() => { setShowChangePw(true); setPwError(""); setPwSuccess(""); setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/50 transition-all duration-200 hover:bg-white/5 hover:text-white/80"
          >
            <Lock size={18} className="text-white/40" />
            Change Password
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-400/80 transition-all duration-200 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Change Password Modal */}
      {showChangePw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setShowChangePw(false)}>
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#071510] p-6 shadow-2xl shadow-black/60" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-lg text-white">Change Password</h3>
              <button type="button" onClick={() => setShowChangePw(false)} className="rounded-xl border border-white/10 px-3 py-1 text-sm text-white/60 hover:bg-white/5">
                Close
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.35em] text-white/50 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={pwForm.currentPassword}
                    onChange={(e) => setPwForm((p) => ({ ...p, currentPassword: e.target.value }))}
                    required
                    className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 pr-10 text-white outline-none placeholder:text-white/30 focus:border-gold-500"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.35em] text-white/50 mb-2">New Password</label>
                <input
                  type="password"
                  value={pwForm.newPassword}
                  onChange={(e) => setPwForm((p) => ({ ...p, newPassword: e.target.value }))}
                  required
                  minLength={6}
                  className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-gold-500"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.35em] text-white/50 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={pwForm.confirmPassword}
                  onChange={(e) => setPwForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                  required
                  minLength={6}
                  className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-gold-500"
                />
              </div>

              {pwError ? <p className="text-sm text-red-300">{pwError}</p> : null}
              {pwSuccess ? <p className="text-sm text-emerald-300">{pwSuccess}</p> : null}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowChangePw(false)} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/5">
                  Cancel
                </button>
                <button type="submit" disabled={pwSaving} className="rounded-xl bg-gold-500 px-4 py-2 text-sm font-semibold text-royal-900 transition hover:bg-gold-400 disabled:opacity-50">
                  {pwSaving ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
