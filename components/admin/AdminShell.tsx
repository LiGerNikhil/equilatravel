"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

const SESSION_KEY = "equila_admin_session";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) { router.replace("/admin/login"); return; }
    try {
      const session = JSON.parse(raw);
      if (session?.role !== "admin") { router.replace("/admin/login"); return; }
      fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: session.id, role: "admin" }),
      }).then((res) => {
        if (!res.ok) { localStorage.removeItem(SESSION_KEY); router.replace("/admin/login"); }
      }).catch(() => { localStorage.removeItem(SESSION_KEY); router.replace("/admin/login"); });
    } catch { router.replace("/admin/login"); }
  }, [router]);

  return (
    <div className="min-h-screen pt-24 md:pt-28" style={{ background: "#050a08" }}>
      <div className="mx-auto flex w-full max-w-[1600px]">
        <AdminSidebar />
        <main className="flex-1 min-w-0 px-4 py-8 sm:px-6 lg:px-8 xl:ml-0">
          {children}
        </main>
      </div>
    </div>
  );
}
