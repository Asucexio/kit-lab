"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "../../../lib/api";
import LivePreview from "../../../components/LivePreview";
import CodeBlock from "../../../components/CodeBlock";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TABS = ["Preview", "Code", "Install"];

export default function ComponentDetailPage() {
  const { slug } = useParams();
  const [component, setComponent] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("Preview");

  useEffect(() => {
    api
      .getComponent(slug)
      .then(({ component }) => setComponent(component))
      .catch((err) => setError(err.message));
  }, [slug]);

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-red-300">Couldn't find that component: {error}</p>
        <Link href="/" className="mt-4 inline-block text-sm text-accent">
          ← Back to registry
        </Link>
      </div>
    );
  }

  if (!component) {
    return <p className="py-16 text-sm text-muted">Loading…</p>;
  }

  return (
    <div className="py-12">
      <Link href="/" className="font-mono text-xs text-muted hover:text-accent">
        ← back
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-mono text-3xl font-semibold text-ink">{component.name}</h1>
          <p className="mt-2 max-w-xl text-muted">{component.description}</p>
          <p className="mt-3 font-mono text-xs text-muted">
            {component.category} · by {component.profiles?.name}
          </p>
        </div>
        {component.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {component.tags.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        )}
      </div>

      <Tabs className="mt-8">
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t} onClick={() => setTab(t)} active={tab === t}>
              {t}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent active={tab === "Preview"}>
          <LivePreview code={component.code} />
        </TabsContent>

        <TabsContent active={tab === "Code"}>
          <CodeBlock code={component.code} />
        </TabsContent>

        <TabsContent active={tab === "Install"}>
          <div className="space-y-5">
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-wide text-muted">
                1. Install dependencies
              </p>
              <CodeBlock code={component.install_command} language="bash" />
            </div>
            {component.dependencies?.length > 0 && (
              <div>
                <p className="mb-2 font-mono text-xs uppercase tracking-wide text-muted">
                  Depends on
                </p>
                <div className="flex flex-wrap gap-2">
                  {component.dependencies.map((d) => (
                    <Badge key={d} className="rounded-md bg-surface text-ink">{d}</Badge>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-wide text-muted">
                2. Copy the component
              </p>
              <CodeBlock code={component.code} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}