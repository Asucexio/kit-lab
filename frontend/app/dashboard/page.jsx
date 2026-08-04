"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth-context";
import { api } from "../../lib/api";

export default function DashboardPage() {
  const { user, token, ready } = useAuth();
  const router = useRouter();
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ready && !user) router.push("/login");
  }, [ready, user, router]);

  useEffect(() => {
    if (!user || !token) return;
    api
      .myComponents(token)
      .then(({ components }) => setComponents(components))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user, token]);

  async function handleDelete(id) {
    if (!confirm("Delete this component? This can't be undone.")) return;
    try {
      await api.deleteComponent(token, id);
      setComponents((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  if (!ready || !user) return null;

  return (
    <div className="py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl font-semibold text-ink">Your components</h1>
          <p className="mt-1 text-sm text-muted">Signed in as {user.name}</p>
        </div>
        <Link
          href="/dashboard/new"
          className="rounded-md border border-accent/40 bg-accent/10 px-4 py-2 font-mono text-sm font-medium text-accent transition hover:bg-accent/20"
        >
          + Publish new
        </Link>
      </div>

      {loading && <p className="mt-8 text-sm text-muted">Loading…</p>}
      {error && <p className="mt-8 text-sm text-red-300">{error}</p>}

      {!loading && !error && components.length === 0 && (
        <p className="mt-8 rounded-md border border-border bg-surface p-8 text-center text-sm text-muted">
          You haven't published anything yet.{" "}
          <Link href="/dashboard/new" className="text-accent">
            Publish your first component
          </Link>
          .
        </p>
      )}

      <div className="mt-8 divide-y divide-border rounded-lg border border-border">
        {components.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-5 py-4">
            <div>
              <Link href={`/components/${c.slug}`} className="font-medium text-ink hover:text-accent">
                {c.name}
              </Link>
              <p className="mt-1 font-mono text-xs text-muted">
                {c.category} {!c.published && "· unpublished"}
              </p>
            </div>
            <div className="flex gap-4 font-mono text-xs">
              <Link href={`/dashboard/edit/${c.id}`} className="text-muted hover:text-accent">
                edit
              </Link>
              <button onClick={() => handleDelete(c.id)} className="text-muted hover:text-red-300">
                delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
