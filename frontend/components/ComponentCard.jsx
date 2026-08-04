import Link from "next/link";
import LivePreview from "./LivePreview";

export default function ComponentCard({ component }) {
  return (
    <Link
      href={`/components/${component.slug}`}
      className="group block overflow-hidden rounded-lg border border-border bg-surface transition hover:border-accent/50"
    >
      <div className="pointer-events-none scale-[0.85]">
        <LivePreview code={component.code} className="rounded-none border-0 border-b border-border" />
      </div>
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="font-medium text-ink group-hover:text-accent">{component.name}</h3>
          <span className="font-mono text-[11px] uppercase tracking-wide text-muted">
            {component.category}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-muted">{component.description}</p>
        <p className="mt-3 font-mono text-[11px] text-muted">by {component.profiles?.name}</p>
      </div>
    </Link>
  );
}
