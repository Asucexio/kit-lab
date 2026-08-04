"use client";

import Link from "next/link";
import { useAuth } from "../lib/auth-context";

export default function Navbar() {
  const { user, ready, logout } = useAuth();

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-mono text-lg font-semibold">
          <span className="text-accent">kit</span>
          <span className="text-muted">/</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-muted transition hover:text-ink">
            Browse
          </Link>
          {ready && user && (
            <Link href="/dashboard" className="text-muted transition hover:text-ink">
              Dashboard
            </Link>
          )}
          {ready && user && (
            <Link
              href="/dashboard/new"
              className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 font-medium text-accent transition hover:bg-accent/20"
            >
              + Publish
            </Link>
          )}
          {ready && !user && (
            <>
              <Link href="/login" className="text-muted transition hover:text-ink">
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 font-medium text-accent transition hover:bg-accent/20"
              >
                Sign up
              </Link>
            </>
          )}
          {ready && user && (
            <button onClick={logout} className="text-muted transition hover:text-ink">
              Log out
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
