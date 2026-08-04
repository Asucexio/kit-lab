"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import ComponentCard from "../components/ComponentCard";

const CATEGORIES = ["All", "Buttons", "Cards", "Inputs", "Navigation", "Feedback", "Layout", "Other"];

export default function HomePage() {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      api
        .listComponents({ search, category: category === "All" ? "" : category })
        .then(({ components }) => setComponents(components))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 200);
    return () => clearTimeout(timeout);
  }, [search, category]);

  return (
    <div>
      <section className="border-b border-border py-16">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          component registry
        </p>
        <h1 className="mt-3 max-w-2xl font-mono text-4xl font-semibold leading-tight text-ink">
          Every component here ships with the code and the install command.
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          Browse UI pieces published by other developers. Preview them live, read the source,
          and copy the install command straight into your project.
        </p>
      </section>

      <section className="py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search components…"
            className="w-full max-w-sm rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
          />
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-3 py-1 font-mono text-xs transition ${
                  category === c
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted hover:text-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            Couldn't load components: {error}
          </p>
        )}

        {loading && !error && <p className="text-sm text-muted">Loading…</p>}

        {!loading && !error && components.length === 0 && (
          <p className="rounded-md border border-border bg-surface p-8 text-center text-sm text-muted">
            Nothing matches yet. Try a different search, or{" "}
            <a href="/dashboard/new" className="text-accent">
              publish the first one
            </a>
            .
          </p>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {components.map((c) => (
            <ComponentCard key={c.id} component={c} />
          ))}
        </div>
      </section>
    </div>
  );
}
