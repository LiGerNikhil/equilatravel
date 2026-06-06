"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VendorRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Registration failed.");
      }

      setSuccess("Registration successful! Your account is pending admin approval.");
      setTimeout(() => router.push("/vendor/login"), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-royal-900 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/25 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-white/40">
            Partner registration
          </p>
          <h1 className="mt-3 text-3xl font-display text-white">
            Become a Partner
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Register your fleet and start accepting bookings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] uppercase tracking-[0.35em] text-white/50 mb-2">
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              placeholder="Your name"
              className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-gold-500"
            />
          </div>

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
              minLength={6}
              placeholder="Min 6 characters"
              className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-gold-500"
            />
          </div>

          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-300">{success}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gold-500 px-4 py-3 text-sm font-semibold text-royal-900 transition hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/40">
          Already registered?{" "}
          <Link href="/vendor/login" className="text-gold-500 hover:text-gold-400">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
