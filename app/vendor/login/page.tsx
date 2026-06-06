"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SESSION_KEY = "equila_vendor_session";

export default function VendorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      try {
        const session = JSON.parse(raw);
        if (session?.id && session?.role === "vendor") {
          router.replace("/vendor/dashboard");
        }
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Login failed.");
      }

      if (data.session?.role !== "vendor") {
        throw new Error("This portal is for vendors only.");
      }

      localStorage.setItem(SESSION_KEY, JSON.stringify(data.session));
      router.push("/vendor/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-royal-900 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/25 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-white/40">
            Vendor portal
          </p>
          <h1 className="mt-3 text-3xl font-display text-white">
            Partner Login
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Sign in to manage your fleet.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] uppercase tracking-[0.35em] text-white/50 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="vendor@example.com"
              className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.35em] text-white/50 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder="Enter your password"
              className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-gold-500"
            />
          </div>

          {error ? <p className="text-sm text-red-300">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gold-500 px-4 py-3 text-sm font-semibold text-royal-900 transition hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </section>
  );
}
