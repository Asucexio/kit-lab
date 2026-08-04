"use client";

import { useState } from "react";
import LivePreview from "./LivePreview";

const CATEGORIES = ["Buttons", "Cards", "Inputs", "Navigation", "Feedback", "Layout", "Other"];

const DEFAULT_CODE = `function MyComponent() {
  return (
    <div style={{ padding: "16px", color: "white" }}>
      Hello from your component
    </div>
  );
}

render(<MyComponent />);`;

export default function ComponentForm({ initial, onSubmit, submitLabel }) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [category, setCategory] = useState(initial?.category || CATEGORIES[0]);
  const [code, setCode] = useState(initial?.code || DEFAULT_CODE);
  const [installCommand, setInstallCommand] = useState(initial?.install_command || "npm install react");
  const [dependencies, setDependencies] = useState((initial?.dependencies || []).join(", "));
  const [tags, setTags] = useState((initial?.tags || []).join(", "));
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await onSubmit({
        name,
        description,
        category,
        code,
        install_command: installCommand,
        dependencies: dependencies
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean),
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <div>
          <label className="mb-1 block font-mono text-xs text-muted">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Gradient Button"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block font-mono text-xs text-muted">Description</label>
          <textarea
            required
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short sentence about what it does."
            className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block font-mono text-xs text-muted">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block font-mono text-xs text-muted">Install command</label>
          <input
            required
            value={installCommand}
            onChange={(e) => setInstallCommand(e.target.value)}
            placeholder="npm install clsx"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 font-mono text-sm text-ink focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block font-mono text-xs text-muted">
            Dependencies (comma separated)
          </label>
          <input
            value={dependencies}
            onChange={(e) => setDependencies(e.target.value)}
            placeholder="clsx, lucide-react"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 font-mono text-sm text-ink focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block font-mono text-xs text-muted">Tags (comma separated)</label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="button, gradient, interactive"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 font-mono text-sm text-ink focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block font-mono text-xs text-muted">
            Component code — call render(&lt;YourComponent /&gt;) at the end
          </label>
          <textarea
            required
            rows={14}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="w-full resize-y rounded-md border border-border bg-surface px-3 py-2 font-mono text-xs text-ink focus:border-accent focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-300">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="rounded-md border border-accent/40 bg-accent/10 px-4 py-2 font-mono text-sm font-medium text-accent transition hover:bg-accent/20 disabled:opacity-50"
        >
          {saving ? "Saving…" : submitLabel}
        </button>
      </div>

      <div>
        <p className="mb-2 font-mono text-xs uppercase tracking-wide text-muted">Live preview</p>
        <div className="sticky top-6">
          <LivePreview code={code} />
        </div>
      </div>
    </form>
  );
}
