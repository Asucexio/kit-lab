"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../lib/auth-context";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { confirmedImmediately } = await register(name, email, password);
      if (confirmedImmediately) {
        router.push("/dashboard");
      } else {
        setCheckEmail(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (checkEmail) {
    return (
      <div className="mx-auto max-w-sm py-20 text-center">
        <h1 className="font-mono text-2xl font-semibold text-ink">Check your email</h1>
        <p className="mt-3 text-sm text-muted">
          We sent a confirmation link to <span className="text-ink">{email}</span>. Once you
          confirm, you can log in.
        </p>
        <Link href="/login" className="mt-6 inline-block text-sm text-accent">
          Go to log in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm py-20">
      <h1 className="font-mono text-2xl font-semibold text-ink">Create an account</h1>
      <p className="mt-2 text-sm text-muted">Publish and manage your own components.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block font-mono text-xs text-muted">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block font-mono text-xs text-muted">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block font-mono text-xs text-muted">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
          />
          <p className="mt-1 font-mono text-[11px] text-muted">At least 6 characters.</p>
        </div>

        {error && <p className="text-sm text-red-300">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md border border-accent/40 bg-accent/10 px-3 py-2 font-mono text-sm font-medium text-accent transition hover:bg-accent/20 disabled:opacity-50"
        >
          {loading ? "Creating account…" : "Sign up"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-accent">
          Log in
        </Link>
      </p>
    </div>
  );
}
