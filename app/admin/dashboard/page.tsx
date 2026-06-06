"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Car, MessageSquare, ArrowRight } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";

type Vendor = { _id: string; status: string };
type Car = { _id: string; isAvailable: boolean };

export default function AdminDashboard() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { void loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [vendorsRes, carsRes] = await Promise.all([
        fetch("/api/admin/vendors", { cache: "no-store" }),
        fetch("/api/admin/cars", { cache: "no-store" }),
      ]);
      if (vendorsRes.ok) setVendors(await vendorsRes.json());
      if (carsRes.ok) setCars(await carsRes.json());
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  const totalVendors = Array.isArray(vendors) ? vendors.length : 0;
  const activeVehicles = Array.isArray(cars) ? cars.filter((c) => c.isAvailable).length : 0;
  const pendingApprovals = Array.isArray(vendors) ? vendors.filter((v) => v.status === "pending").length : 0;
  const totalCars = Array.isArray(cars) ? cars.length : 0;

  if (loading) {
    return (
      <AdminShell>
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-3xl bg-white/5 animate-pulse" />)}
        </div>
      </AdminShell>
    );
  }

  const cards = [
    {
      label: "Vendors",
      value: totalVendors,
      sub: `${pendingApprovals} pending`,
      href: "/admin/vendors",
      icon: Users,
      color: "text-gold-500",
    },
    {
      label: "Active Vehicles",
      value: activeVehicles,
      sub: `${totalCars} total`,
      href: "/admin/cars",
      icon: Car,
      color: "text-emerald-400",
    },
    {
      label: "Pending Approvals",
      value: pendingApprovals,
      sub: "awaiting review",
      href: "/admin/vendors",
      icon: MessageSquare,
      color: "text-yellow-400",
    },
  ];

  return (
    <AdminShell>
      <div className="space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-white/40">Admin panel</p>
          <h1 className="mt-3 text-4xl font-display text-white">Dashboard</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
            Overview of your travel platform. Manage vendors, cars, and enquiries from one place.
          </p>
        </div>

        {/* Metric blocks */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.label}
                href={card.href}
                className="group rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20 transition hover:bg-white/[0.07] hover:border-white/20"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/40">{card.label}</p>
                    <p className={`mt-3 text-5xl font-display ${card.color}`}>{card.value}</p>
                    <p className="mt-1 text-xs text-white/40">{card.sub}</p>
                  </div>
                  <Icon size={28} className="mt-1 text-white/20 transition group-hover:text-white/40" />
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-white/30 transition group-hover:text-white/50">
                  Manage <ArrowRight size={12} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick links */}
        <div className="grid gap-5 sm:grid-cols-3">
          <Link
            href="/admin/vendors"
            className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20 transition hover:bg-white/[0.07] hover:border-white/20"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
              <Users size={22} className="text-gold-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Vendor Management</p>
              <p className="text-xs text-white/50">Approve, reject, view profiles</p>
            </div>
            <ArrowRight size={16} className="ml-auto text-white/30" />
          </Link>
          <Link
            href="/admin/cars"
            className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20 transition hover:bg-white/[0.07] hover:border-white/20"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
              <Car size={22} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Car Management</p>
              <p className="text-xs text-white/50">Activate/deactivate vehicles</p>
            </div>
            <ArrowRight size={16} className="ml-auto text-white/30" />
          </Link>
          <Link
            href="/admin"
            className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20 transition hover:bg-white/[0.07] hover:border-white/20"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
              <MessageSquare size={22} className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Enquiries</p>
              <p className="text-xs text-white/50">View contact form submissions</p>
            </div>
            <ArrowRight size={16} className="ml-auto text-white/30" />
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
